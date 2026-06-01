import type { OpenAPIV3_1 } from 'openapi-types'
import { toPropertyKey, toTypeName } from '../utils/naming.js'
import type { GeneratedFile } from './types.js'

type OperationObject = OpenAPIV3_1.OperationObject
type ParameterObject = OpenAPIV3_1.ParameterObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject
type SchemaObject = OpenAPIV3_1.SchemaObject
type RequestBodyObject = OpenAPIV3_1.RequestBodyObject
type ResponseObject = OpenAPIV3_1.ResponseObject

const SUPPORTED_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const
type _SupportedMethod = (typeof SUPPORTED_METHODS)[number]

function refToTypeName(ref: string): string {
  // '#/components/schemas/Foo' -> 'Foo' (sanitized to a valid TS identifier)
  const parts = ref.split('/')
  return toTypeName(parts[parts.length - 1]!)
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
    const items = (s as OpenAPIV3_1.ArraySchemaObject).items as
      | SchemaObject
      | ReferenceObject
      | undefined
    if (items !== undefined) return `${inlineSchemaToTs(items)}[]`
    return 'unknown[]'
  }
  if (s.type === 'object') return 'Record<string, unknown>'
  if (s.type !== undefined) return primitiveToTs(s.type as string)
  return 'unknown'
}

function resolveSchema(schema: SchemaObject | ReferenceObject): {
  typeName: string
  isArray: boolean
} {
  if (isRef(schema)) {
    return { typeName: refToTypeName((schema as ReferenceObject).$ref), isArray: false }
  }
  const s = schema as SchemaObject
  if (s.type === 'array') {
    const items = (s as OpenAPIV3_1.ArraySchemaObject).items as
      | SchemaObject
      | ReferenceObject
      | undefined
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
  // 3.1 null-union form, e.g. type: ['string', 'null'] (a nullable query param).
  // A query value is always serialized as a string, so render the underlying
  // non-null primitive and drop the null member.
  if (Array.isArray(s.type)) {
    const nonNull = (s.type as string[]).filter((t) => t !== 'null')
    if (nonNull.length === 1) return primitiveToTs(nonNull[0])
    return 'string'
  }
  if (s.type === 'array') {
    const items = (s as OpenAPIV3_1.ArraySchemaObject).items as SchemaObject | undefined
    if (items !== undefined && (items.type === 'integer' || items.type === 'number')) {
      return 'number[]'
    }
    return 'string[]'
  }
  // String enum → union literal type (e.g. 'active' | 'inactive')
  if (s.type === 'string' && Array.isArray(s.enum) && s.enum.length > 0) {
    return (s.enum as string[]).map((v) => JSON.stringify(v)).join(' | ')
  }
  return primitiveToTs(s.type as string | undefined)
}

/**
 * Escape static text for safe embedding inside a template literal.
 * Escapes backticks, `${` interpolation starts, and backslashes.
 */
function escapeTemplateLiteralText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

/** Convert a path like /api/v1/tasks/{id} to a template literal string with encodeURIComponent calls */
function pathToUrlExpression(path: string): string {
  // Replace {param} with ${encodeURIComponent(sanitizedParam)}
  // Sanitize param names like 'change-set-id' → 'changeSetId' for valid TS identifiers
  // Static segments are escaped so backticks, ${, and backslashes in spec paths cannot break out.
  return path
    .split(/\{([^}]+)\}/)
    .map((segment, index) => {
      if (index % 2 === 0) {
        // Static path segment — escape for template literal embedding
        return escapeTemplateLiteralText(segment)
      }
      // Parameter name segment
      return `\${encodeURIComponent(${sanitizeOperationId(segment)})}`
    })
    .join('')
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
  if (/^[0-9]/.test(camel)) return `_${camel}`
  // If result is a JS reserved word, prefix with underscore
  const RESERVED = new Set([
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'let',
    'new',
    'return',
    'static',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
  ])
  return RESERVED.has(camel) ? `_${camel}` : camel
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
  // toTypeName handles hyphenated segments like 'api-keys' → 'ApiKeys'
  const parts = segments.split('/').map((seg) => {
    if (seg.startsWith('{') && seg.endsWith('}')) {
      const name = seg.slice(1, -1)
      // Sanitize hyphenated param names: 'change-set-id' → 'ChangeSetId'
      return 'By' + toTypeName(name)
    }
    return toTypeName(seg)
  })

  const joined = parts.join('')
  return prefix + joined
}

/** Discriminator for how the generated client should parse the success response body. */
type ResponseBodyKind = 'json' | 'text' | 'binary' | 'event-stream' | 'void'

/**
 * Classify a single media type string into a ResponseBodyKind.
 * - json: application/json or any *+json suffix
 * - event-stream: text/event-stream (excluded from the text category)
 * - text: any other text/* media type
 * - binary: everything else (octet-stream, pdf, images, sdp, zip, etc.)
 */
