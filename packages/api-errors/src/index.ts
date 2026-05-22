/**
 * Normalized representation of a single field-level error.
 */
export interface FieldError {
  field: string
  message: string
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
   * paths, e.g. `"addressCity"` → `"address.city"`.
   */
  transformField?: (field: string) => string
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
// Format detectors + parsers
// ---------------------------------------------------------------------------

/**
 * RFC 7807 Problem Details (Spring Boot 3+ default):
 * { "errors": { "email": ["must not be blank"], "name": ["too short"] } }
 */
function tryParseRfc7807(
  body: Record<string, unknown>,
  fallbackField: string,
  transformField: (field: string) => string,
): FieldError[] | null {
  const { errors } = body
  if (!isObject(errors)) return null

  const result: FieldError[] = []

  for (const [rawField, messages] of Object.entries(errors)) {
    const field = transformField(rawField)
    if (isStringArray(messages)) {
      for (const message of messages) {
        result.push({ field, message })
      }
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
  transformField: (field: string) => string,
): FieldError[] | null {
  const { errors } = body
  if (!Array.isArray(errors)) return null

  const result: FieldError[] = []

  for (const item of errors) {
    if (!isObject(item)) continue

    const rawField =
      typeof item['field'] === 'string' ? item['field'] : fallbackField
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
  transformField: (field: string) => string,
): FieldError[] | null {
  const rawField =
    typeof body['field'] === 'string' ? body['field'] : null
  const message =
    typeof body['message'] === 'string' ? body['message'] : null

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
  transformField: (field: string) => string,
): FieldError[] | null {
  const result: FieldError[] = []

  for (const item of body) {
    if (!isObject(item)) continue

    const rawField =
      typeof item['field'] === 'string' ? item['field'] : fallbackField
    const message =
      typeof item['message'] === 'string' ? item['message'] : null

    if (message === null) continue
    result.push({ field: transformField(rawField), message })
  }

  return result.length > 0 ? result : null
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extract normalized field errors from an unknown API error response.
 *
 * Supports:
 * - RFC 7807 Problem Details (Spring Boot 3+)
 * - Spring Boot default validation format
 * - Simple flat `{ field, message }` object
 * - Array of `{ field, message }` objects
 *
 * Never throws — returns an empty array for unrecognized shapes.
 */
export function extractFieldErrors(
  error: unknown,
  options?: MapApiErrorsOptions,
): FieldError[] {
  const fallbackField = options?.fallbackField ?? 'root'
  const transformField = options?.transformField ?? ((f) => f)

  try {
    // Unwrap common error wrapper shapes (e.g. Axios response, fetch response body)
    let body: unknown = error

    // Support objects with a `response.data` shape (Axios-style)
    if (isObject(body) && isObject(body['response']) && body['response']['data'] !== undefined) {
      body = body['response']['data']
    }

    // Support objects with a `data` property that contains the actual error body
    if (isObject(body) && isObject(body['data']) && !('field' in body) && !('errors' in body)) {
      body = body['data']
    }

    // Array of flat error objects
    if (Array.isArray(body)) {
      return tryParseFlatArray(body, fallbackField, transformField) ?? []
    }

    if (!isObject(body)) return []

    // Try RFC 7807 / Spring Boot 3 format first (object-style errors map)
    const rfc7807 = tryParseRfc7807(body, fallbackField, transformField)
    if (rfc7807 !== null) return rfc7807

    // Try Spring Boot default format (array-style errors list)
    const springArray = tryParseSpringArray(body, fallbackField, transformField)
    if (springArray !== null) return springArray

    // Try simple flat object
    const flat = tryParseFlatObject(body, fallbackField, transformField)
    if (flat !== null) return flat

    return []
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
  options?: MapApiErrorsOptions,
): void {
  const fieldErrors = extractFieldErrors(error, options)
  for (const { field, message } of fieldErrors) {
    setError(field, { type: 'server', message })
  }
}
