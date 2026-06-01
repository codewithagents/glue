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
  // Keep raw param names: they are used in c.req.param() which must match
  // the actual Hono route pattern (e.g. :job-id requires c.req.param('job-id'))
  return matches.map((m) => m.slice(1, -1))
}

/** Convert OpenAPI path to Hono path: {id} -> :id */
function toHonoPath(openapiPath: string): string {
  return openapiPath.replace(/\{([^}]+)\}/g, ':$1')
}

function resolveParam(
  p: ParameterObject | ReferenceObject,
  spec: OpenAPIV3_1.Document
): ParameterObject | undefined {
  if (!isRef(p)) return p as ParameterObject
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

function deriveServiceName(spec: OpenAPIV3_1.Document): string {
  const title = spec.info?.title ?? ''
  const pascal = title
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  if (pascal.length === 0) return 'ApiService'
  // Guard against numeric-start identifiers (e.g. '1Password Connect' -> '_1PasswordConnect')
  const safePascal = /^[0-9]/.test(pascal) ? `_${pascal}` : pascal
  if (safePascal.endsWith('Service')) return safePascal
  return `${safePascal}Service`
}

/**
 * Converts a raw operationId into a valid camelCase JS identifier.
 * Handles kebab-case, snake_case, dots, spaces, parens, braces and other
 * non-alphanumeric separators found in real-world OpenAPI specs.
 * e.g. "post-applePay-sessions"   -> "postApplePaySessions"
 * e.g. "calendar.calendars.insert" -> "calendarCalendarsInsert"
 * e.g. "Get User Profile"          -> "getUserProfile"
 * e.g. "forgotPassword(oneTimeCode)" -> "forgotPasswordOneTimeCode"
 */
function sanitizeOperationId(id: string): string {
  const parts = id
    .replace(/'/g, '') // strip apostrophes without splitting ("user's" -> "users")
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
    // Handle mixed segments like "{maxLat}.{format}": extract each {param} inside
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
  // Split on non-alphanumeric sequences to avoid polynomial ReDoS from [^x]+y patterns.
  const stripped = name.replace(/\[\]$/, '').replace(/'/g, '')
  const parts = stripped.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  if (parts.length === 0) return '_'
  const camel = parts
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join('')
  return /^[^a-zA-Z_$]/.test(camel) ? `_${camel}` : camel
}

function schemaToTsType(schema: OpenAPIV3_1.SchemaObject | ReferenceObject | undefined): string {
  if (schema === undefined || isRef(schema)) return 'string'
  const s = schema as OpenAPIV3_1.SchemaObject
  if (s.type === 'number' || s.type === 'integer') return 'number'
  if (s.type === 'boolean') return 'boolean'
  return 'string'
}

function getQueryParams(operation: OperationObject, spec: OpenAPIV3_1.Document): QueryParam[] {
  const parameters = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (parameters === undefined) return []

  const result: QueryParam[] = []
  for (const p of parameters) {
    const resolved = resolveParam(p, spec)
    if (resolved === undefined || resolved.in !== 'query') continue

    const schema = resolved.schema as OpenAPIV3_1.SchemaObject | ReferenceObject | undefined
    result.push({
      name: normalizeParamName(resolved.name),
      tsType: schemaToTsType(schema),
      required: resolved.required === true,
    })
  }
  return result
}

// ── Param validation helpers ──────────────────────────────────────────────────

/** Represents a path parameter that needs Zod format validation. */
interface PathParamValidation {
  /** Raw name as it appears in the URL path (e.g. 'job-id'). */
  rawName: string
  /** Zod chain expression for the value (e.g. 'z.string().uuid()'). */
  zodExpr: string
}

/** Represents a header parameter to validate. */
interface HeaderParam {
  /** Header name as defined in the spec (e.g. 'x-api-key'). */
  rawName: string
  /** Whether the header is required. */
  required: boolean
}

/**
 * Map a schema format string to a Zod chain modifier.
 * Returns an empty string when no specific format validation is needed.
 */
function formatToZodModifier(format: string): string {
  switch (format) {
    case 'uuid':
      return '.uuid()'
    case 'email':
      return '.email()'
    case 'uri':
    case 'url':
      return '.url()'
    case 'date-time':
      return '.datetime()'
    default:
      return ''
  }
}

/**
 * Build a Zod expression for a path parameter based on its schema.
 * Returns undefined when the parameter does not need format validation
 * (simple string with no format constraint or non-string types used as strings in URLs).
 */
function pathParamZodExpr(
  schema: OpenAPIV3_1.SchemaObject | ReferenceObject | undefined
): string | undefined {
  if (schema === undefined || isRef(schema)) return undefined
  const s = schema as OpenAPIV3_1.SchemaObject
  if (s.type !== 'string') return undefined
  const format = s.format as string | undefined
  if (format === undefined) return undefined
  const modifier = formatToZodModifier(format)
  if (modifier === '') return undefined
  return `z.string()${modifier}`
}

/**
 * Build a Zod expression for a query or header parameter based on its schema.
 * Number/integer types use z.number() (after coercion by extraction code).
 * String types use z.string(). Boolean types use z.boolean().
 * Appends .optional() for non-required params.
 */
function paramZodExpr(
  tsType: string,
  required: boolean,
  schema?: OpenAPIV3_1.SchemaObject | ReferenceObject
): string {
  let base: string
  if (tsType === 'number') {
    base = 'z.number()'
  } else if (tsType === 'boolean') {
    base = 'z.boolean()'
  } else {
    // string
    if (schema !== undefined && !isRef(schema)) {
      const s = schema as OpenAPIV3_1.SchemaObject
      const format = s.format as string | undefined
      const modifier = format !== undefined ? formatToZodModifier(format) : ''
      base = `z.string()${modifier}`
    } else {
      base = 'z.string()'
    }
  }
  return required ? base : `${base}.optional()`
}

/**
 * Collect path parameters that have Zod format constraints.
 * Only returns entries for params that need format validation (e.g. uuid).
 * Simple string params with no format constraint are excluded.
 */
function getPathParamValidations(
  operation: OperationObject,
  spec: OpenAPIV3_1.Document,
  rawPathParamNames: string[]
): PathParamValidation[] {
  const parameters = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (parameters === undefined) return []

  const result: PathParamValidation[] = []
  for (const rawName of rawPathParamNames) {
    // Find the resolved parameter for this path param
    for (const p of parameters) {
      const resolved = resolveParam(p, spec)
      if (resolved === undefined || resolved.in !== 'path') continue
      if (resolved.name !== rawName) continue

      const schema = resolved.schema as OpenAPIV3_1.SchemaObject | ReferenceObject | undefined
      const zodExpr = pathParamZodExpr(schema)
      if (zodExpr !== undefined) {
        result.push({ rawName, zodExpr })
      }
      break
    }
  }
  return result
}

/**
 * Collect header parameters from an operation.
 */
function getHeaderParams(
  operation: OperationObject,
  spec: OpenAPIV3_1.Document
): HeaderParam[] {
  const parameters = operation.parameters as (ParameterObject | ReferenceObject)[] | undefined
  if (parameters === undefined) return []

  const result: HeaderParam[] = []
  for (const p of parameters) {
    const resolved = resolveParam(p, spec)
    if (resolved === undefined || resolved.in !== 'header') continue
    result.push({
      rawName: resolved.name,
      required: resolved.required === true,
    })
  }
  return result
}

/**
 * Determine whether query params need a Zod validation block.
 * Triggered when any param is required or has a non-string type (to catch NaN/invalid input).
 */
function queryParamsNeedValidation(queryParams: QueryParam[]): boolean {
  return queryParams.some((q) => q.required || q.tsType !== 'string')
}

/**
 * Emit Zod validation lines for query parameters into the handler line buffer.
 * Uses the already-extracted params object (after Number() coercion).
 * Uses short variable name _qv to keep the 422 return line under Prettier's print width.
 * @param indent - outer handler indent (e.g. '  ')
 */
function emitQueryValidation(lines: string[], queryParams: QueryParam[], indent: string): void {
  const inner = `${indent}  `
  const fieldIndent = `${indent}    `
  const fields = queryParams
    .map((q) => {
      const expr = paramZodExpr(q.tsType, q.required)
      return `${fieldIndent}${q.name}: ${expr}`
    })
    .join(',\n')
  lines.push(`${inner}// Validate query parameters: returns 422 with Zod issues on failure`)
  lines.push(`${inner}const _qv = z.object({`)
  lines.push(fields)
  lines.push(`${inner}}).safeParse(params)`)
}

/**
 * Emit Zod validation lines for path parameters (format constraints) into the handler line buffer.
 * Uses short variable name _pv to keep the 422 return line under Prettier's print width.
 * @param indent - outer handler indent (e.g. '  ')
 * @param framework - used to generate the correct param accessor syntax
 */
function emitPathValidation(
  lines: string[],
  validations: PathParamValidation[],
  indent: string,
  framework: 'hono' | 'express' | 'fastify'
): void {
  const inner = `${indent}  `
  const fieldIndent = `${indent}    `
  const schemaFields = validations
    .map((v) => {
      const key = /[^a-zA-Z0-9_$]/.test(v.rawName) ? JSON.stringify(v.rawName) : v.rawName
      return `${fieldIndent}${key}: ${v.zodExpr}`
    })
    .join(',\n')
  const rawFields = validations
    .map((v) => {
      const key = /[^a-zA-Z0-9_$]/.test(v.rawName) ? JSON.stringify(v.rawName) : v.rawName
      let access: string
      if (framework === 'hono') {
        access = `c.req.param(${JSON.stringify(v.rawName)})`
      } else if (framework === 'express') {
        access = `req.params[${JSON.stringify(v.rawName)}]`
      } else {
        access = /[^a-zA-Z0-9_$]/.test(v.rawName)
          ? `req.params[${JSON.stringify(v.rawName)}]`
          : `req.params.${v.rawName}`
      }
      return `${fieldIndent}${key}: ${access}`
    })
    .join(',\n')
  lines.push(`${inner}// Validate path parameters: returns 422 with Zod issues on failure`)
  lines.push(`${inner}const _pv = z.object({`)
  lines.push(schemaFields)
  lines.push(`${inner}}).safeParse({`)
  lines.push(rawFields)
  lines.push(`${inner}})`)
}

/**
 * Emit Zod validation lines for header parameters into the handler line buffer.
 * Uses short variable name _hv to keep the 422 return line under Prettier's print width.
 * @param indent - outer handler indent (e.g. '  ')
 * @param framework - used to generate the correct header accessor syntax
 */
function emitHeaderValidation(
  lines: string[],
  headerParams: HeaderParam[],
  indent: string,
  framework: 'hono' | 'express' | 'fastify'
): void {
  const inner = `${indent}  `
  const fieldIndent = `${indent}    `
  const schemaFields = headerParams
    .map((h) => {
      const key = JSON.stringify(h.rawName)
      const expr = h.required ? 'z.string()' : 'z.string().optional()'
      return `${fieldIndent}${key}: ${expr}`
    })
    .join(',\n')
  const rawFields = headerParams
    .map((h) => {
      const key = JSON.stringify(h.rawName)
      let access: string
      if (framework === 'hono') {
        access = `c.req.header(${key})`
      } else if (framework === 'express') {
        access = `req.headers[${key}] as string | undefined`
      } else {
        access = `req.headers[${key}]`
      }
      return `${fieldIndent}${key}: ${access}`
    })
    .join(',\n')
  lines.push(`${inner}// Validate request headers: returns 422 with Zod issues on failure`)
  lines.push(`${inner}const _hv = z.object({`)
  lines.push(schemaFields)
  lines.push(`${inner}}).safeParse({`)
  lines.push(rawFields)
  lines.push(`${inner}})`)
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

interface ResponseStatus {
  status: 200 | 201 | 204
  isVoid: boolean
}

function response200IsVoid(resp: ResponseObject | ReferenceObject): boolean {
  if (isRef(resp)) return false
  const r = resp as ResponseObject
  const content = r.content as Record<string, unknown> | undefined
  return content === undefined || Object.keys(content).length === 0
}

function getResponseStatus(
  operation: OperationObject,
  httpMethod: SupportedMethod
): ResponseStatus {
  const responses = operation.responses as
    | Record<string, ResponseObject | ReferenceObject>
    | undefined

  if (responses === undefined) {
    return httpMethod === 'delete' ? { status: 204, isVoid: true } : { status: 200, isVoid: false }
  }

  if (responses['201'] !== undefined) return { status: 201, isVoid: false }
  if (responses['204'] !== undefined) return { status: 204, isVoid: true }

  if (responses['200'] !== undefined) {
    if (response200IsVoid(responses['200'])) return { status: 204, isVoid: true }
    return { status: 200, isVoid: false }
  }

  // Default: delete -> 204, otherwise 200
  return httpMethod === 'delete' ? { status: 204, isVoid: true } : { status: 200, isVoid: false }
}

interface RouteOperation {
  methodName: string
  httpMethod: SupportedMethod
  path: string
  honoPath: string
  pathParams: string[]
  pathParamValidations: PathParamValidation[]
  queryParams: QueryParam[]
  headerParams: HeaderParam[]
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
      const pathParamValidations = getPathParamValidations(operation, spec, pathParams)
      const queryParams = getQueryParams(operation, spec)
      const headerParams = getHeaderParams(operation, spec)
      const bodyInfo = getBodyInfo(operation)
      const responseStatus = getResponseStatus(operation, method)

      operations.push({
        methodName,
        httpMethod: method,
        path,
        honoPath: toHonoPath(path),
        pathParams,
        pathParamValidations,
        queryParams,
        headerParams,
        bodyInfo,
        responseStatus,
      })
    }
  }

  return operations
}

// ── Shared options interface ──────────────────────────────────────────────────

interface RouterOptions {
  schemaNames?: Set<string>
  schemaImportPath?: string
}

// ── Hono route handler ────────────────────────────────────────────────────────

// fallow-ignore-next-line complexity
function buildRouteHandler(op: RouteOperation, indent: string, schemaNames?: Set<string>): string {
  const lines: string[] = []
  lines.push(`${indent}app.${op.httpMethod}(${JSON.stringify(op.honoPath)}, async (c) => {`)

  // Path param format validation (e.g. uuid)
  if (op.pathParamValidations.length > 0) {
    emitPathValidation(lines, op.pathParamValidations, indent, 'hono')
    lines.push(`${indent}  if (!_pv.success) {`)
    lines.push(
      `${indent}    return c.json({ error: 'Invalid path parameters', issues: _pv.error.issues }, 422)`
    )
    lines.push(`${indent}  }`)
  }

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

    // Validate query params when there are required or typed (non-string) params
    if (queryParamsNeedValidation(op.queryParams)) {
      emitQueryValidation(lines, op.queryParams, indent)
      lines.push(`${indent}  if (!_qv.success) {`)
      lines.push(
        `${indent}    return c.json({ error: 'Invalid query parameters', issues: _qv.error.issues }, 422)`
      )
      lines.push(`${indent}  }`)
    }
  }

  // Header param validation
  if (op.headerParams.length > 0) {
    emitHeaderValidation(lines, op.headerParams, indent, 'hono')
    lines.push(`${indent}  if (!_hv.success) {`)
    lines.push(
      `${indent}    return c.json({ error: 'Invalid request headers', issues: _hv.error.issues }, 422)`
    )
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
      lines.push(`${indent}  // Validate request body: returns 422 with Zod issues on failure`)
      lines.push(`${indent}  const parseResult = ${schemaName}.safeParse(body)`)
      lines.push(`${indent}  if (!parseResult.success) {`)
      lines.push(
        `${indent}    return c.json({ error: 'Invalid request body', issues: parseResult.error.issues }, 422)`
      )
      lines.push(`${indent}  }`)
      lines.push(`${indent}  const validatedBody = parseResult.data`)
      bodyVarName = 'validatedBody'
    }
  }

  // Build service call args
  const serviceArgs: string[] = []
  for (const p of op.pathParams) {
    serviceArgs.push(`c.req.param(${JSON.stringify(p)})`)
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

// ── Express route handler ─────────────────────────────────────────────────────

// fallow-ignore-next-line complexity
function buildExpressRouteHandler(
  op: RouteOperation,
  indent: string,
  schemaNames?: Set<string>
): string {
  const lines: string[] = []
  lines.push(
    `${indent}router.${op.httpMethod}(${JSON.stringify(op.honoPath)}, async (req: Request, res: Response) => {`
  )

  // Path param format validation (e.g. uuid)
  if (op.pathParamValidations.length > 0) {
    emitPathValidation(lines, op.pathParamValidations, indent, 'express')
    lines.push(`${indent}  if (!_pv.success) {`)
    lines.push(
      `${indent}    return void res.status(422).json({ error: 'Invalid path parameters', issues: _pv.error.issues })`
    )
    lines.push(`${indent}  }`)
  }

  // Query params extraction
  if (op.queryParams.length > 0) {
    const fields = op.queryParams
      .map((q) => {
        if (q.tsType === 'number') {
          return `    ${q.name}: Number(req.query['${q.name}'] as string)`
        }
        if (q.tsType === 'boolean') {
          return `    ${q.name}: req.query['${q.name}'] === 'true'`
        }
        return `    ${q.name}: req.query['${q.name}'] as string | undefined`
      })
      .join(',\n')
    lines.push(`${indent}  const params = {`)
    lines.push(fields)
    lines.push(`${indent}  }`)

    // Validate query params when there are required or typed (non-string) params
    if (queryParamsNeedValidation(op.queryParams)) {
      emitQueryValidation(lines, op.queryParams, indent)
      lines.push(`${indent}  if (!_qv.success) {`)
      lines.push(
        `${indent}    return void res.status(422).json({ error: 'Invalid query parameters', issues: _qv.error.issues })`
      )
      lines.push(`${indent}  }`)
    }
  }

  // Header param validation
  if (op.headerParams.length > 0) {
    emitHeaderValidation(lines, op.headerParams, indent, 'express')
    lines.push(`${indent}  if (!_hv.success) {`)
    lines.push(
      `${indent}    return void res.status(422).json({ error: 'Invalid request headers', issues: _hv.error.issues })`
    )
    lines.push(`${indent}  }`)
  }

  // Body extraction, with optional Zod validation
  let bodyVarName = 'body'
  if (op.bodyInfo !== undefined) {
    const schemaName =
      op.bodyInfo.typeName !== undefined ? `${op.bodyInfo.typeName}Schema` : undefined
    const useZod =
      schemaName !== undefined && schemaNames !== undefined && schemaNames.has(schemaName)

    if (useZod) {
      lines.push(`${indent}  // Validate request body: returns 422 with Zod issues on failure`)
      lines.push(`${indent}  const parseResult = ${schemaName}.safeParse(req.body)`)
      lines.push(`${indent}  if (!parseResult.success) {`)
      lines.push(
        `${indent}    return void res.status(422).json({ error: 'Invalid request body', issues: parseResult.error.issues })`
      )
      lines.push(`${indent}  }`)
      lines.push(`${indent}  const validatedBody = parseResult.data`)
      bodyVarName = 'validatedBody'
    } else {
      const typeAnnotation = op.bodyInfo.typeName !== undefined ? ` as ${op.bodyInfo.typeName}` : ''
      lines.push(`${indent}  const body = req.body${typeAnnotation}`)
    }
  }

  // Build service call args
  const serviceArgs: string[] = []
  for (const p of op.pathParams) {
    serviceArgs.push(`req.params['${p}']!`)
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
    lines.push(`${indent}  res.status(${op.responseStatus.status}).end()`)
  } else if (op.responseStatus.status === 201) {
    lines.push(`${indent}  res.status(201).json(await ${serviceCall})`)
  } else {
    lines.push(`${indent}  res.json(await ${serviceCall})`)
  }

  lines.push(`${indent}})`)
  return lines.join('\n')
}

// ── Fastify route handler ─────────────────────────────────────────────────────

// fallow-ignore-next-line complexity
function buildFastifyRouteHandler(
  op: RouteOperation,
  indent: string,
  schemaNames?: Set<string>
): string {
  const lines: string[] = []

  // Build generic type argument
  const genericParts: string[] = []

  if (op.queryParams.length > 0) {
    const queryFields = op.queryParams
      .map((q) => {
        if (q.tsType === 'number') return `${q.name}?: number`
        if (q.tsType === 'boolean') return `${q.name}?: boolean`
        return `${q.name}?: string`
      })
      .join('; ')
    genericParts.push(`Querystring: { ${queryFields} }`)
  }

  if (op.bodyInfo !== undefined && op.bodyInfo.typeName !== undefined) {
    genericParts.push(`Body: ${op.bodyInfo.typeName}`)
  } else if (op.bodyInfo !== undefined) {
    genericParts.push('Body: unknown')
  }

  if (op.pathParams.length > 0) {
    const paramFields = op.pathParams.map((p) => `${p}: string`).join('; ')
    genericParts.push(`Params: { ${paramFields} }`)
  }

  const generic = genericParts.length > 0 ? `<{ ${genericParts.join('; ')} }>` : ''
  lines.push(
    `${indent}app.${op.httpMethod}${generic}(${JSON.stringify(op.honoPath)}, async (req, reply) => {`
  )

  // Path param format validation (e.g. uuid)
  if (op.pathParamValidations.length > 0) {
    emitPathValidation(lines, op.pathParamValidations, indent, 'fastify')
    lines.push(`${indent}  if (!_pv.success) {`)
    lines.push(`${indent}    return reply.status(422).send({`)
    lines.push(`${indent}      error: 'Invalid path parameters',`)
    lines.push(`${indent}      issues: _pv.error.issues,`)
    lines.push(`${indent}    })`)
    lines.push(`${indent}  }`)
  }

  // Query params extraction
  if (op.queryParams.length > 0) {
    const fields = op.queryParams.map((q) => `    ${q.name}: req.query.${q.name}`).join(',\n')
    lines.push(`${indent}  const params = {`)
    lines.push(fields)
    lines.push(`${indent}  }`)

    // Validate query params when there are required or typed (non-string) params
    if (queryParamsNeedValidation(op.queryParams)) {
      emitQueryValidation(lines, op.queryParams, indent)
      lines.push(`${indent}  if (!_qv.success) {`)
      lines.push(`${indent}    return reply.status(422).send({`)
      lines.push(`${indent}      error: 'Invalid query parameters',`)
      lines.push(`${indent}      issues: _qv.error.issues,`)
      lines.push(`${indent}    })`)
      lines.push(`${indent}  }`)
    }
  }

  // Header param validation
  if (op.headerParams.length > 0) {
    emitHeaderValidation(lines, op.headerParams, indent, 'fastify')
    lines.push(`${indent}  if (!_hv.success) {`)
    lines.push(`${indent}    return reply.status(422).send({`)
    lines.push(`${indent}      error: 'Invalid request headers',`)
    lines.push(`${indent}      issues: _hv.error.issues,`)
    lines.push(`${indent}    })`)
    lines.push(`${indent}  }`)
  }

  // Body handling, with optional Zod validation
  let bodyVarName = 'req.body'
  if (op.bodyInfo !== undefined) {
    const schemaName =
      op.bodyInfo.typeName !== undefined ? `${op.bodyInfo.typeName}Schema` : undefined
    const useZod =
      schemaName !== undefined && schemaNames !== undefined && schemaNames.has(schemaName)

    if (useZod) {
      lines.push(`${indent}  // Validate request body: returns 422 with Zod issues on failure`)
      lines.push(`${indent}  const parseResult = ${schemaName}.safeParse(req.body)`)
      lines.push(`${indent}  if (!parseResult.success) {`)
      lines.push(
        `${indent}    return reply.status(422).send({ error: 'Invalid request body', issues: parseResult.error.issues })`
      )
      lines.push(`${indent}  }`)
      bodyVarName = 'parseResult.data'
    }
  }

  // Build service call args
  const serviceArgs: string[] = []
  for (const p of op.pathParams) {
    serviceArgs.push(`req.params.${p}`)
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
    lines.push(`${indent}  reply.status(${op.responseStatus.status}).send()`)
  } else if (op.responseStatus.status === 201) {
    lines.push(`${indent}  reply.status(201)`)
    lines.push(`${indent}  return ${serviceCall}`)
  } else {
    lines.push(`${indent}  return ${serviceCall}`)
  }

  lines.push(`${indent}})`)
  return lines.join('\n')
}

// ── Zod import helpers ────────────────────────────────────────────────────────

/**
 * Returns true when any operation in the list generates param validation code
 * that requires Zod (path format validation, required/typed query params, or header params).
 */
function operationsNeedZodForParams(operations: RouteOperation[]): boolean {
  for (const op of operations) {
    if (op.pathParamValidations.length > 0) return true
    if (queryParamsNeedValidation(op.queryParams)) return true
    if (op.headerParams.length > 0) return true
  }
  return false
}

// ── Express router generator ──────────────────────────────────────────────────

// fallow-ignore-next-line complexity
export function generateExpressRouter(
  spec: OpenAPIV3_1.Document,
  options?: RouterOptions
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

  const needsZod =
    (usedSchemaNames.size > 0 && options?.schemaImportPath !== undefined) ||
    operationsNeedZodForParams(operations)

  const lines: string[] = []
  lines.push('// This file is auto-generated. Do not edit manually.')
  lines.push(
    '// Express: apply express.json() middleware before mounting this router so req.body is populated.'
  )
  lines.push('')
  lines.push("import { Router } from 'express'")
  lines.push("import type { Request, Response } from 'express'")
  if (sortedBodyTypes.length > 0) {
    lines.push(`import type { ${sortedBodyTypes.join(', ')} } from './models.js'`)
  }
  lines.push(`import type { ${serviceName} } from './service.js'`)
  if (needsZod) {
    lines.push(`import { z } from 'zod'`)
  }
  if (usedSchemaNames.size > 0 && options?.schemaImportPath !== undefined) {
    const sortedUsedSchemas = Array.from(usedSchemaNames).sort()
    lines.push(`import { ${sortedUsedSchemas.join(', ')} } from '${options.schemaImportPath}'`)
  }
  lines.push('')
  lines.push(`export function createRouter(service: ${serviceName}): Router {`)
  lines.push('  const router = Router()')
  lines.push('')

  for (const op of operations) {
    lines.push(buildExpressRouteHandler(op, '  ', options?.schemaNames))
    lines.push('')
  }

  lines.push('  return router')
  lines.push('}')
  lines.push('')

  return {
    filename: 'router.ts',
    content: lines.join('\n'),
  }
}

// ── Fastify router generator ──────────────────────────────────────────────────

// fallow-ignore-next-line complexity
export function generateFastifyRouter(
  spec: OpenAPIV3_1.Document,
  options?: RouterOptions
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

  const needsZod =
    (usedSchemaNames.size > 0 && options?.schemaImportPath !== undefined) ||
    operationsNeedZodForParams(operations)

  const lines: string[] = []
  lines.push('// This file is auto-generated. Do not edit manually.')
  lines.push('')
  lines.push("import type { FastifyInstance } from 'fastify'")
  if (sortedBodyTypes.length > 0) {
    lines.push(`import type { ${sortedBodyTypes.join(', ')} } from './models.js'`)
  }
  lines.push(`import type { ${serviceName} } from './service.js'`)
  if (needsZod) {
    lines.push(`import { z } from 'zod'`)
  }
  if (usedSchemaNames.size > 0 && options?.schemaImportPath !== undefined) {
    const sortedUsedSchemas = Array.from(usedSchemaNames).sort()
    lines.push(`import { ${sortedUsedSchemas.join(', ')} } from '${options.schemaImportPath}'`)
  }
  lines.push('')
  lines.push(`export function createRouter(app: FastifyInstance, service: ${serviceName}): void {`)

  for (const op of operations) {
    lines.push('')
    lines.push(buildFastifyRouteHandler(op, '  ', options?.schemaNames))
  }

  lines.push('}')
  lines.push('')

  return {
    filename: 'router.ts',
    content: lines.join('\n'),
  }
}

// ── Hono router generator ─────────────────────────────────────────────────────

// fallow-ignore-next-line complexity
export function generateRouter(spec: OpenAPIV3_1.Document, options?: RouterOptions): GeneratedFile {
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

  const needsZod =
    (usedSchemaNames.size > 0 && options?.schemaImportPath !== undefined) ||
    operationsNeedZodForParams(operations)

  const lines: string[] = []
  lines.push('// This file is auto-generated. Do not edit manually.')
  lines.push('')
  lines.push("import { Hono } from 'hono'")
  if (sortedBodyTypes.length > 0) {
    lines.push(`import type { ${sortedBodyTypes.join(', ')} } from './models.js'`)
  }
  lines.push(`import type { ${serviceName} } from './service.js'`)
  if (needsZod) {
    lines.push(`import { z } from 'zod'`)
  }
  if (usedSchemaNames.size > 0 && options?.schemaImportPath !== undefined) {
    const sortedUsedSchemas = Array.from(usedSchemaNames).sort()
    lines.push(`import { ${sortedUsedSchemas.join(', ')} } from '${options.schemaImportPath}'`)
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
