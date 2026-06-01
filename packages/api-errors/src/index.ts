/**
 * Normalized representation of a single field-level error.
 */
export interface FieldError {
  field: string
  message: string
}

/**
 * The format/shape that was recognized when parsing an error body.
 *
 * - `'rfc7807-map'`    - RFC 7807 / RFC 9457 `errors` map: `{ errors: { field: [...] } }`
 * - `'spring-array'`   - Spring Boot array: `{ errors: [{ field, defaultMessage }] }`
 * - `'violations'`     - RFC 9457 / Spring `violations` array: `{ violations: [{ field, message }] }`
 * - `'invalid-params'` - RFC 9457 `invalid-params` array: `{ "invalid-params": [{ name, reason }] }`
 * - `'json-api'`       - JSON:API errors array: `{ errors: [{ source: { pointer }, detail }] }`
 * - `'laravel-drf'`    - Laravel / DRF top-level field map: `{ field: ["msg1", ...] }`
 * - `'flat-object'`    - Simple flat object: `{ field, message }`
 * - `'flat-array'`     - Array of flat objects: `[{ field, message }]`
 * - `'rfc9457-detail'` - RFC 9457 top-level `detail` string (last-resort fallback)
 * - `'custom'`         - Matched a caller-provided custom parser
 */
export type ErrorFormat =
  | 'rfc7807-map'
  | 'spring-array'
  | 'violations'
  | 'invalid-params'
  | 'json-api'
  | 'laravel-drf'
  | 'flat-object'
  | 'flat-array'
  | 'rfc9457-detail'
  | 'custom'

/**
 * Rich result returned by `extractErrors`.
 */
export interface ExtractResult {
  /**
   * Field-level errors extracted from the response body.
   */
  fieldErrors: FieldError[]
  /**
   * Non-field (global/form-level) error messages.
   * These are messages that could not be attributed to a specific field,
   * such as RFC 9457 `detail`, JSON:API errors without a source pointer,
   * or violations/invalid-params entries without a field name.
   */
  formErrors: string[]
  /**
   * The format that was recognized.
   * `null` when no supported format matched (both `fieldErrors` and `formErrors` are empty).
   *
   * Use this to distinguish "unrecognized shape" from "recognized but genuinely no errors".
   */
  format: ErrorFormat | null
}

/**
 * A custom parser that callers can register to handle application-specific
 * error shapes not covered by the built-in parsers.
 *
 * Return `null` to indicate "not recognized" and let the next parser try.
 * Return a `ParsedErrors` object (even if both arrays are empty) to signal
 * that this shape was recognized.
 */
export interface CustomParser {
  (body: unknown): ParsedErrors | null
}

/**
 * Raw parse result used internally and returned by custom parsers.
 * Both arrays may be empty if the shape was recognized but contained no errors.
 */
export interface ParsedErrors {
  fieldErrors: FieldError[]
  formErrors: string[]
}

/**
 * Options for mapApiErrors and extractFieldErrors.
 */
export interface MapApiErrorsOptions {
  /**
   * Fallback field name when no field can be determined from the error.
   * Defaults to 'root'.
   */
  fallbackField?: string
  /**
   * Optional transform applied to every field name before it is returned.
   * Useful for mapping backend camelCase field names to nested React Hook Form
   * paths, e.g. `"addressCity"` to `"address.city"`.
   */
  transformField?: (field: string) => string
  /**
   * Restrict field error extraction to specific HTTP status codes.
   * If provided, the error's `status` (or `response.status`) is checked first.
   * If the status is not in this list, `extractFieldErrors` returns `[]` immediately
   * without attempting to parse the body.
   *
   * Useful to avoid trying to extract field errors from 404 or 500 responses.
   *
   * @example
   * extractFieldErrors(err, { statusCodes: [422] })
   */
  statusCodes?: number[]
  /**
   * Optional message resolver / i18n hook.
   * Called for every error message (both field errors and form errors) before
   * the message is included in the result. Return a replacement string to
   * translate or reformat the message.
   *
   * `field` is `null` for global/form-level errors.
   *
   * @example
   * resolveMessage: (msg, field) => t(`errors.${msg}`) ?? msg
   */
  resolveMessage?: (message: string, field: string | null) => string
  /**
   * Custom parsers to try before the built-in parsers.
   * Parsers are tried in order; the first one that returns a non-null result wins.
   * Return `null` to indicate "not recognized by this parser".
   *
   * Custom parsers receive the already-unwrapped body (after ApiError / Axios
   * unwrapping), so they do not need to re-implement body unwrapping.
   */
  parsers?: ReadonlyArray<CustomParser>
}

