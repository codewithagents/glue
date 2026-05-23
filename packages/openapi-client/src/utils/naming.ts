/**
 * Convert a string to PascalCase, handling invalid identifier characters.
 */
export function toTypeName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase())
    .replace(/^[^a-zA-Z_$]/, '_')
    .replace(/^(.)/, (_, char: string) => char.toUpperCase())
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
