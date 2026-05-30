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
