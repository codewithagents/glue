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