function classifyMediaType(mediaType: string): ResponseBodyKind {
  const mt = mediaType.toLowerCase().split(';')[0]!.trim()
  if (mt === 'application/json' || mt.endsWith('+json')) return 'json'
  if (mt === 'text/event-stream') return 'event-stream'
  if (mt.startsWith('text/')) return 'text'
  return 'binary'
}

/**
 * Given a response content map, pick the best media type using priority:
 * json > text > binary > event-stream.
 * Returns the chosen kind and the matching media type string, or null when content is empty.
 */
function pickResponseContent(
  content: Record<string, { schema?: SchemaObject | ReferenceObject }>
): {
  kind: ResponseBodyKind
  mediaType: string
  entry: { schema?: SchemaObject | ReferenceObject }
} | null {
  const order: ResponseBodyKind[] = ['json', 'text', 'binary', 'event-stream']
  const byKind = new Map<
    ResponseBodyKind,
    { mediaType: string; entry: { schema?: SchemaObject | ReferenceObject } }
  >()

  for (const [mt, entry] of Object.entries(content)) {
    const kind = classifyMediaType(mt)
    if (!byKind.has(kind)) {
      byKind.set(kind, { mediaType: mt, entry })
    }
  }

  for (const kind of order) {
    const found = byKind.get(kind)
    if (found !== undefined) return { kind, ...found }
  }
  return null
}

function getReturnType(operation: OperationObject): {
  typeName: string
  isArray: boolean
  isVoid: boolean
  bodyKind: ResponseBodyKind
} {
  const responses = operation.responses as
    | Record<string, ResponseObject | ReferenceObject>
    | undefined
  if (responses === undefined)
    return { typeName: 'unknown', isArray: false, isVoid: false, bodyKind: 'json' }

  // Check 200 first, then 201
  for (const code of ['200', '201']) {
    const response = responses[code]
    if (response === undefined) continue
    if (isRef(response)) continue

    const resp = response as ResponseObject
    const content = resp.content as
      | Record<string, { schema?: SchemaObject | ReferenceObject }>
      | undefined
    if (content === undefined) continue

    const picked = pickResponseContent(content)
    if (picked === null) continue

    if (picked.kind === 'json') {
      if (picked.entry.schema === undefined) continue
      const resolved = resolveSchema(picked.entry.schema)
      return { ...resolved, isVoid: false, bodyKind: 'json' }
    }

    if (picked.kind === 'text') {
      return { typeName: 'string', isArray: false, isVoid: false, bodyKind: 'text' }
    }

    if (picked.kind === 'event-stream') {
      return {
        typeName: 'ReadableStream<Uint8Array> | null',
        isArray: false,
        isVoid: false,
        bodyKind: 'event-stream',
      }
    }

    // binary: application/octet-stream, application/pdf, image/*, application/sdp, etc.
    return { typeName: 'Blob', isArray: false, isVoid: false, bodyKind: 'binary' }
  }

  // Check for 204 (no content) or no successful response
  if (responses['204'] !== undefined || Object.keys(responses).length === 0) {
    return { typeName: 'void', isArray: false, isVoid: true, bodyKind: 'void' }
  }

  // No recognized success response body
  return { typeName: 'void', isArray: false, isVoid: true, bodyKind: 'void' }
}

function resolveParamRef(
  p: ParameterObject | ReferenceObject,
  spec: OpenAPIV3_1.Document
): ParameterObject | null {
  if (!isRef(p)) return p as ParameterObject
  const ref = (p as ReferenceObject).$ref
  // Only support local component refs: #/components/parameters/Name
  const match = /^#\/components\/parameters\/(.+)$/.exec(ref)
  if (match === null) return null
  const name = match[1]!
  const params = spec.components?.parameters as
    | Record<string, ParameterObject | ReferenceObject>
    | undefined
  if (params === undefined) return null
  const resolved = params[name]
  if (resolved === undefined || isRef(resolved)) return null
  return resolved as ParameterObject
}

type PathItemObject = OpenAPIV3_1.PathItemObject

/**
 * Merge path-item and operation parameters per the OpenAPI spec:
 * "These parameters can be overridden at the operation level, but cannot be removed there."
 * Operation-level params win when the same (name, in) pair appears at both levels.
 */