// ---------------------------------------------------------------------------
// Internal type guards
// ---------------------------------------------------------------------------

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

// ---------------------------------------------------------------------------
// Shared helper: keyed-array parser (violations + invalid-params)
// ---------------------------------------------------------------------------

/** Extract field + message from a single keyed-array item. Returns null when message is absent. */
function parseKeyedItem(
  item: Record<string, unknown>,
  fieldKey: string,
  messageKey: string
): { field: string | null; message: string } | null {
  const message = typeof item[messageKey] === 'string' ? (item[messageKey] as string) : null
  if (message === null) return null
  const field =
    typeof item[fieldKey] === 'string' && item[fieldKey] !== '' ? (item[fieldKey] as string) : null
  return { field, message }
}

/**
 * Parse an array of objects where each item carries a field key and a message key.
 * Items whose field value is absent or empty are treated as global (form-level) errors.
 * Items without a message value are silently skipped.
 */
function parseKeyedArray(items: unknown[], fieldKey: string, messageKey: string): ParsedErrors {
  const fieldErrors: FieldError[] = []
  const formErrors: string[] = []

  for (const item of items) {
    if (!isObject(item)) continue
    const parsed = parseKeyedItem(item, fieldKey, messageKey)
    if (parsed === null) continue
    if (parsed.field !== null) {
      fieldErrors.push({ field: parsed.field, message: parsed.message })
    } else {
      formErrors.push(parsed.message)
    }
  }

  return { fieldErrors, formErrors }
}

// ---------------------------------------------------------------------------
// Format detectors + parsers
// ---------------------------------------------------------------------------

/**
 * RFC 9457 violations array (also used by some Spring Boot setups):
 * { "violations": [{ "field": "email", "message": "must not be blank" }] }
 */
function tryParseViolations(body: Record<string, unknown>): ParsedErrors | null {
  const { violations } = body
  if (!Array.isArray(violations)) return null
  return parseKeyedArray(violations, 'field', 'message')
}

/**
 * RFC 9457 invalid-params array:
 * { "invalid-params": [{ "name": "email", "reason": "must not be blank" }] }
 */
function tryParseInvalidParams(body: Record<string, unknown>): ParsedErrors | null {
  const invalidParams = body['invalid-params']
  if (!Array.isArray(invalidParams)) return null
  return parseKeyedArray(invalidParams, 'name', 'reason')
}

/**
 * JSON:API errors array:
 * { "errors": [{ "source": { "pointer": "/data/attributes/email" }, "detail": "..." }] }
 *
 * Errors with a source pointer map to field errors.
 * Errors without a source pointer (or with a pointer of "/") map to form errors.
 *
 * IMPORTANT: this parser must run BEFORE tryParseSpringArray because a JSON:API
 * body also has an `errors` array and would silently match the Spring-array parser
 * via the defaultMessage fallback.
 */
function tryParseJsonApi(body: Record<string, unknown>): ParsedErrors | null {
  const { errors } = body
  if (!Array.isArray(errors) || !isJsonApiShape(errors)) return null

  const fieldErrors: FieldError[] = []
  const formErrors: string[] = []
  for (const item of errors) {
    if (!isObject(item)) continue
    classifyJsonApiItem(item, fieldErrors, formErrors)
  }
  return { fieldErrors, formErrors }
}

/** True when at least one item looks like a JSON:API error object (not Spring). */
function isJsonApiShape(errors: unknown[]): boolean {
  return errors.some(
    (item) =>
      isObject(item) &&
      (isObject(item['source']) || typeof item['detail'] === 'string') &&
      !('field' in item) &&
      !('defaultMessage' in item)
  )
}

/** Push one JSON:API error item into the appropriate bucket. */
function classifyJsonApiItem(
  item: Record<string, unknown>,
  fieldErrors: FieldError[],
  formErrors: string[]
): void {
  const detail = typeof item['detail'] === 'string' ? item['detail'] : null
  const message = detail ?? 'Unknown error'
  const source = item['source']

  if (isObject(source) && typeof source['pointer'] === 'string') {
    const field = pointerToField(source['pointer'] as string)
    if (field !== null) {
      fieldErrors.push({ field, message })
    } else if (detail !== null) {
      formErrors.push(detail)
    }
  } else if (detail !== null) {
    formErrors.push(detail)
  }
}

