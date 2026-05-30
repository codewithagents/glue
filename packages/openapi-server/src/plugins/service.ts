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

/** Extract path param names in template order (matches {param} in path string) */
function extractPathParamsFromPath(path: string): string[] {
  const matches = path.match(/\{([^}]+)\}/g)
  if (matches === null) return []
  return matches.map((m) => sanitizeOperationId(m.slice(1, -1)))
}

/** Resolve a parameter that may be a $ref */
function resolveParam(
  p: ParameterObject | ReferenceObject,
  spec: OpenAPIV3_1.Document
): ParameterObject | undefined {
  if (!isRef(p)) return p as ParameterObject
  // Resolve from components/parameters
  const refStr = (p as ReferenceObject).$ref
  const name = refToName(refStr)
  const components = spec.components as OpenAPIV3_1.ComponentsObject | undefined
  if (components?.parameters === undefined) return undefined
  const resolved = (components.parameters as Record<string, ParameterObject | ReferenceObject>)[
    name
  ]
  if (resolved === undefined || isRef(resolved)) return undefined
  return resolved as ParameterObject
}

/** Derive service interface name from spec title */
function deriveServiceName(spec: OpenAPIV3_1.Document): string {
  const title = spec.info?.title ?? ''
  // PascalCase: remove non-alphanumeric, capitalize each word
  const pascal = title
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  if (pascal.length === 0) return 'ApiService'
  // Guard against numeric-start identifiers (e.g. '1Password Connect' → '_1PasswordConnect')
  const safePascal = /^[0-9]/.test(pascal) ? `_${pascal}` : pascal
  // Append 'Service' if not already ending in 'Service'
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
    .replace(/'/g, '') // strip apostrophes without splitting ("user's" → "users")
    .split(/[^a-zA-Z0-9]+/) // split on any non-alphanumeric sequence
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

/** Derive method name from operation */
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
    .replace(/\[\]$/, '') // strip trailing []
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
  const content = rb.content as
    | Record<string, { schema?: OpenAPIV3_1.SchemaObject | ReferenceObject }>
    | undefined
  if (content === undefined) return { typeName: undefined }

  const jsonContent = content['application/json']
  if (jsonContent === undefined || jsonContent.schema === undefined) return { typeName: undefined }

  const schema = jsonContent.schema
  if (isRef(schema)) {
    return { typeName: refToName((schema as ReferenceObject).$ref) }
  }

  return { typeName: undefined }
}

interface ReturnInfo {
  typeName: string | undefined
  isArray: boolean
  isVoid: boolean
}

function getReturnInfo(operation: OperationObject): ReturnInfo {
  const responses = operation.responses as
    | Record<string, ResponseObject | ReferenceObject>
    | undefined
  if (responses === undefined) return { typeName: undefined, isArray: false, isVoid: true }

  // Check for 200 or 201 response first
  for (const code of ['200', '201']) {
    const response = responses[code]
    if (response === undefined) continue
    if (isRef(response)) continue

    const resp = response as ResponseObject
    const content = resp.content as
      | Record<string, { schema?: OpenAPIV3_1.SchemaObject | ReferenceObject }>
      | undefined
    if (content === undefined) continue

    const jsonContent = content['application/json']
    if (jsonContent === undefined || jsonContent.schema === undefined) continue

    const schema = jsonContent.schema
    if (isRef(schema)) {
      return {
        typeName: refToName((schema as ReferenceObject).$ref),
        isArray: false,
        isVoid: false,
      }
    }

    const s = schema as OpenAPIV3_1.SchemaObject
    if (s.type === 'array') {
      const items = s.items as OpenAPIV3_1.SchemaObject | ReferenceObject | undefined
      if (items !== undefined && isRef(items)) {
        return {
          typeName: refToName((items as ReferenceObject).$ref),
          isArray: true,
          isVoid: false,
        }
      }
      return { typeName: undefined, isArray: true, isVoid: false }
    }

    return { typeName: undefined, isArray: false, isVoid: false }
  }

  // Check for 204 explicitly
  if (responses['204'] !== undefined) {
    return { typeName: undefined, isArray: false, isVoid: true }
  }

  return { typeName: undefined, isArray: false, isVoid: true }
}

function buildReturnType(info: ReturnInfo): string {
  if (info.isVoid) return 'Promise<void>'
  if (info.typeName !== undefined) {
    return info.isArray ? `Promise<${info.typeName}[]>` : `Promise<${info.typeName}>`
  }
  return info.isArray ? 'Promise<unknown[]>' : 'Promise<unknown>'
}

interface OperationInfo {
  methodName: string
  httpMethod: SupportedMethod
  path: string
  pathParams: string[]
  queryParams: QueryParam[]
  bodyInfo: BodyInfo | undefined
  returnInfo: ReturnInfo
}

function collectOperations(spec: OpenAPIV3_1.Document): OperationInfo[] {
  const paths = spec.paths as Record<string, Record<string, OperationObject>> | undefined
  if (paths === undefined) return []

  const operations: OperationInfo[] = []

  for (const [path, pathItem] of Object.entries(paths)) {
    for (const method of SUPPORTED_METHODS) {
      const operation = pathItem[method] as OperationObject | undefined
      if (operation === undefined) continue

      const methodName = deriveMethodName(operation.operationId, method, path)
      const pathParams = extractPathParamsFromPath(path)
      const queryParams = getQueryParams(operation, spec)
      const bodyInfo = getBodyInfo(operation)
      const returnInfo = getReturnInfo(operation)

      operations.push({
        methodName,
        httpMethod: method,
        path,
        pathParams,
        queryParams,
        bodyInfo,
        returnInfo,
      })
    }
  }

  return operations
}

function buildMethodSignature(op: OperationInfo): string {
  const args: string[] = []

  // Path params as positional string args (in template order)
  for (const p of op.pathParams) {
    args.push(`${p}: string`)
  }

  // Body arg
  if (op.bodyInfo !== undefined) {
    const typeName = op.bodyInfo.typeName ?? 'unknown'
    args.push(`body: ${typeName}`)
  }

  // Query params as optional object
  if (op.queryParams.length > 0) {
    const allOptional = op.queryParams.every((q) => !q.required)
    const fields = op.queryParams
      .map((q) => `${q.name}${q.required ? '' : '?'}: ${q.tsType}`)
      .join('; ')
    const paramsToken = allOptional ? 'params?' : 'params'
    args.push(`${paramsToken}: { ${fields} }`)
  }

  const returnType = buildReturnType(op.returnInfo)
  const argStr = args.join(', ')
  return `${op.methodName}(${argStr}): ${returnType}`
}

export function generateService(spec: OpenAPIV3_1.Document): GeneratedFile {
  const serviceName = deriveServiceName(spec)
  const operations = collectOperations(spec)

  // Collect import types: body types and return types that are named identifiers
  const importTypes = new Set<string>()
  for (const op of operations) {
    if (op.bodyInfo?.typeName !== undefined) {
      importTypes.add(op.bodyInfo.typeName)
    }
    if (op.returnInfo.typeName !== undefined) {
      importTypes.add(op.returnInfo.typeName)
    }
  }

  const sortedImports = Array.from(importTypes).sort()

  const lines: string[] = []
  lines.push('// This file is auto-generated. Do not edit manually.')
  lines.push('')

  if (sortedImports.length > 0) {
    lines.push(`import type { ${sortedImports.join(', ')} } from './models.js'`)
    lines.push('')
  }

  lines.push(`export interface ${serviceName} {`)

  for (const op of operations) {
    lines.push(`  /** ${op.httpMethod.toUpperCase()} ${op.path} */`)
    lines.push(`  ${buildMethodSignature(op)}`)
  }

  lines.push('}')
  lines.push('')

  return {
    filename: 'service.ts',
    content: lines.join('\n'),
  }
}