function mergeParams(
  pathItem: PathItemObject,
  operation: OperationObject,
  spec: OpenAPIV3_1.Document
): ParameterObject[] {
  const pathItemParams = (pathItem.parameters ?? []) as (ParameterObject | ReferenceObject)[]
  const operationParams = (operation.parameters ?? []) as (ParameterObject | ReferenceObject)[]

  const resolved = [
    ...pathItemParams.map((p) => resolveParamRef(p, spec)),
    ...operationParams.map((p) => resolveParamRef(p, spec)),
  ].filter((p): p is ParameterObject => p !== null)

  // Deduplicate: operation-level params override path-item params with the same (name, in)
  const seen = new Map<string, ParameterObject>()
  for (const p of resolved) {
    seen.set(`${p.name}::${p.in}`, p)
  }
  return Array.from(seen.values())
}

interface PathParam {
  name: string // sanitized camelCase TS identifier (e.g. 'changeSetId' from 'change-set-id')
  urlName: string // original name for URL template (e.g. 'change-set-id')
}

function getPathParams(
  pathItem: PathItemObject,
  operation: OperationObject,
  spec: OpenAPIV3_1.Document
): PathParam[] {
  return mergeParams(pathItem, operation, spec)
    .filter((p) => p.in === 'path')
    .map((p) => ({
      name: sanitizeOperationId(p.name),
      urlName: p.name,
    }))
}

interface QueryParam {
  name: string // sanitized TS property name (e.g. 'project_ids' from 'project_ids[]')
  urlName: string // original wire name for URL query string (e.g. 'project_ids[]')
  type: string
  required: boolean
}

/**
 * Normalize a query parameter name to a valid TypeScript identifier.
 * - Strips the [] suffix used by some APIs (PHP/Rails array convention): 'ids[]' → 'ids'
 * - Converts dot/hyphen-separated names to camelCase: 'place.fields' → 'placeFields'
 * The original name is preserved separately (as urlName) for URL query string building.
 */
