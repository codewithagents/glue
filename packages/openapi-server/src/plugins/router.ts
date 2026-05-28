import type { OpenAPIV3_1 } from 'openapi-types'
import type { GeneratedFile } from '@codewithagents/openapi-gen'
import { toTypeName } from '@codewithagents/openapi-gen'

type OperationObject = OpenAPIV3_1.OperationObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject
type ParameterObject = OpenAPIV3_1.ParameterObject
type ResponseObject = OpenAPIV3_1.ResponseObject
type RequestBodyObject = OpenAPIV3_1.RequestBodyObject

const SUPPORTED_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const
type SupportedMethod = (typeof SUPPORTED_METHODS)[number]

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRef(obj: unknown): obj is ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj
}

function refToName(ref: string): string {
  const parts = ref.split('/')
  return toTypeName(parts[parts.length - 1]!)
}

function extractPathParamsFromPath(path: string): string[] {
  const matches = path.match(/\{([^}]+)\}/g)
  if (matches === null) return []
  // Keep raw param names — they are used in c.req.param() which must match
  // the actual Hono route pattern (e.g. :job-id requires c.req.param('job-id'))
  return matches.map((m) => m.slice(1, -1))
}

/** Convert OpenAPI path to Hono path: {id} -> :id */
function toHonoPath(openapiPath: string): string {
  return openapiPath.replace(/\{([^}]+)\}/g, ':$1')
}

function resolveParam(
  p: ParameterObject | ReferenceObject,
  spec: OpenAPIV3_1.Document,
): ParameterObject | undefined {
  if (!isRef(p)) return p as ParameterObject
  const refStr = (p as ReferenceObject).$ref
  const name = refToName(refStr)
  const components = spec.components as OpenAPIV3_1.ComponentsObject | undefined
  if (components?.parameters === undefined) return undefined
  const resolved = (components.parameters as Record<string, ParameterObject | ReferenceObject>)[name]
  if (resolved === undefined || isRef(resolved)) return undefined
  return resolved as ParameterObject
}

function deriveServiceName(spec: OpenAPIV3_1.Document): string {
  const title = spec.info?.title ?? ''
  const pascal = title
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  if (pascal.length === 0) return 'ApiService'
  // Guard against numeric-start identifiers (e.g. '1Password Connect' → '_1PasswordConnect')
  const safePascal = /^[0-9]/.test(pascal) ? `_${pascal}` : pascal
  if (safePascal.endsWith('Service')) return safePascal
  return `${safePascal}Service`
}

/**
 * Converts a raw operationId into a valid camelCase JS identifier.
 * Handles kebab-case, snake_case, dots, spaces, parens, braces and other
 * non-alphanumeric separators found in real-world OpenAPI specs.
 * e.g. "post-applePay-sessions"   → "postApplePaySessions"
 * e.g. "calendar.calendars.insert" → "calendarCalendarsInsert"
 * e.g. "Get User Profile"          → "getUserProfile"
 * e.g. "forgotPassword(oneTimeCode)" → "forgotPasswordOneTimeCode"
 */
