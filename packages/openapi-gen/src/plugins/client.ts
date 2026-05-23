import type { OpenAPIV3_1 } from 'openapi-types'
import type { GeneratedFile } from './types.js'

type OperationObject = OpenAPIV3_1.OperationObject
type ParameterObject = OpenAPIV3_1.ParameterObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject
type SchemaObject = OpenAPIV3_1.SchemaObject
type RequestBodyObject = OpenAPIV3_1.RequestBodyObject
type ResponseObject = OpenAPIV3_1.ResponseObject

const SUPPORTED_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const
type SupportedMethod = (typeof SUPPORTED_METHODS)[number]

function refToTypeName(ref: string): string {
  const parts = ref.split('/')
  return parts[parts.length - 1]!
}

function isRef(obj: unknown): obj is ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj
}

function resolveSchema(schema: SchemaObject | ReferenceObject): { typeName: string; isArray: boolean } {
  if (isRef(schema)) {
    return { typeName: refToTypeName((schema as ReferenceObject).$ref), isArray: false }
  }
  const s = schema as SchemaObject
  if (s.type === 'array' && s.items !== undefined) {
    const items = s.items as SchemaObject | ReferenceObject
    if (isRef(items)) {
      return { typeName: refToTypeName((items as ReferenceObject).$ref), isArray: true }
    }
    // primitive array — return inline type
    return { typeName: primitiveToTs((items as SchemaObject).type as string), isArray: true }
  }
  return { typeName: 'unknown', isArray: false }
}

function primitiveToTs(type: string | undefined): string {
  switch (type) {
    case 'string':
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    default:
      return 'unknown'
  }
}

function queryParamType(schema: SchemaObject | ReferenceObject | undefined): string {
  if (schema === undefined) return 'string'
  if (isRef(schema)) return 'string'
  const s = schema as SchemaObject
  if (s.type === 'array') return 'string[]'
  return primitiveToTs(s.type as string | undefined)
}

/** Convert a path like /api/v1/tasks/{id} to a template literal string with encodeURIComponent calls */
function pathToUrlExpression(path: string): string {
  // Replace {param} with ${encodeURIComponent(param)}
  return path.replace(/\{([^}]+)\}/g, (_match, paramName: string) => {
    return `\${encodeURIComponent(${paramName})}`
  })
}