function normalizeQueryParamName(name: string): string {
  return name
    .replace(/\[\]$/, '') // strip trailing [] (array marker)
    .replace(/'/g, '') // strip apostrophes
    .replace(/[^a-zA-Z0-9]+([a-zA-Z])/g, (_, char: string) => char.toUpperCase()) // camelCase any separator
    .replace(/[^a-zA-Z0-9]+$/, '') // strip trailing non-alphanumeric
    .replace(/^[^a-zA-Z_$]/, '_') // ensure valid identifier start
}

function getQueryParams(
  pathItem: PathItemObject,
  operation: OperationObject,
  spec: OpenAPIV3_1.Document
): QueryParam[] {
  return mergeParams(pathItem, operation, spec)
    .filter((p) => p.in === 'query')
    .map((p) => ({
      name: normalizeQueryParamName(p.name),
      urlName: p.name,
      type: queryParamType(p.schema as SchemaObject | ReferenceObject | undefined),
      required: p.required === true,
    }))
    .filter((p) => p.name.length > 0) // skip params that reduce to empty string after normalization
}

// Feature 2: Header parameters
interface HeaderParam {
  name: string // camelCase JS identifier (e.g. xStripeSignature)
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

/**
 * Convert a header name to a safe JS identifier.
 * Uses `headerNameToCamelCase` as the primary conversion (preserves existing public API
 * for standard `X-Foo-Bar` headers) then strips any remaining non-identifier characters
 * that could appear in unusual header names (e.g. apostrophes in "User's-Token").
 */
function safeHeaderIdentifier(headerName: string): string {
  const camel = headerNameToCamelCase(headerName)
  // Strip any characters that are not valid in a JS identifier (keeps letters, digits, $, _)
  const stripped = camel.replace(/[^a-zA-Z0-9_$]/g, '')
  // Ensure the result doesn't start with a digit
  if (/^[0-9]/.test(stripped)) return `_${stripped}`
  return stripped.length > 0 ? stripped : '_'
}

function getHeaderParams(
  pathItem: PathItemObject,
  operation: OperationObject,
  spec: OpenAPIV3_1.Document
): HeaderParam[] {
  return mergeParams(pathItem, operation, spec)
    .filter((p) => p.in === 'header' && p.name.length > 0) // skip params with empty names
    .map((p) => ({
      name: safeHeaderIdentifier(p.name),
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
  kind: 'json' | 'multipart' | 'form'
  multipartFields?: MultipartField[]
}

function getRequestBodyInfo(operation: OperationObject): RequestBodyInfo | undefined {
  const requestBody = operation.requestBody as RequestBodyObject | ReferenceObject | undefined
  if (requestBody === undefined) return undefined
  if (isRef(requestBody)) return undefined

  const rb = requestBody as RequestBodyObject
  const content = rb.content as
    | Record<string, { schema?: SchemaObject | ReferenceObject }>
    | undefined
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
          tsParts.push(`  ${toPropertyKey(fieldName)}${isRequired ? '' : '?'}: ${tsType}`)
        }
      }

      const typeName = `{ ${tsParts.map((p) => p.trim()).join('; ')} }`
      return { typeName, kind: 'multipart', multipartFields: fields }
    }
  }

  // Fall back to JSON
  const jsonContent = content['application/json']
  if (jsonContent !== undefined && jsonContent.schema !== undefined) {
    const schema = jsonContent.schema
    return { typeName: inlineSchemaToTs(schema), kind: 'json' }
  }

  // Fall back to application/x-www-form-urlencoded
  const formContent = content['application/x-www-form-urlencoded']
  if (formContent === undefined || formContent.schema === undefined) return undefined

  const formSchema = formContent.schema
  return { typeName: inlineSchemaToTs(formSchema), kind: 'form' }
}

/** Feature 4: Collect non-2xx error responses that have a JSON $ref schema and return @throws tags */
function getThrowsTags(operation: OperationObject): string[] {
  const responses = operation.responses as
    | Record<string, ResponseObject | ReferenceObject>
    | undefined
  if (responses === undefined) return []

  const errorStatusCodes = ['400', '401', '403', '404', '409', '422', '429', '500']
  const tags: string[] = []

  for (const code of errorStatusCodes) {
    const response = responses[code]
    if (response === undefined) continue
    if (isRef(response)) continue

    const resp = response as ResponseObject
    const content = resp.content as
      | Record<string, { schema?: SchemaObject | ReferenceObject }>
      | undefined
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

/** Get the $ref schema name from an operation's JSON request body, if any. */
function getRequestBodySchemaName(operation: OperationObject): string | undefined {
  const requestBody = operation.requestBody as RequestBodyObject | ReferenceObject | undefined
  if (requestBody === undefined || isRef(requestBody)) return undefined
  const rb = requestBody as RequestBodyObject
  const content = rb.content as
    | Record<string, { schema?: SchemaObject | ReferenceObject }>
    | undefined
  if (content === undefined) return undefined
  const jsonContent = content['application/json']
  if (jsonContent === undefined || jsonContent.schema === undefined) return undefined
  if (!isRef(jsonContent.schema)) return undefined
  return refToTypeName((jsonContent.schema as ReferenceObject).$ref)
}

/** Get the $ref schema name and isArray from a 200/201 response, if any. */
function getResponseSchemaName(
  operation: OperationObject
): { name: string; isArray: boolean } | undefined {
  const responses = operation.responses as
    | Record<string, ResponseObject | ReferenceObject>
    | undefined
  if (responses === undefined) return undefined
  for (const code of ['200', '201']) {
    const response = responses[code]
    if (response === undefined || isRef(response)) continue
    const resp = response as ResponseObject
    const content = resp.content as
      | Record<string, { schema?: SchemaObject | ReferenceObject }>
      | undefined
    if (content === undefined) continue
    const jsonContent = content['application/json']
    if (jsonContent === undefined || jsonContent.schema === undefined) continue
    const schema = jsonContent.schema
    if (isRef(schema)) {
      return { name: refToTypeName((schema as ReferenceObject).$ref), isArray: false }
    }
    // Array of $ref items
    const s = schema as SchemaObject
    if (s.type === 'array') {
      const items = (s as OpenAPIV3_1.ArraySchemaObject).items as
        | SchemaObject
        | ReferenceObject
        | undefined
      if (items !== undefined && isRef(items)) {
        return { name: refToTypeName((items as ReferenceObject).$ref), isArray: true }
      }
    }
  }
  return undefined
}

/** Features derived from the spec that drive conditional code-gen in the helpers. */
interface HelperFeatures {
  /** Spec declares Bearer / OAuth / apiKey-in-header|query auth → emit token resolution + Authorization header */
  hasBearerAuth: boolean
  /** Spec declares apiKey-in-cookie auth → emit `credentials` in fetch */
  hasCookieAuth: boolean
  /** Any endpoint has `in: header` parameters → emit `extraHeaders` in opts */
  hasHeaderParams: boolean
  /** Any endpoint is multipart/form-data → emit `_requestForm` helper */
  hasMultipart: boolean
  /** Any endpoint uses application/x-www-form-urlencoded → emit bodyEncoding branch in `_request` */
  hasFormUrlencoded: boolean
}

/** Returns true when the spec has any non-cookie security scheme or a global/operation-level security requirement. */
function detectBearerAuth(spec: OpenAPIV3_1.Document): boolean {
  // Global security requirement declared — treat as auth needed
  if (Array.isArray(spec.security) && spec.security.length > 0) return true

  // Any per-operation security override
  const paths = spec.paths as Record<string, Record<string, OperationObject>> | undefined
  if (paths !== undefined) {
    for (const pathItem of Object.values(paths)) {
      for (const method of SUPPORTED_METHODS) {
        const op = pathItem[method] as OperationObject | undefined
        if (op !== undefined && Array.isArray(op.security) && op.security.length > 0) return true
      }
    }
  }

  // Non-cookie security scheme defined in components
  const schemes = spec.components?.securitySchemes
  if (!schemes) return false
  return Object.values(schemes).some((s) => {
    if (isRef(s)) return false
    const scheme = s as { type?: string; in?: string; scheme?: string }
    // Cookie apiKey is handled by hasCookieAuth — everything else implies bearer-style auth
    return !(scheme.type === 'apiKey' && scheme.in === 'cookie')
  })
}

/**
 * Emit the shared private request helpers that all generated endpoint functions delegate to.
 *
 * `_request`     — handles all JSON / no-body endpoints (always emitted when spec has endpoints).
 * `_requestForm` — handles multipart/form-data endpoints (only emitted when the spec has them).
 *
 * Both helpers are feature-conditional: code for auth, credentials, and extraHeaders is only
 * emitted when the spec actually declares those features, keeping the bundle lean for simple APIs.
 */
function generateRequestHelpers(features: HelperFeatures): string {
  const lines: string[] = []

  // Use a private type alias for the global fetch Response to avoid shadowing conflicts
  // when a spec defines a schema also named 'Response' (e.g. OpenAI's spec).
  lines.push(`type _FetchResponse = Awaited<ReturnType<typeof fetch>>`)
  lines.push(``)
  // ── _request ───────────────────────────────────────────────────────────────
  lines.push(`async function _request(`)
  lines.push(`  method: string,`)
  lines.push(`  path: string,`)
  lines.push(`  opts: {`)
  lines.push(`    searchParams?: URLSearchParams`)
  lines.push(`    body?: unknown`)
  if (features.hasFormUrlencoded) lines.push(`    bodyEncoding?: 'json' | 'form'`)
  if (features.hasHeaderParams) lines.push(`    extraHeaders?: Record<string, string>`)
  lines.push(`  },`)
  lines.push(`  config?: Partial<ClientConfig>,`)
  lines.push(`): Promise<_FetchResponse> {`)

  // Destructure only the config fields that are actually used
  const configFields: string[] = ['baseUrl']
  if (features.hasBearerAuth) configFields.push('token')
  if (features.hasCookieAuth) configFields.push('credentials')
  configFields.push('headers', 'onError')
  lines.push(`  const { ${configFields.join(', ')} } = { ...getConfig(), ...config }`)

  lines.push(`  const base = baseUrl ? baseUrl.replace(/\\/$/, '') : ''`)
  lines.push(`  const qs = opts.searchParams?.toString() ?? ''`)
  lines.push(`  const url = qs ? \`\${base}\${path}?\${qs}\` : \`\${base}\${path}\``)
  if (features.hasBearerAuth) {
    lines.push(`  const resolvedToken = typeof token === 'function' ? await token() : token`)
  }
  lines.push(`  const res = await fetch(url, {`)
  lines.push(`    method,`)
  if (features.hasCookieAuth) lines.push(`    credentials,`)
  lines.push(`    headers: {`)
  if (features.hasFormUrlencoded) {
    lines.push(
      `      ...(opts.body !== undefined ? { 'Content-Type': opts.bodyEncoding === 'form' ? 'application/x-www-form-urlencoded' : 'application/json' } : {}),`
    )
  } else {
    lines.push(`      ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),`)
  }
  lines.push(`      ...headers,`)
  if (features.hasBearerAuth)
    lines.push(`      ...(resolvedToken ? { Authorization: \`Bearer \${resolvedToken}\` } : {}),`)
  if (features.hasHeaderParams) lines.push(`      ...opts.extraHeaders,`)
  lines.push(`    },`)
  if (features.hasFormUrlencoded) {
    lines.push(
      `    ...(opts.body !== undefined ? { body: opts.bodyEncoding === 'form' ? new URLSearchParams(Object.entries(opts.body as Record<string, unknown>).flatMap(([k, v]) => Array.isArray(v) ? v.map((e) => [k, String(e)] as [string, string]) : v == null ? [] : [[k, String(v)] as [string, string]])).toString() : JSON.stringify(opts.body) } : {}),`
    )
  } else {
    lines.push(`    ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),`)
  }
  lines.push(`  })`)
  lines.push(`  if (!res.ok) {`)
  lines.push(`    const err = new ApiError(res.status, await res.json().catch(() => null))`)
  lines.push(`    onError?.(err)`)
  lines.push(`    throw err`)
  lines.push(`  }`)
  lines.push(`  return res`)
  lines.push(`}`)

  // ── _requestForm (only for specs with multipart endpoints) ─────────────────
  if (features.hasMultipart) {
    lines.push(``)
    lines.push(`async function _requestForm(`)
    lines.push(`  method: string,`)
    lines.push(`  path: string,`)
    lines.push(`  formData: FormData,`)
    lines.push(`  opts: {`)
    lines.push(`    searchParams?: URLSearchParams`)
    if (features.hasHeaderParams) lines.push(`    extraHeaders?: Record<string, string>`)
    lines.push(`  },`)
    lines.push(`  config?: Partial<ClientConfig>,`)
    lines.push(`): Promise<_FetchResponse> {`)
    lines.push(`  const { ${configFields.join(', ')} } = { ...getConfig(), ...config }`)
    lines.push(`  const base = baseUrl ? baseUrl.replace(/\\/$/, '') : ''`)
    lines.push(`  const qs = opts.searchParams?.toString() ?? ''`)
    lines.push(`  const url = qs ? \`\${base}\${path}?\${qs}\` : \`\${base}\${path}\``)
    if (features.hasBearerAuth) {
      lines.push(`  const resolvedToken = typeof token === 'function' ? await token() : token`)
    }
    lines.push(`  const res = await fetch(url, {`)
    lines.push(`    method,`)
    if (features.hasCookieAuth) lines.push(`    credentials,`)
    lines.push(`    headers: {`)
    lines.push(`      ...headers,`)
    if (features.hasBearerAuth)
      lines.push(`      ...(resolvedToken ? { Authorization: \`Bearer \${resolvedToken}\` } : {}),`)
    if (features.hasHeaderParams) lines.push(`      ...opts.extraHeaders,`)
    lines.push(`    },`)
    lines.push(`    body: formData,`)
    lines.push(`  })`)
    lines.push(`  if (!res.ok) {`)
    lines.push(`    const err = new ApiError(res.status, await res.json().catch(() => null))`)
    lines.push(`    onError?.(err)`)
    lines.push(`    throw err`)
    lines.push(`  }`)
    lines.push(`  return res`)
    lines.push(`}`)
  }

  return lines.join('\n')
}

function generateFunctionCode(
  funcName: string,
  method: string,
  path: string,
  pathParams: PathParam[],
  queryParams: QueryParam[],
  headerParams: HeaderParam[],
  bodyInfo: RequestBodyInfo | undefined,
  returnType: { typeName: string; isArray: boolean; isVoid: boolean; bodyKind: ResponseBodyKind },
  deprecated: boolean,
  throwsTags: string[],
  options?: ClientOptions,
  requestBodySchemaName?: string,
  responseSchemaName?: { name: string; isArray: boolean }
): string {
  const lines: string[] = []

  // Build function signature
  const sigParts: string[] = []
  // Path params first (positional) — use sanitized TS name
  for (const param of pathParams) {
    sigParts.push(`${param.name}: string`)
  }
  // Body param
  if (bodyInfo !== undefined) {
    sigParts.push(`body: ${bodyInfo.typeName}`)
  }

  // Query params + header params share the same params object
  const allParamFields: string[] = []
  for (const qp of queryParams) {
    allParamFields.push(`  ${toPropertyKey(qp.name)}${qp.required ? '' : '?'}: ${qp.type}`)
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

  // For non-json body kinds, isArray is always false; the typeName is the full type string.
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

  // Build URL path arg (template literal when path params present, plain string otherwise)
  const urlExpression = pathToUrlExpression(path)
  const hasPathParams = path.includes('{')
  const pathArg = hasPathParams ? '`' + urlExpression + '`' : JSON.stringify(path)

  // URLSearchParams (query params) — still built in caller, passed to helper
  if (queryParams.length > 0) {
    lines.push(`  const searchParams = new URLSearchParams()`)
    for (const qp of queryParams) {
      if (qp.type.endsWith('[]')) {
        // Array params: use append in a loop (not set) so multiple values are preserved
        // Use urlName for the wire format (may differ from TS name, e.g. 'ids[]' vs 'ids')
        lines.push(
          `  if (params?.${qp.name} != null) { for (const v of params.${qp.name}) searchParams.append('${qp.urlName}', String(v)) }`
        )
      } else {
        lines.push(
          `  if (params?.${qp.name} != null) searchParams.set('${qp.urlName}', String(params.${qp.name}))`
        )
      }
    }
  }

  // FormData (multipart) — still built in caller, passed to _requestForm
  if (
    bodyInfo !== undefined &&
    bodyInfo.kind === 'multipart' &&
    bodyInfo.multipartFields !== undefined
  ) {
    lines.push(`  const formData = new FormData()`)
    for (const field of bodyInfo.multipartFields) {
      // Use bracket notation for field names with special chars (e.g. 'file.xml')
      const isSimple = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(field.name)
      const access = isSimple ? `body.${field.name}` : `body[${JSON.stringify(field.name)}]`
      if (field.isBinary) {
        lines.push(
          `  if (${access} != null) formData.append(${JSON.stringify(field.name)}, ${access})`
        )
      } else {
        lines.push(
          `  if (${access} != null) formData.append(${JSON.stringify(field.name)}, String(${access}))`
        )
      }
    }
  }

  // Header params → extraHeaders object (preserves the same conditional spread pattern)
  if (headerParams.length > 0) {
    const spreadParts = headerParams
      .map(
        (hp) =>
          `    ...(params?.${hp.name} != null ? { ${JSON.stringify(hp.headerName)}: params.${hp.name} } : {}),`
      )
      .join('\n')
    lines.push(`  const extraHeaders: Record<string, string> = {`)
    lines.push(spreadParts)
    lines.push(`  }`)
  }

  // Schema-enhanced: request body validation before the fetch call
  if (
    options?.schemaNames !== undefined &&
    requestBodySchemaName !== undefined &&
    options.schemaNames.has(`${requestBodySchemaName}Schema`) &&
    bodyInfo !== undefined &&
    bodyInfo.kind === 'json'
  ) {
    // Validate the request body against the Zod schema before sending.
    // Note: we do not call .strip() because not all schemas are ZodObject
    // (allOf → ZodIntersection, oneOf/anyOf → ZodUnion — neither has .strip()).
    lines.push(`  ${requestBodySchemaName}Schema.parse(body)`)
  }

  // Build opts object for the helper call
  const isMultipart = bodyInfo !== undefined && bodyInfo.kind === 'multipart'

  if (isMultipart) {
    // _requestForm: formData is a positional arg; opts only carries searchParams + extraHeaders
    const formOptsParts: string[] = []
    if (queryParams.length > 0) formOptsParts.push('searchParams')
    if (headerParams.length > 0) formOptsParts.push('extraHeaders')
    const formOpts = formOptsParts.length > 0 ? `{ ${formOptsParts.join(', ')} }` : '{}'
    const call = `_requestForm('${method.toUpperCase()}', ${pathArg}, formData, ${formOpts}, config)`
    if (returnType.isVoid) {
      lines.push(`  await ${call}`)
    } else {
      lines.push(`  const res = await ${call}`)
    }
  } else {
    // _request: JSON or form body (if any) goes in opts.body; no FormData
    const optsParts: string[] = []
    if (queryParams.length > 0) optsParts.push('searchParams')
    if (bodyInfo !== undefined && (bodyInfo.kind === 'json' || bodyInfo.kind === 'form')) {
      optsParts.push('body')
    }
    if (bodyInfo !== undefined && bodyInfo.kind === 'form') {
      optsParts.push(`bodyEncoding: 'form'`)
    }
    if (headerParams.length > 0) optsParts.push('extraHeaders')
    const optsLiteral = optsParts.length > 0 ? `{ ${optsParts.join(', ')} }` : '{}'
    const call = `_request('${method.toUpperCase()}', ${pathArg}, ${optsLiteral}, config)`
    if (returnType.isVoid) {
      lines.push(`  await ${call}`)
    } else {
      lines.push(`  const res = await ${call}`)
    }
  }

  // Return / response parsing — switch on the body kind determined from the spec.
  if (!returnType.isVoid) {
    const kind = returnType.bodyKind
    if (kind === 'text') {
      lines.push(`  return res.text()`)
    } else if (kind === 'binary') {
      lines.push(`  return res.blob()`)
    } else if (kind === 'event-stream') {
      // Full SSE parsing (EventSource / TransformStream) is tracked separately.
      // Expose the raw ReadableStream so callers can implement their own consumer.
      lines.push(`  return res.body`)
    } else {
      // json kind: apply Zod validation when schema-enhanced, otherwise plain res.json()
      if (
        options?.schemaNames !== undefined &&
        responseSchemaName !== undefined &&
        options.schemaNames.has(`${responseSchemaName.name}Schema`)
      ) {
        if (responseSchemaName.isArray) {
          lines.push(`  return z.array(${responseSchemaName.name}Schema).parse(await res.json())`)
        } else {
          lines.push(`  return ${responseSchemaName.name}Schema.parse(await res.json())`)
        }
      } else {
        lines.push(`  return res.json()`)
      }
    }
  }

  lines.push(`}`)

  return lines.join('\n')
}

export interface ClientOptions {
  schemaNames?: Set<string>
  schemaImportPath?: string
}

/** Built-in TypeScript types that must NOT be imported from ./models */
const BUILTIN_TS_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'unknown',
  'void',
  'null',
  'undefined',
  'any',
  'never',
  // Global platform types: never import from ./models
  'Blob',
  'ReadableStream',
  'Uint8Array',
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

/**
 * Returns a name that is unique within the provided set.
 * If the candidate already exists, appends _2, _3, ... until a free slot is found.
 * The chosen name is added to the set before returning.
 */
function uniquifyName(candidate: string, used: Set<string>): string {
  if (!used.has(candidate)) {
    used.add(candidate)
    return candidate
  }
  let counter = 2
  while (used.has(`${candidate}_${counter}`)) {
    counter++
  }
  const unique = `${candidate}_${counter}`
  used.add(unique)
  return unique
}

export function generateClient(spec: OpenAPIV3_1.Document, options?: ClientOptions): GeneratedFile {
  const paths = spec.paths as Record<string, Record<string, OperationObject>> | undefined

  const collectedTypeNames = new Set<string>()
  const collectedSchemaNames = new Set<string>()
  let needsZImport = false
  let hasMultipartEndpoints = false
  let hasFormUrlencodedEndpoints = false
  let hasHeaderParamEndpoints = false
  let hasAnyEndpoints = false
  const functionBlocks: string[] = []
  const usedFuncNames = new Set<string>()

  if (paths !== undefined) {
    for (const [path, pathItem] of Object.entries(paths)) {
      for (const method of SUPPORTED_METHODS) {
        const operation = pathItem[method] as OperationObject | undefined
        if (operation === undefined) continue

        hasAnyEndpoints = true

        // Derive function name and ensure it is unique across all operations.
        let funcName: string
        if (operation.operationId !== undefined) {
          funcName = sanitizeOperationId(operation.operationId)
        } else {
          funcName = deriveOperationName(method, path)
        }
        funcName = uniquifyName(funcName, usedFuncNames)

        const pathParams = getPathParams(pathItem, operation, spec)
        const queryParams = getQueryParams(pathItem, operation, spec)
        const headerParams = getHeaderParams(pathItem, operation, spec)
        const bodyInfo = getRequestBodyInfo(operation)
        const returnType = getReturnType(operation)
        const deprecated = operation.deprecated === true
        const throwsTags = getThrowsTags(operation)

        // Track which features are used across the spec (drives conditional helper code-gen)
        if (bodyInfo !== undefined && bodyInfo.kind === 'multipart') hasMultipartEndpoints = true
        if (bodyInfo !== undefined && bodyInfo.kind === 'form') hasFormUrlencodedEndpoints = true
        if (headerParams.length > 0) hasHeaderParamEndpoints = true

        // Schema-enhanced: compute request body and response schema names for this operation
        const requestBodySchemaName =
          options?.schemaNames !== undefined ? getRequestBodySchemaName(operation) : undefined
        const responseSchemaName =
          options?.schemaNames !== undefined ? getResponseSchemaName(operation) : undefined

        // Collect type names for import — only simple schema identifiers (e.g. "Task"),
        // never inline type expressions (e.g. "Record<string, unknown>") or primitives.
        if (
          bodyInfo !== undefined &&
          bodyInfo.kind === 'json' &&
          isImportableType(bodyInfo.typeName)
        ) {
          collectedTypeNames.add(bodyInfo.typeName)
        }
        if (!returnType.isVoid && isImportableType(returnType.typeName)) {
          collectedTypeNames.add(returnType.typeName)
        }

        // Collect schema names actually used (drift-safe: only if in schemaNames set)
        if (options?.schemaNames !== undefined) {
          if (
            requestBodySchemaName !== undefined &&
            options.schemaNames.has(`${requestBodySchemaName}Schema`)
          ) {
            collectedSchemaNames.add(`${requestBodySchemaName}Schema`)
          }
          if (
            responseSchemaName !== undefined &&
            options.schemaNames.has(`${responseSchemaName.name}Schema`)
          ) {
            collectedSchemaNames.add(`${responseSchemaName.name}Schema`)
            if (responseSchemaName.isArray) needsZImport = true
          }
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
          options,
          requestBodySchemaName,
          responseSchemaName
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

  // Schema-enhanced imports
  if (
    options?.schemaNames !== undefined &&
    collectedSchemaNames.size > 0 &&
    options.schemaImportPath !== undefined
  ) {
    if (needsZImport) {
      lines.push(`import { z } from 'zod'`)
    }
    const sortedSchemas = Array.from(collectedSchemaNames).sort()
    lines.push(`import { ${sortedSchemas.join(', ')} } from '${options.schemaImportPath}'`)
  }

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

  // Shared private request helpers — emitted once, called by every endpoint function.
  // Code inside the helpers is feature-conditional: only emit auth/credentials/extraHeaders
  // when the spec actually declares those features.
  if (hasAnyEndpoints) {
    const helperFeatures: HelperFeatures = {
      hasBearerAuth: detectBearerAuth(spec),
      hasCookieAuth: hasCookieAuth(spec),
      hasHeaderParams: hasHeaderParamEndpoints,
      hasMultipart: hasMultipartEndpoints,
      hasFormUrlencoded: hasFormUrlencodedEndpoints,
    }
    lines.push('')
    lines.push(generateRequestHelpers(helperFeatures))
  }

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
