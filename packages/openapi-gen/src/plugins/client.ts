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

/** Convert an inline schema to a TypeScript type string (for use in return/param positions). */
function inlineSchemaToTs(schema: SchemaObject | ReferenceObject): string {
  if (isRef(schema)) return refToTypeName((schema as ReferenceObject).$ref)
  const s = schema as SchemaObject
  if (Array.isArray(s.type)) {
    return (s.type as string[]).map((t) => (t === 'null' ? 'null' : primitiveToTs(t))).join(' | ')
  }
  if (s.type === 'array') {
    const items = (s as OpenAPIV3_1.ArraySchemaObject).items as SchemaObject | ReferenceObject | undefined
    if (items !== undefined) return `${inlineSchemaToTs(items)}[]`
    return 'unknown[]'
  }
  if (s.type === 'object') return 'Record<string, unknown>'
  if (s.type !== undefined) return primitiveToTs(s.type as string)
  return 'unknown'
}

function resolveSchema(schema: SchemaObject | ReferenceObject): { typeName: string; isArray: boolean } {
  if (isRef(schema)) {
    return { typeName: refToTypeName((schema as ReferenceObject).$ref), isArray: false }
  }
  const s = schema as SchemaObject
  if (s.type === 'array') {
    const items = (s as OpenAPIV3_1.ArraySchemaObject).items as SchemaObject | ReferenceObject | undefined
    if (items !== undefined) {
      if (isRef(items)) {
        return { typeName: refToTypeName((items as ReferenceObject).$ref), isArray: true }
      }
      // primitive array
      return { typeName: primitiveToTs((items as SchemaObject).type as string), isArray: true }
    }
  }
  // For inline objects and primitives, emit the full inline type string
  const inlineTs = inlineSchemaToTs(s)
  return { typeName: inlineTs, isArray: false }
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
  if (s.type === 'array') {
    const items = (s as OpenAPIV3_1.ArraySchemaObject).items as SchemaObject | undefined
    if (items !== undefined && (items.type === 'integer' || items.type === 'number')) {
      return 'number[]'
    }
    return 'string[]'
  }
  // String enum → union literal type (e.g. 'active' | 'inactive')
  if (s.type === 'string' && Array.isArray(s.enum) && s.enum.length > 0) {
    return (s.enum as string[]).map((v) => `'${v}'`).join(' | ')
  }
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

function resolveParamRef(
  p: ParameterObject | ReferenceObject,
  spec: OpenAPIV3_1.Document,
): ParameterObject | null {
  if (!isRef(p)) return p as ParameterObject
  const ref = (p as ReferenceObject).$ref
  // Only support local component refs: #/components/parameters/Name
  const match = /^#\/components\/parameters\/(.+)$/.exec(ref)
  if (match === null) return null
  const name = match[1]!
  const params = spec.components?.parameters as Record<string, ParameterObject | ReferenceObject> | undefined
  if (params === undefined) return null
  const resolved = params[name]
  if (resolved === undefined || isRef(resolved)) return null
  return resolved as ParameterObject
}

function getPathParams(operation: OperationObject, spec: OpenAPIV3_1.Document): string[] {
  const params = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (params === undefined) return []
  return params
    .map((p) => resolveParamRef(p, spec))
    .filter((p): p is ParameterObject => p !== null && p.in === 'path')
    .map((p) => p.name)
}

interface QueryParam {
  name: string
  type: string
  required: boolean
}

function getQueryParams(operation: OperationObject, spec: OpenAPIV3_1.Document): QueryParam[] {
  const params = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (params === undefined) return []
  return params
    .map((p) => resolveParamRef(p, spec))
    .filter((p): p is ParameterObject => p !== null && p.in === 'query')
    .map((p) => ({
      name: p.name,
      type: queryParamType(p.schema as SchemaObject | ReferenceObject | undefined),
      required: p.required === true,
    }))
}

// Feature 2: Header parameters
interface HeaderParam {
  name: string       // camelCase JS identifier (e.g. xStripeSignature)
  headerName: string // original HTTP header name (e.g. 'X-Stripe-Signature')
  required: boolean
  type: string
}

function headerNameToCamelCase(headerName: string): string {
  const parts = headerName.split('-')
  return parts
    .map((part, i) => {
      const lower = part.toLowerCase()
      if (i === 0) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')
}

function getHeaderParams(operation: OperationObject, spec: OpenAPIV3_1.Document): HeaderParam[] {
  const params = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (params === undefined) return []
  return params
    .map((p) => resolveParamRef(p, spec))
    .filter((p): p is ParameterObject => p !== null && p.in === 'header')
    .map((p) => ({
      name: headerNameToCamelCase(p.name),
      headerName: p.name,
      required: p.required === true,
      type: queryParamType(p.schema as SchemaObject | ReferenceObject | undefined),
    }))
}

// Feature 4: Multipart/form-data request body info
interface MultipartField {
  name: string
  required: boolean
  isBinary: boolean
}

interface RequestBodyInfo {
  typeName: string
  kind: 'json' | 'multipart'
  multipartFields?: MultipartField[]
}

function getRequestBodyInfo(operation: OperationObject): RequestBodyInfo | undefined {
  const requestBody = operation.requestBody as RequestBodyObject | ReferenceObject | undefined
  if (requestBody === undefined) return undefined
  if (isRef(requestBody)) return undefined

  const rb = requestBody as RequestBodyObject
  const content = rb.content as Record<string, { schema?: SchemaObject | ReferenceObject }> | undefined
  if (content === undefined) return undefined

  // Check for multipart/form-data first
  const multipartContent = content['multipart/form-data']
  if (multipartContent !== undefined && multipartContent.schema !== undefined) {
    const schema = multipartContent.schema
    if (!isRef(schema)) {
      const s = schema as SchemaObject
      const properties = s.properties as Record<string, SchemaObject | ReferenceObject> | undefined
      const required = (s.required as string[]) ?? []

      const fields: MultipartField[] = []
      const tsParts: string[] = []

      if (properties !== undefined) {
        for (const [fieldName, fieldSchema] of Object.entries(properties)) {
          const isRequired = required.includes(fieldName)
          let isBinary = false
          let tsType = 'string'

          if (!isRef(fieldSchema)) {
            const fs = fieldSchema as SchemaObject
            if (fs.format === 'binary') {
              isBinary = true
              tsType = 'File | Blob'
            } else {
              tsType = primitiveToTs(fs.type as string | undefined)
            }
          }

          fields.push({ name: fieldName, required: isRequired, isBinary })
          tsParts.push(`  ${fieldName}${isRequired ? '' : '?'}: ${tsType}`)
        }
      }

      const typeName = `{ ${tsParts.map((p) => p.trim()).join('; ')} }`
      return { typeName, kind: 'multipart', multipartFields: fields }
    }
  }

  // Fall back to JSON
  const jsonContent = content['application/json']
  if (jsonContent === undefined || jsonContent.schema === undefined) return undefined

  const schema = jsonContent.schema
  return { typeName: inlineSchemaToTs(schema), kind: 'json' }
}

/** Feature 4: Collect non-2xx error responses that have a JSON $ref schema and return @throws tags */
function getThrowsTags(
  operation: OperationObject,
): string[] {
  const responses = operation.responses as Record<string, ResponseObject | ReferenceObject> | undefined
  if (responses === undefined) return []

  const errorStatusCodes = ['400', '401', '403', '404', '409', '422', '429', '500']
  const tags: string[] = []

  for (const code of errorStatusCodes) {
    const response = responses[code]
    if (response === undefined) continue
    if (isRef(response)) continue

    const resp = response as ResponseObject
    const content = resp.content as Record<string, { schema?: SchemaObject | ReferenceObject }> | undefined
    if (content === undefined) continue

    const jsonContent = content['application/json']
    if (jsonContent === undefined || jsonContent.schema === undefined) continue

    const schema = jsonContent.schema
    // Only include $ref-based schemas (inline schemas are too complex to name)
    if (!isRef(schema)) continue

    const typeName = refToTypeName((schema as ReferenceObject).$ref)
    tags.push(` * @throws {ApiError<${code}, ${typeName}>}`)
  }

  return tags
}

function generateFunctionCode(
  funcName: string,
  method: string,
  path: string,
  pathParams: string[],
  queryParams: QueryParam[],
  headerParams: HeaderParam[],
  bodyInfo: RequestBodyInfo | undefined,
  returnType: { typeName: string; isArray: boolean; isVoid: boolean },
  deprecated: boolean,
  throwsTags: string[],
): string {
  const lines: string[] = []

  // Build function signature
  const sigParts: string[] = []
  // Path params first (positional)
  for (const param of pathParams) {
    sigParts.push(`${param}: string`)
  }
  // Body param
  if (bodyInfo !== undefined) {
    sigParts.push(`body: ${bodyInfo.typeName}`)
  }

  // Query params + header params share the same params object
  const allParamFields: string[] = []
  for (const qp of queryParams) {
    allParamFields.push(`  ${qp.name}${qp.required ? '' : '?'}: ${qp.type}`)
  }
  for (const hp of headerParams) {
    allParamFields.push(`  ${hp.name}${hp.required ? '' : '?'}: ${hp.type}`)
  }

  if (allParamFields.length > 0) {
    const hasRequired =
      queryParams.some((qp) => qp.required) || headerParams.some((hp) => hp.required)
    sigParts.push(`params${hasRequired ? '' : '?'}: {\n${allParamFields.join('\n')}\n}`)
  }

  // Per-request config override — enables SSR without mutating the global singleton
  sigParts.push(`config?: Partial<ClientConfig>`)

  const returnTs = returnType.isVoid
    ? 'Promise<void>'
    : returnType.isArray
      ? `Promise<${returnType.typeName}[]>`
      : `Promise<${returnType.typeName}>`

  // Feature 1 + 4: JSDoc block with @deprecated and/or @throws tags
  const hasJsDoc = deprecated || throwsTags.length > 0
  if (hasJsDoc) {
    lines.push(`/**`)
    if (deprecated) {
      lines.push(` * @deprecated`)
    }
    for (const tag of throwsTags) {
      lines.push(tag)
    }
    lines.push(` */`)
  }

  lines.push(`export async function ${funcName}(${sigParts.join(', ')}): ${returnTs} {`)
  lines.push(`  const { baseUrl, token, credentials, headers, onError } = { ...getConfig(), ...config }`)

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
      if (qp.type.endsWith('[]')) {
        // Array params: use append in a loop
        lines.push(`  if (params?.${qp.name} != null) { for (const v of params.${qp.name}) searchParams.append('${qp.name}', String(v)) }`)
      } else if (qp.type === 'number') {
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
  if (bodyInfo !== undefined && bodyInfo.kind === 'json') {
    fetchHeaders.push(`      'Content-Type': 'application/json',`)
  }
  fetchHeaders.push(`      ...headers,`)
  fetchHeaders.push(`      ...(resolvedToken ? { Authorization: \`Bearer \${resolvedToken}\` } : {}),`)

  // Add header params to fetch headers
  for (const hp of headerParams) {
    fetchHeaders.push(`      ...(params?.${hp.name} != null ? { '${hp.headerName}': params.${hp.name} } : {}),`)
  }

  // Build multipart FormData if applicable
  if (bodyInfo !== undefined && bodyInfo.kind === 'multipart' && bodyInfo.multipartFields !== undefined) {
    lines.push(`  const formData = new FormData()`)
    for (const field of bodyInfo.multipartFields) {
      if (field.isBinary) {
        lines.push(`  if (body.${field.name} != null) formData.append('${field.name}', body.${field.name})`)
      } else {
        lines.push(`  if (body.${field.name} != null) formData.append('${field.name}', String(body.${field.name}))`)
      }
    }
  }

  // Build fetch options
  const fetchLines: string[] = []
  fetchLines.push(`  const res = await fetch(finalUrl, {`)
  fetchLines.push(`    method: '${method.toUpperCase()}',`)
  fetchLines.push(`    credentials,`)
  fetchLines.push(`    headers: {`)
  fetchLines.push(...fetchHeaders)
  fetchLines.push(`    },`)
  if (bodyInfo !== undefined) {
    if (bodyInfo.kind === 'multipart') {
      fetchLines.push(`    body: formData,`)
    } else {
      fetchLines.push(`    body: JSON.stringify(body),`)
    }
  }
  fetchLines.push(`  })`)

  lines.push(...fetchLines)
  if (returnType.isVoid) {
    lines.push(`  if (!res.ok) {`)
    lines.push(`    const err = new ApiError(res.status, null)`)
    lines.push(`    onError?.(err)`)
    lines.push(`    throw err`)
    lines.push(`  }`)
  } else {
    lines.push(`  if (!res.ok) {`)
    lines.push(`    const err = new ApiError(res.status, await res.json().catch(() => null))`)
    lines.push(`    onError?.(err)`)
    lines.push(`    throw err`)
    lines.push(`  }`)
    lines.push(`  return res.json()`)
  }

  lines.push(`}`)

  return lines.join('\n')
}

/** Built-in TypeScript types that must NOT be imported from ./models */
const BUILTIN_TS_TYPES = new Set([
  'string', 'number', 'boolean', 'unknown', 'void', 'null', 'undefined', 'any', 'never',
])

/**
 * Returns true only for simple identifiers (e.g. "Task", "CreateTaskRequest") that are
 * safe to include in an `import type { … }` statement.
 * Filters out inline type expressions ("Record<string, unknown>"), arrays ("Task[]"),
 * union types ("string | null"), and built-in TS primitives.
 */
function isImportableType(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) && !BUILTIN_TS_TYPES.has(name)
}

// Feature 3: Cookie auth detection
export function hasCookieAuth(spec: OpenAPIV3_1.Document): boolean {
  const schemes = spec.components?.securitySchemes
  if (!schemes) return false
  return Object.values(schemes).some(
    (s) => !isRef(s) && (s as any).type === 'apiKey' && (s as any).in === 'cookie'
  )
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

        const pathParams = getPathParams(operation, spec)
        const queryParams = getQueryParams(operation, spec)
        const headerParams = getHeaderParams(operation, spec)
        const bodyInfo = getRequestBodyInfo(operation)
        const returnType = getReturnType(operation)
        const deprecated = operation.deprecated === true
        const throwsTags = getThrowsTags(operation)

        // Collect type names for import — only simple schema identifiers (e.g. "Task"),
        // never inline type expressions (e.g. "Record<string, unknown>") or primitives.
        if (bodyInfo !== undefined && bodyInfo.kind === 'json' && isImportableType(bodyInfo.typeName)) {
          collectedTypeNames.add(bodyInfo.typeName)
        }
        if (!returnType.isVoid && isImportableType(returnType.typeName)) {
          collectedTypeNames.add(returnType.typeName)
        }

        const fnCode = generateFunctionCode(
          funcName,
          method,
          path,
          pathParams,
          queryParams,
          headerParams,
          bodyInfo,
          returnType,
          deprecated,
          throwsTags,
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
    lines.push(`import type { ${sortedTypes.join(', ')} } from './models.js'`)
  }
  lines.push(`import { getConfig, type ClientConfig } from './client-config.js'`)
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
