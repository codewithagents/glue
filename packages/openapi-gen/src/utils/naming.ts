/**
 * Convert a string to PascalCase, handling invalid identifier characters.
 */
export function toTypeName(name: string): string {
  // Split on non-alphanumeric sequences (avoids polynomial ReDoS from [^x]+y patterns).
  const parts = name.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  if (parts.length === 0) return '_'
  const joined = parts
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join('')
  const prefixed = /^[^a-zA-Z_$]/.test(joined) ? `_${joined}` : joined
  const titled = prefixed.replace(/^(.)/, (_, char: string) => char.toUpperCase())
  // Final sanitization: strip any chars that aren't valid in a JS identifier.
  const safe = titled.replace(/[^a-zA-Z0-9_$]/g, '')
  return safe.length > 0 ? safe : '_'
}

/**
 * Returns a name that is unique within the provided set.
 * If the candidate already exists, appends _2, _3, ... until a free slot is found.
 * The chosen name is added to the set before returning.
 */
export function uniquifyName(candidate: string, used: Set<string>): string {
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

/**
 * Resolve a JSON Schema $ref (e.g. '#/components/schemas/Foo') to a TypeScript
 * identifier. When a renameMap is provided (built by the dedup pass), the raw
 * schema name is looked up first so renamed identifiers are referenced correctly.
 */
export function refToTypeName(ref: string, renameMap?: Map<string, string>): string {
  const parts = ref.split('/')
  const raw = parts[parts.length - 1]!
  if (renameMap !== undefined) {
    const renamed = renameMap.get(raw)
    if (renamed !== undefined) return renamed
  }
  return toTypeName(raw)
}

/**
 * Reserved JavaScript keywords. An operation name that matches any of these
 * is prefixed with an underscore to avoid syntax errors in generated code.
 */
export const RESERVED = new Set([
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

/**
 * Converts a raw operationId (or path segment) into a valid camelCase JS identifier.
 * Handles kebab-case, snake_case, dots, spaces, parens, braces and other
 * non-alphanumeric separators found in real-world OpenAPI specs.
 * e.g. "post-applePay-sessions"   -> "postApplePaySessions"
 * e.g. "calendar.calendars.insert" -> "calendarCalendarsInsert"
 * e.g. "Get User Profile"          -> "getUserProfile"
 * e.g. "forgotPassword(oneTimeCode)" -> "forgotPasswordOneTimeCode"
 */
export function sanitizeOperationId(id: string): string {
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
  if (/^[0-9]/.test(camel)) return `_${camel}`
  // If result is a JS reserved word, prefix with underscore
  return RESERVED.has(camel) ? `_${camel}` : camel
}

/**
 * Derives a camelCase operation name from an HTTP method and path, for use
 * when an operation has no operationId. Handles plain path params ({id}),
 * mixed-brace segments ({lat}.{lon}.{format}), and /api/v{N}/ prefix stripping.
 *
 * This is the canonical implementation shared by both the fetch client and
 * the React Query hook generators. Both must use the same function to ensure
 * generated hook calls reference client functions that actually exist.
 *
 * e.g. GET /tasks             -> "getTasks"
 * e.g. GET /tasks/{id}        -> "getTasksById"
 * e.g. GET /{x}/{y}.{fmt}     -> "getByXByYByFmt"  (mixed-brace)
 */
// fallow-ignore-next-line complexity
export function deriveOperationName(method: string, path: string): string {
  const prefixMap: Record<string, string> = {
    get: 'get',
    post: 'create',
    put: 'update',
    patch: 'patch',
    delete: 'delete',
  }
  const prefix = prefixMap[method] ?? method

  // Strip /api/v1/ prefix
  const segments = path.replace(/^\/api\/v\d+\//, '').replace(/^\//, '')

  const parts = segments.split('/').map((seg) => {
    // Handle mixed segments like "{maxLat}.{format}" — extract each {param} inside.
    // Exclude both braces ([^{}] not [^}]) to stay linear-time and avoid the
    // polynomial-ReDoS pattern; param names never contain braces.
    const paramMatches = seg.match(/\{([^{}]+)\}/g)
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
    const sanitized = sanitizeOperationId(seg)
    return sanitized.charAt(0).toUpperCase() + sanitized.slice(1)
  })

  const joined = parts.join('')
  return prefix + joined
}

/**
 * Return a property key, adding quotes if the name contains special characters
 * that would make it invalid as an unquoted identifier.
 */
export function toPropertyKey(name: string): string {
  // Valid JS identifier: starts with letter, underscore, or $, followed by letters, digits, underscore, $
  const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)
  if (isValidIdentifier) {
    return name
  }
  // Escape backslashes and quotes, then wrap in quotes
  return `'${name.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}