function deriveOperationName(method: string, path: string): string {
  const prefixMap: Record<string, string> = {
    get: 'get',
    post: 'create',
    put: 'update',
    patch: 'patch',
    delete: 'delete',
  }
  const prefix = prefixMap[method] ?? method

  // Strip /api/v1/ prefix
  let segments = path.replace(/^\/api\/v\d+\//, '').replace(/^\//, '')

  // Remove path params (e.g., {id}) — keep the segment name for "ById"
  const parts = segments.split('/').map((seg) => {
    if (seg.startsWith('{') && seg.endsWith('}')) {
      const name = seg.slice(1, -1)
      return 'By' + name.charAt(0).toUpperCase() + name.slice(1)
    }
    return seg.charAt(0).toUpperCase() + seg.slice(1)
  })

  const joined = parts.join('')
  return prefix + joined
}

function getReturnType(operation: OperationObject): { typeName: string; isArray: boolean; isVoid: boolean } {
  const responses = operation.responses as Record<string, ResponseObject | ReferenceObject> | undefined
  if (responses === undefined) return { typeName: 'unknown', isArray: false, isVoid: false }

  // Check 200 first, then 201
  for (const code of ['200', '201']) {
    const response = responses[code]
    if (response === undefined) continue
    if (isRef(response)) continue

    const resp = response as ResponseObject
    const content = resp.content as Record<string, { schema?: SchemaObject | ReferenceObject }> | undefined
    if (content === undefined) continue

    const jsonContent = content['application/json']
    if (jsonContent === undefined || jsonContent.schema === undefined) continue

    const resolved = resolveSchema(jsonContent.schema)
    return { ...resolved, isVoid: false }
  }

  // Check for 204 (no content) or no successful response
  if (responses['204'] !== undefined || Object.keys(responses).length === 0) {
    return { typeName: 'void', isArray: false, isVoid: true }
  }

  // DELETE with no body response
  return { typeName: 'void', isArray: false, isVoid: true }
}

function getPathParams(operation: OperationObject): string[] {
  const params = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (params === undefined) return []
  return params
    .filter((p): p is ParameterObject => !isRef(p) && (p as ParameterObject).in === 'path')
    .map((p) => p.name)
}

interface QueryParam {
  name: string
  type: string
}

function getQueryParams(operation: OperationObject): QueryParam[] {
  const params = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (params === undefined) return []
  return params
    .filter((p): p is ParameterObject => !isRef(p) && (p as ParameterObject).in === 'query')
    .map((p) => ({
      name: p.name,
      type: queryParamType(p.schema as SchemaObject | ReferenceObject | undefined),
    }))
}

function getRequestBodyType(operation: OperationObject): string | undefined {
  const requestBody = operation.requestBody as RequestBodyObject | ReferenceObject | undefined
  if (requestBody === undefined) return undefined
  if (isRef(requestBody)) return undefined

  const rb = requestBody as RequestBodyObject
  const content = rb.content as Record<string, { schema?: SchemaObject | ReferenceObject }> | undefined
  if (content === undefined) return undefined

  const jsonContent = content['application/json']
  if (jsonContent === undefined || jsonContent.schema === undefined) return undefined

  const schema = jsonContent.schema
  if (isRef(schema)) return refToTypeName((schema as ReferenceObject).$ref)

  return 'unknown'
}

function generateFunctionCode(
  funcName: string,
  method: string,
  path: string,
  pathParams: string[],
  queryParams: QueryParam[],
  bodyTypeName: string | undefined,
  returnType: { typeName: string; isArray: boolean; isVoid: boolean },
): string {
  const lines: string[] = []

  // Build function signature
  const sigParts: string[] = []
  // Path params first (positional)
  for (const param of pathParams) {
    sigParts.push(`${param}: string`)
  }
  // Body param
  if (bodyTypeName !== undefined) {
    sigParts.push(`body: ${bodyTypeName}`)
  }
  // Query params as optional object
  if (queryParams.length > 0) {
    const qpFields = queryParams.map((qp) => `  ${qp.name}?: ${qp.type}`).join('\n')
    sigParts.push(`params?: {\n${qpFields}\n}`)
  }

  const returnTs = returnType.isVoid
    ? 'Promise<void>'
    : returnType.isArray
      ? `Promise<${returnType.typeName}[]>`
      : `Promise<${returnType.typeName}>`

  lines.push(`export async function ${funcName}(${sigParts.join(', ')}): ${returnTs} {`)
  lines.push(`  const { baseUrl, token, credentials, headers } = getConfig()`)

  // Build URL
  const urlExpression = pathToUrlExpression(path)
  const hasPathParams = urlExpression !== path
  if (hasPathParams) {
    lines.push(`  const base = baseUrl ? baseUrl.replace(/\\/$/, '') : ''`)
    lines.push(`  const fullUrl = \`\${base}${urlExpression}\``)
  } else {
    lines.push(`  const base = baseUrl ? baseUrl.replace(/\\/$/, '') : ''`)
    lines.push(`  const fullUrl = \`\${base}${path}\``)
  }

  // Query params
  if (queryParams.length > 0) {
    lines.push(`  const searchParams = new URLSearchParams()`)
    for (const qp of queryParams) {
      if (qp.type === 'number') {
        lines.push(`  if (params?.${qp.name} != null) searchParams.set('${qp.name}', String(params.${qp.name}))`)
      } else if (qp.type === 'boolean') {
        lines.push(`  if (params?.${qp.name} != null) searchParams.set('${qp.name}', String(params.${qp.name}))`)
      } else {
        lines.push(`  if (params?.${qp.name} != null) searchParams.set('${qp.name}', String(params.${qp.name}))`)
      }
    }
    lines.push(`  const qs = searchParams.toString()`)
    lines.push(`  const finalUrl = qs ? \`\${fullUrl}?\${qs}\` : fullUrl`)
  } else {
    lines.push(`  const finalUrl = fullUrl`)
  }

  // Token resolution
  lines.push(`  const resolvedToken = typeof token === 'function' ? await token() : token`)

  // Build fetch headers
  const fetchHeaders: string[] = []
  if (bodyTypeName !== undefined) {
    fetchHeaders.push(`      'Content-Type': 'application/json',`)
  }
  fetchHeaders.push(`      ...headers,`)
  fetchHeaders.push(`      ...(resolvedToken ? { Authorization: \`Bearer \${resolvedToken}\` } : {}),`)

  // Build fetch options
  const fetchLines: string[] = []
  fetchLines.push(`  const res = await fetch(finalUrl, {`)
  fetchLines.push(`    method: '${method.toUpperCase()}',`)
  fetchLines.push(`    credentials,`)
  fetchLines.push(`    headers: {`)
  fetchLines.push(...fetchHeaders)
  fetchLines.push(`    },`)
  if (bodyTypeName !== undefined) {
    fetchLines.push(`    body: JSON.stringify(body),`)
  }
  fetchLines.push(`  })`)

  lines.push(...fetchLines)
  if (returnType.isVoid) {
    lines.push(`  if (!res.ok) throw new ApiError(res.status, null)`)
  } else {
    lines.push(`  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null))`)
    lines.push(`  return res.json()`)
  }

  lines.push(`}`)

  return lines.join('\n')
}

export function generateClient(spec: OpenAPIV3_1.Document): GeneratedFile {
  const paths = spec.paths as Record<string, Record<string, OperationObject>> | undefined

  const collectedTypeNames = new Set<string>()
  const functionBlocks: string[] = []

  if (paths !== undefined) {
    for (const [path, pathItem] of Object.entries(paths)) {
      for (const method of SUPPORTED_METHODS) {
        const operation = pathItem[method] as OperationObject | undefined
        if (operation === undefined) continue

        // Derive function name
        let funcName: string
        if (operation.operationId !== undefined) {
          const id = operation.operationId
          funcName = id.charAt(0).toLowerCase() + id.slice(1)
        } else {
          funcName = deriveOperationName(method, path)
        }

        const pathParams = getPathParams(operation)
        const queryParams = getQueryParams(operation)
        const bodyTypeName = getRequestBodyType(operation)
        const returnType = getReturnType(operation)

        // Collect type names for import
        if (bodyTypeName !== undefined && bodyTypeName !== 'unknown') {
          collectedTypeNames.add(bodyTypeName)
        }
        if (!returnType.isVoid && returnType.typeName !== 'unknown') {
          collectedTypeNames.add(returnType.typeName)
        }

        const fnCode = generateFunctionCode(
          funcName,
          method,
          path,
          pathParams,
          queryParams,
          bodyTypeName,
          returnType,
        )
        functionBlocks.push(fnCode)
      }
    }
  }

  // Build file content
  const lines: string[] = []
  lines.push('// This file is auto-generated by @codewithagents/openapi-gen — do not edit')
  lines.push('')

  if (collectedTypeNames.size > 0) {
    const sortedTypes = Array.from(collectedTypeNames).sort()
    lines.push(`import type { ${sortedTypes.join(', ')} } from './models'`)
  }
  lines.push(`import { getConfig } from './client-config'`)
  lines.push('')

  // ApiError class
  lines.push(`export class ApiError extends Error {`)
  lines.push(`  constructor(`)
  lines.push(`    public readonly status: number,`)
  lines.push(`    public readonly body: unknown,`)
  lines.push(`  ) {`)
  lines.push(`    super(\`API error \${status}\`)`)
  lines.push(`    this.name = 'ApiError'`)
  lines.push(`  }`)
  lines.push(`}`)

  for (const fn of functionBlocks) {
    lines.push('')
    lines.push(fn)
  }

  lines.push('')

  return {
    filename: 'client.ts',
    content: lines.join('\n'),
  }
}