function sanitizeOperationId(id: string): string {
  const parts = id
    .replace(/'/g, '')           // strip apostrophes without splitting ("user's" → "users")
    .split(/[^a-zA-Z0-9]+/)     // split on any non-alphanumeric sequence
    .filter(Boolean)
  if (parts.length === 0) return 'unknown'
  const [first = '', ...rest] = parts
  const camel =
    first.charAt(0).toLowerCase() +
    first.slice(1) +
    rest.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
  // If result starts with a digit, prefix with underscore
  return /^[0-9]/.test(camel) ? `_${camel}` : camel
}

function deriveMethodName(operationId: string | undefined, method: string, path: string): string {
  if (operationId !== undefined && operationId.length > 0) {
    return sanitizeOperationId(operationId)
  }
  return deriveOperationName(method, path)
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

  const segments = path.replace(/^\/api\/v\d+\//, '').replace(/^\//, '')
  const parts = segments.split('/').map((seg) => {
    // Handle mixed segments like "{maxLat}.{format}" — extract each {param} inside
    const paramMatches = seg.match(/\{([^}]+)\}/g)
    if (paramMatches !== null && !(seg.startsWith('{') && seg.endsWith('}'))) {
      return paramMatches
        .map((m) => {
          const name = sanitizeOperationId(m.slice(1, -1))
          return 'By' + name.charAt(0).toUpperCase() + name.slice(1)
        })
        .join('')
    }
    if (seg.startsWith('{') && seg.endsWith('}')) {
      const name = seg.slice(1, -1)
      const sanitized = sanitizeOperationId(name)
      return 'By' + sanitized.charAt(0).toUpperCase() + sanitized.slice(1)
    }
    return toTypeName(seg)
  })

  return prefix + parts.join('')
}

interface QueryParam {
  name: string
  tsType: string
  required: boolean
}

/** Normalize a raw query param name to a valid TypeScript identifier.
 *  Strips trailing [] (array marker), converts separators to camelCase.
 */
function normalizeParamName(name: string): string {
  return name
    .replace(/\[\]$/, '')   // strip trailing []
    .replace(/'/g, '')
    .replace(/[^a-zA-Z0-9]+([a-zA-Z])/g, (_, char: string) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]+$/, '')
    .replace(/^[^a-zA-Z_$]/, '_')
}

function getQueryParams(operation: OperationObject, spec: OpenAPIV3_1.Document): QueryParam[] {
  const parameters = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (parameters === undefined) return []

  const result: QueryParam[] = []
  for (const p of parameters) {
    const resolved = resolveParam(p, spec)
    if (resolved === undefined || resolved.in !== 'query') continue

    const schema = resolved.schema as OpenAPIV3_1.SchemaObject | ReferenceObject | undefined
    let tsType = 'string'
    if (schema !== undefined && !isRef(schema)) {
      const s = schema as OpenAPIV3_1.SchemaObject
      if (s.type === 'number' || s.type === 'integer') tsType = 'number'
      else if (s.type === 'boolean') tsType = 'boolean'
    }

    result.push({
      name: normalizeParamName(resolved.name),
      tsType,
      required: resolved.required === true,
    })
  }
  return result
}

interface BodyInfo {
  typeName: string | undefined
}

function getBodyInfo(operation: OperationObject): BodyInfo | undefined {
  const requestBody = operation.requestBody as RequestBodyObject | ReferenceObject | undefined
  if (requestBody === undefined) return undefined
  if (isRef(requestBody)) return { typeName: undefined }

  const rb = requestBody as RequestBodyObject
  const content = rb.content as Record<string, { schema?: OpenAPIV3_1.SchemaObject | ReferenceObject }> | undefined
  if (content === undefined) return { typeName: undefined }

  const jsonContent = content['application/json']
  if (jsonContent === undefined || jsonContent.schema === undefined) return { typeName: undefined }

  const schema = jsonContent.schema
  if (isRef(schema)) {
    return { typeName: refToName((schema as ReferenceObject).$ref) }
  }

  return { typeName: undefined }
}

interface ResponseStatus {
  status: 200 | 201 | 204
  isVoid: boolean
}

function getResponseStatus(operation: OperationObject, httpMethod: SupportedMethod): ResponseStatus {
  const responses = operation.responses as Record<string, ResponseObject | ReferenceObject> | undefined

  if (responses !== undefined) {
    // Explicit 201
    if (responses['201'] !== undefined) return { status: 201, isVoid: false }
    // Explicit 204 or delete with no meaningful body
    if (responses['204'] !== undefined) return { status: 204, isVoid: true }
    // Check if 200 has content
    if (responses['200'] !== undefined) {
      const resp = responses['200']
      if (!isRef(resp)) {
        const r = resp as ResponseObject
        const content = r.content as Record<string, unknown> | undefined
        if (content === undefined || Object.keys(content).length === 0) {
          return { status: 204, isVoid: true }
        }
      }
      return { status: 200, isVoid: false }
    }
  }

  // Default: delete -> 204, otherwise 200
  if (httpMethod === 'delete') return { status: 204, isVoid: true }
  return { status: 200, isVoid: false }
}

interface RouteOperation {
  methodName: string
  httpMethod: SupportedMethod
  path: string
  honoPath: string
  pathParams: string[]
  queryParams: QueryParam[]
  bodyInfo: BodyInfo | undefined
  responseStatus: ResponseStatus
}

function collectOperations(spec: OpenAPIV3_1.Document): RouteOperation[] {
  const paths = spec.paths as Record<string, Record<string, OperationObject>> | undefined
  if (paths === undefined) return []

  const operations: RouteOperation[] = []

  for (const [path, pathItem] of Object.entries(paths)) {
    for (const method of SUPPORTED_METHODS) {
      const operation = pathItem[method] as OperationObject | undefined
      if (operation === undefined) continue

      const methodName = deriveMethodName(operation.operationId, method, path)
      const pathParams = extractPathParamsFromPath(path)
      const queryParams = getQueryParams(operation, spec)
      const bodyInfo = getBodyInfo(operation)
      const responseStatus = getResponseStatus(operation, method)

      operations.push({
        methodName,
        httpMethod: method,
        path,
        honoPath: toHonoPath(path),
        pathParams,
        queryParams,
        bodyInfo,
        responseStatus,
      })
    }
  }

  return operations
}

function buildRouteHandler(
  op: RouteOperation,
  indent: string,
  schemaNames?: Set<string>,
): string {
  const lines: string[] = []
  lines.push(`${indent}app.${op.httpMethod}('${op.honoPath}', async (c) => {`)

  // Query params extraction
  if (op.queryParams.length > 0) {
    const fields = op.queryParams
      .map((q) => {
        if (q.tsType === 'number') {
          return `    ${q.name}: c.req.query('${q.name}') !== undefined ? Number(c.req.query('${q.name}')) : undefined`
        }
        return `    ${q.name}: c.req.query('${q.name}') ?? undefined`
      })
      .join(',\n')
    lines.push(`${indent}  const params = {`)
    lines.push(fields)
    lines.push(`${indent}  }`)
  }

  // Body extraction
  let bodyVarName = 'body'
  if (op.bodyInfo !== undefined) {
    const typeAnnotation = op.bodyInfo.typeName !== undefined ? `<${op.bodyInfo.typeName}>` : ''
    lines.push(`${indent}  const body = await c.req.json${typeAnnotation}()`)

    // Zod validation when schema is available
    const schemaName =
      op.bodyInfo.typeName !== undefined ? `${op.bodyInfo.typeName}Schema` : undefined
    if (schemaName !== undefined && schemaNames !== undefined && schemaNames.has(schemaName)) {
      lines.push(
        `${indent}  // Validate request body — returns 422 with Zod issues on failure`,
      )
      lines.push(`${indent}  const parseResult = ${schemaName}.safeParse(body)`)
      lines.push(`${indent}  if (!parseResult.success) {`)
      lines.push(
        `${indent}    return c.json({ error: 'Invalid request body', issues: parseResult.error.issues }, 422)`,
      )
      lines.push(`${indent}  }`)
      lines.push(`${indent}  const validatedBody = parseResult.data`)
      bodyVarName = 'validatedBody'
    }
  }

  // Build service call args
  const serviceArgs: string[] = []
  for (const p of op.pathParams) {
    serviceArgs.push(`c.req.param('${p}')`)
  }
  if (op.bodyInfo !== undefined) {
    serviceArgs.push(bodyVarName)
  }
  if (op.queryParams.length > 0) {
    serviceArgs.push('params')
  }

  const serviceCall = `service.${op.methodName}(${serviceArgs.join(', ')})`

  // Response
  if (op.responseStatus.isVoid) {
    lines.push(`${indent}  await ${serviceCall}`)
    lines.push(`${indent}  return new Response(null, { status: ${op.responseStatus.status} })`)
  } else if (op.responseStatus.status === 201) {
    lines.push(`${indent}  return c.json(await ${serviceCall}, 201)`)
  } else {
    lines.push(`${indent}  return c.json(await ${serviceCall})`)
  }

  lines.push(`${indent}})`)
  return lines.join('\n')
}

interface RouterOptions {
  schemaNames?: Set<string>
  schemaImportPath?: string
}

export function generateRouter(
  spec: OpenAPIV3_1.Document,
  options?: RouterOptions,
): GeneratedFile {
  const serviceName = deriveServiceName(spec)
  const operations = collectOperations(spec)

  // Collect body type names for import from models.js
  const bodyTypes = new Set<string>()
  for (const op of operations) {
    if (op.bodyInfo?.typeName !== undefined) {
      bodyTypes.add(op.bodyInfo.typeName)
    }
  }
  const sortedBodyTypes = Array.from(bodyTypes).sort()

  // Collect which schema names are actually needed (only for ops with a matching schema)
  const usedSchemaNames = new Set<string>()
  if (options?.schemaNames !== undefined) {
    for (const op of operations) {
      const typeName = op.bodyInfo?.typeName
      if (typeName !== undefined) {
        const schemaName = `${typeName}Schema`
        if (options.schemaNames.has(schemaName)) {
          usedSchemaNames.add(schemaName)
        }
      }
    }
  }

  const lines: string[] = []
  lines.push('// This file is auto-generated. Do not edit manually.')
  lines.push('')
  lines.push("import { Hono } from 'hono'")
  if (sortedBodyTypes.length > 0) {
    lines.push(`import type { ${sortedBodyTypes.join(', ')} } from './models.js'`)
  }
  lines.push(`import type { ${serviceName} } from './service.js'`)
  if (usedSchemaNames.size > 0 && options?.schemaImportPath !== undefined) {
    lines.push(`import { z } from 'zod'`)
    const sortedUsedSchemas = Array.from(usedSchemaNames).sort()
    lines.push(
      `import { ${sortedUsedSchemas.join(', ')} } from '${options.schemaImportPath}'`,
    )
  }
  lines.push('')
  lines.push(`export function createRouter(service: ${serviceName}): Hono {`)
  lines.push('  const app = new Hono()')
  lines.push('')

  for (const op of operations) {
    lines.push(buildRouteHandler(op, '  ', options?.schemaNames))
    lines.push('')
  }

  lines.push('  return app')
  lines.push('}')
  lines.push('')

  return {
    filename: 'router.ts',
    content: lines.join('\n'),
  }
}