/**
 * Convert a JSON Pointer (RFC 6901) used in JSON:API source.pointer to a
 * dot-separated field path for form use.
 *
 * `/data/attributes/email`        -> `email`
 * `/data/attributes/address/city` -> `address.city`
 * `/data/relationships/author`    -> `author`
 * `/email`                        -> `email`
 * `/`                             -> null (root, non-field)
 * ``                              -> null
 */
function pointerToField(pointer: string): string | null {
  if (!pointer || pointer === '/') return null

  const segments = pointer
    .replace(/^\//, '')
    .split('/')
    .map((s) => s.replace(/~1/g, '/').replace(/~0/g, '~'))
    .filter(Boolean)

  return segments.length > 0 ? resolveJsonApiSegments(segments) : null
}

/** Strip well-known JSON:API structural prefixes and join as dot-path. */
function resolveJsonApiSegments(segments: string[]): string | null {
  if (segments[0] !== 'data') return segments.join('.')
  if (segments[1] === 'attributes') {
    const rest = segments.slice(2)
    return rest.length > 0 ? rest.join('.') : null
  }
  if (segments[1] === 'relationships' && segments.length > 2) {
    return segments.slice(2).join('.')
  }
  return segments.join('.')
}

/**
 * Laravel / DRF top-level field-to-messages map:
 * { "email": ["must not be blank", "invalid format"], "name": ["required"] }
 *
 * Guard: at least one value must be a non-empty string array, and the body
 * must not use keys owned by other parsers.
 */
function tryParseLaravelDrf(body: Record<string, unknown>): ParsedErrors | null {
  const entries = Object.entries(body)
  if (entries.length === 0 || hasReservedLaravelKey(entries)) return null

  // Require at least one non-empty string array to distinguish from generic flat objects
  if (!entries.some(([, v]) => isStringArray(v) && (v as string[]).length > 0)) return null

  const fieldErrors: FieldError[] = []
  for (const [rawField, messages] of entries) {
    if (isStringArray(messages)) {
      for (const message of messages) fieldErrors.push({ field: rawField, message })
    } else if (typeof messages === 'string') {
      fieldErrors.push({ field: rawField, message: messages })
    }
  }
  return fieldErrors.length > 0 ? { fieldErrors, formErrors: [] } : null
}

/** Keys that belong to other parsers and disqualify a body from Laravel/DRF matching. */
const LARAVEL_RESERVED_KEYS = new Set([
  'errors',
  'violations',
  'invalid-params',
  'field',
  'message',
  'detail',
  'title',
  'status',
  'type',
])

function hasReservedLaravelKey(entries: [string, unknown][]): boolean {
  return entries.some(([k]) => LARAVEL_RESERVED_KEYS.has(k))
}

/**
 * RFC 7807 Problem Details (Spring Boot 3+ default):
 * { "errors": { "email": ["must not be blank"], "name": ["too short"] } }
 */
function tryParseRfc7807(
  body: Record<string, unknown>,
  transformField: (field: string) => string
): FieldError[] | null {
  const { errors } = body
  if (!isObject(errors)) return null

  const result: FieldError[] = []
  for (const [rawField, messages] of Object.entries(errors)) {
    const field = transformField(rawField)
    if (isStringArray(messages)) {
      for (const message of messages) result.push({ field, message })
    } else if (typeof messages === 'string') {
      result.push({ field, message: messages })
    }
    // null / unknown value shapes are skipped — no partial/garbage errors
  }
  return result.length > 0 ? result : null
}

/**
 * Spring Boot default validation format (pre-3):
 * { "errors": [{ "field": "email", "defaultMessage": "must not be blank" }] }
 */
function tryParseSpringArray(
  body: Record<string, unknown>,
  fallbackField: string,
  transformField: (field: string) => string
): FieldError[] | null {
  const { errors } = body
  if (!Array.isArray(errors)) return null

  const result: FieldError[] = []
  for (const item of errors) {
    if (!isObject(item)) continue
    const rawField = typeof item['field'] === 'string' ? item['field'] : fallbackField
    const message =
      typeof item['defaultMessage'] === 'string'
        ? item['defaultMessage']
        : typeof item['message'] === 'string'
          ? item['message']
          : 'Unknown error'
    result.push({ field: transformField(rawField), message })
  }
  return result.length > 0 ? result : null
}

/**
 * Simple flat object format:
 * { "field": "email", "message": "Invalid email" }
 */
function tryParseFlatObject(
  body: Record<string, unknown>,
  fallbackField: string,
  transformField: (field: string) => string
): FieldError[] | null {
  const rawField = typeof body['field'] === 'string' ? body['field'] : null
  const message = typeof body['message'] === 'string' ? body['message'] : null
  if (message === null) return null
  const field = rawField !== null ? rawField : fallbackField
  return [{ field: transformField(field), message }]
}

/**
 * Array of simple flat objects:
 * [{ "field": "email", "message": "Invalid email" }]
 */
function tryParseFlatArray(
  body: unknown[],
  fallbackField: string,
  transformField: (field: string) => string
): FieldError[] | null {
  const result: FieldError[] = []
  for (const item of body) {
    if (!isObject(item)) continue
    const rawField = typeof item['field'] === 'string' ? item['field'] : fallbackField
    const message = typeof item['message'] === 'string' ? item['message'] : null
    if (message === null) continue
    result.push({ field: transformField(rawField), message })
  }
  return result.length > 0 ? result : null
}

// ---------------------------------------------------------------------------
// Safety
// ---------------------------------------------------------------------------

/**
 * Field-path segments that must never be forwarded to a path-aware setter.
 * A path-aware setter (e.g. React Hook Form's `setError`) splits the field name
 * on `.`/`[]` and walks/creates nested objects, so a malicious field like
 * `__proto__.polluted` from an untrusted error body would otherwise become a
 * prototype-pollution write in the consuming app.
 */
const FORBIDDEN_FIELD_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype'])

/**
 * Upper bound on the number of field errors returned. A hostile body with a huge
 * `errors` map or array would otherwise produce an unbounded list (and an equal
 * number of `setError` calls / re-renders downstream).
 */
const MAX_FIELD_ERRORS = 1000

/** True if no path segment of `field` is a prototype-pollution gadget key. */
function isSafeFieldPath(field: string): boolean {
  for (const segment of field.split(/[.[\]]+/)) {
    if (FORBIDDEN_FIELD_SEGMENTS.has(segment)) return false
  }
  return true
}

/** Drop unsafe field paths and cap the result before it leaves the library. */
function finalize(result: FieldError[]): FieldError[] {
  const safe = result.filter((e) => isSafeFieldPath(e.field))
  return safe.length > MAX_FIELD_ERRORS ? safe.slice(0, MAX_FIELD_ERRORS) : safe
}

// ---------------------------------------------------------------------------
// Body unwrapping: three independent single-step helpers
// ---------------------------------------------------------------------------

/** Unwrap `{ status: number, body: unknown }` (ApiError from generated client). */
function unwrapApiError(value: unknown): unknown {
  if (
    isObject(value) &&
    typeof (value as Record<string, unknown>)['status'] === 'number' &&
    Object.prototype.hasOwnProperty.call(value, 'body')
  ) {
    return (value as Record<string, unknown>)['body']
  }
  return value
}

/** Unwrap `{ response: { data: ... } }` (Axios-style errors). */
function unwrapAxiosResponse(value: unknown): unknown {
  if (isObject(value) && isObject(value['response']) && value['response']['data'] !== undefined) {
    return value['response']['data']
  }
  return value
}

/** Unwrap `{ data: { ... } }` top-level data envelopes (no field/errors at root). */
function unwrapDataEnvelope(value: unknown): unknown {
  if (isObject(value) && isObject(value['data']) && !('field' in value) && !('errors' in value)) {
    return value['data']
  }
  return value
}

/** Run all three unwrap steps in sequence to get the raw error body. */
function unwrapBody(error: unknown): unknown {
  return unwrapDataEnvelope(unwrapAxiosResponse(unwrapApiError(error)))
}

// ---------------------------------------------------------------------------
// matchBody: router that dispatches to per-shape parsers
// ---------------------------------------------------------------------------

/** Internal match result: parsed errors + the format that matched. */
interface MatchResult {
  parsed: ParsedErrors
  format: ErrorFormat
}

/** Wrap a ParsedErrors result with its format tag, applying transformField to field names. */
function wrapMatch(
  parsed: ParsedErrors,
  format: ErrorFormat,
  transformField: (f: string) => string
): MatchResult {
  return {
    parsed: {
      fieldErrors: parsed.fieldErrors.map((e) => ({
        field: transformField(e.field),
        message: e.message,
      })),
      formErrors: parsed.formErrors,
    },
    format,
  }
}

/**
 * Try all object-body parsers in priority order.
 * Returns the first match, or null if no parser recognized the shape.
 */
function matchObjectBody(
  body: Record<string, unknown>,
  fallbackField: string,
  transformField: (f: string) => string
): MatchResult | null {
  // Each thunk in this ordered list tries one parser and returns a MatchResult or null.
  const candidates: Array<() => MatchResult | null> = [
    () => {
      const r = tryParseViolations(body)
      return r && wrapMatch(r, 'violations', transformField)
    },
    () => {
      const r = tryParseInvalidParams(body)
      return r && wrapMatch(r, 'invalid-params', transformField)
    },
    () => {
      const r = tryParseJsonApi(body)
      return r && wrapMatch(r, 'json-api', transformField)
    },
    () => {
      const r = tryParseRfc7807(body, transformField)
      return r && { parsed: { fieldErrors: r, formErrors: [] }, format: 'rfc7807-map' as const }
    },
    () => {
      const r = tryParseSpringArray(body, fallbackField, transformField)
      return r && { parsed: { fieldErrors: r, formErrors: [] }, format: 'spring-array' as const }
    },
    () => {
      const r = tryParseLaravelDrf(body)
      return r && wrapMatch(r, 'laravel-drf', transformField)
    },
    () => {
      const r = tryParseFlatObject(body, fallbackField, transformField)
      return r && { parsed: { fieldErrors: r, formErrors: [] }, format: 'flat-object' as const }
    },
    () => {
      const detail = body['detail']
      return typeof detail === 'string'
        ? { parsed: { fieldErrors: [], formErrors: [detail] }, format: 'rfc9457-detail' as const }
        : null
    },
  ]

  for (const candidate of candidates) {
    const result = candidate()
    if (result !== null) return result
  }
  return null
}

/**
 * Run custom parsers (if any) before the built-in ones.
 * Returns the first match, or null to fall through.
 */
function tryCustomParsers(
  body: unknown,
  customParsers: ReadonlyArray<CustomParser>
): MatchResult | null {
  for (const parser of customParsers) {
    const parsed = parser(body)
    if (parsed !== null) return { parsed, format: 'custom' }
  }
  return null
}

/**
 * Dispatch an array body through the flat-array parser.
 */
function matchArrayBody(
  body: unknown[],
  fallbackField: string,
  transformField: (f: string) => string
): MatchResult | null {
  const flat = tryParseFlatArray(body, fallbackField, transformField)
  return flat ? { parsed: { fieldErrors: flat, formErrors: [] }, format: 'flat-array' } : null
}

/**
 * Run all parsers (custom, array, object) against an already-unwrapped body.
 * Returns the first match, or null if no parser recognized the shape.
 */
function matchBody(
  body: unknown,
  fallbackField: string,
  transformField: (f: string) => string,
  customParsers: ReadonlyArray<CustomParser> | undefined
): MatchResult | null {
  if (customParsers?.length) {
    const custom = tryCustomParsers(body, customParsers)
    if (custom !== null) return custom
  }
  if (Array.isArray(body)) return matchArrayBody(body, fallbackField, transformField)
  if (!isObject(body)) return null
  return matchObjectBody(body, fallbackField, transformField)
}

// ---------------------------------------------------------------------------
// Status filtering helper
// ---------------------------------------------------------------------------

function extractStatus(error: unknown): number | undefined {
  if (!isObject(error)) return undefined
  const e = error as Record<string, unknown>
  if (typeof e['status'] === 'number') return e['status'] as number
  if (isObject(e['response'])) {
    const r = e['response'] as Record<string, unknown>
    if (typeof r['status'] === 'number') return r['status'] as number
  }
  return undefined
}

/** True when the error's status code is present but not in the allowed list. */
function isStatusBlocked(error: unknown, options: MapApiErrorsOptions | undefined): boolean {
  if (!options?.statusCodes) return false
  const status = extractStatus(error)
  return status !== undefined && !options.statusCodes.includes(status)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extract errors from an unknown API error response, returning a rich result
 * that includes field errors, form-level (non-field) errors, and the matched format.
 *
 * Use `format` to distinguish "unrecognized shape" (format is null) from
 * "recognized but genuinely no errors" (format is non-null, both arrays empty).
 *
 * `formErrors` contains global / non-field error messages that cannot be
 * attributed to a specific field (e.g. RFC 9457 `detail`, JSON:API errors
 * without a source pointer, violations without a field name).
 *
 * Supports all formats recognized by `extractFieldErrors`, plus:
 * - `violations: [{ field, message }]`
 * - `"invalid-params": [{ name, reason }]`
 * - JSON:API `errors: [{ source: { pointer }, detail }]`
 * - Laravel / DRF top-level field map `{ field: ["msg", ...] }`
 *
 * Use `options.parsers` to register custom parsers for application-specific shapes.
 *
 * Never throws.
 */
export function extractErrors(error: unknown, options?: MapApiErrorsOptions): ExtractResult {
  const fallbackField = options?.fallbackField ?? 'root'
  const transformField = options?.transformField ?? ((f: string) => f)
  const resolveMessage = options?.resolveMessage

  try {
    if (isStatusBlocked(error, options)) return { fieldErrors: [], formErrors: [], format: null }

    const match = matchBody(unwrapBody(error), fallbackField, transformField, options?.parsers)
    if (match === null) return { fieldErrors: [], formErrors: [], format: null }

    const { parsed, format } = match
    const fieldErrors = finalize(
      resolveMessage
        ? parsed.fieldErrors.map((e) => ({
            field: e.field,
            message: resolveMessage(e.message, e.field),
          }))
        : parsed.fieldErrors
    )
    const formErrors = resolveMessage
      ? parsed.formErrors.map((m) => resolveMessage(m, null))
      : parsed.formErrors
    return { fieldErrors, formErrors, format }
  } catch {
    return { fieldErrors: [], formErrors: [], format: null }
  }
}

/**
 * Extract normalized field errors from an unknown API error response.
 *
 * Supports:
 * - RFC 7807 / RFC 9457 Problem Details (Spring Boot 3+) with `errors` map
 * - RFC 9457 top-level `detail` field as a root-level error
 * - RFC 9457 `violations: [{ field, message }]` array
 * - RFC 9457 `"invalid-params": [{ name, reason }]` array
 * - JSON:API `errors: [{ source: { pointer }, detail }]` array
 * - Laravel / DRF top-level field map `{ field: ["msg", ...] }`
 * - Spring Boot default validation format (array of `{ field, defaultMessage }`)
 * - Simple flat `{ field, message }` object
 * - Array of `{ field, message }` objects
 *
 * Use `statusCodes` to restrict extraction to specific HTTP status codes.
 *
 * For a richer result that includes non-field errors and the matched format,
 * use `extractErrors` instead.
 *
 * Never throws — returns an empty array for unrecognized shapes.
 */
export function extractFieldErrors(error: unknown, options?: MapApiErrorsOptions): FieldError[] {
  const fallbackField = options?.fallbackField ?? 'root'
  const transformField = options?.transformField ?? ((f: string) => f)

  try {
    if (isStatusBlocked(error, options)) return []

    const match = matchBody(unwrapBody(error), fallbackField, transformField, options?.parsers)
    if (match === null) return []

    const { parsed } = match
    // In the legacy API, form-level errors fall back to fallbackField instead of
    // being returned in a separate channel.
    const fallbackErrors: FieldError[] = parsed.formErrors.map((message) => ({
      field: transformField(fallbackField),
      message,
    }))
    return finalize([...parsed.fieldErrors, ...fallbackErrors])
  } catch {
    return []
  }
}

/**
 * React Hook Form adapter.
 *
 * Extracts field errors from an unknown API error response and calls
 * React Hook Form's `setError` for each one.
 *
 * @example
 * ```ts
 * try {
 *   await submitForm(data)
 * } catch (error) {
 *   mapApiErrors(error, setError)
 * }
 * ```
 */
export function mapApiErrors(
  error: unknown,
  setError: (field: string, error: { type: string; message: string }) => void,
  options?: MapApiErrorsOptions
): void {
  const fieldErrors = extractFieldErrors(error, options)
  for (const { field, message } of fieldErrors) {
    setError(field, { type: 'server', message })
  }
}
