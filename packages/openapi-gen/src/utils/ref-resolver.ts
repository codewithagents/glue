import type { OpenAPIV3_1 } from 'openapi-types'

type SchemaObject = OpenAPIV3_1.SchemaObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject

/**
 * A ref is "top-level" (a component schema) only when it has the exact shape
 * `#/components/schemas/{name}` with a single trailing segment. Those names are
 * emitted as named type declarations, so they can be referenced directly.
 *
 * Anything deeper is a "deep ref": path-based refs
 * (`#/paths/.../schema/properties/x`), nested properties of a component
 * (`#/components/schemas/Database/properties/allow_list`), array items, or
 * `$defs`/`definitions` reached by pointer. Their target types are never
 * emitted as named declarations, so a deep ref must be resolved and inlined
 * rather than referenced by its (non-existent) last-segment name.
 */
export function isDeepRef(ref: string): boolean {
  // Only internal refs are resolvable here; treat external refs as non-deep so
  // existing last-segment handling applies.
  if (!ref.startsWith('#/')) return false
  return /^#\/components\/schemas\/[^/]+$/.test(ref) === false
}

/**
 * Resolve an internal JSON pointer ($ref starting with '#/') against the spec.
 * Returns the target schema or reference object, or undefined when the pointer
 * does not resolve. Segments are URI-fragment decoded and JSON-pointer
 * unescaped (`~1` -> '/', `~0` -> '~') per RFC 6901.
 */
export function resolveJsonPointer(
  spec: OpenAPIV3_1.Document,
  ref: string
): SchemaObject | ReferenceObject | undefined {
  if (!ref.startsWith('#/')) return undefined
  const segments = ref
    .slice(2)
    .split('/')
    .map((seg) => decodeSegment(seg))
  let current: unknown = spec
  for (const seg of segments) {
    if (current === null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[seg]
    if (current === undefined) return undefined
  }
  if (current === null || typeof current !== 'object') return undefined
  return current as SchemaObject | ReferenceObject
}

/**
 * Decode a single JSON pointer segment: percent-decode the URI fragment first,
 * then apply RFC 6901 unescaping. The unescape order matters: `~1` before `~0`.
 */
function decodeSegment(seg: string): string {
  let decoded = seg
  try {
    decoded = decodeURIComponent(seg)
  } catch {
    decoded = seg
  }
  return decoded.replace(/~1/g, '/').replace(/~0/g, '~')
}
