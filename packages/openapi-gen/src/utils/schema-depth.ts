import type { OpenAPIV3_1 } from 'openapi-types'

type SchemaObject = OpenAPIV3_1.SchemaObject
type ArraySchemaObject = OpenAPIV3_1.ArraySchemaObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject

/**
 * Maximum inline schema nesting depth. Guards against a stack-overflow DoS from a
 * hostile spec with deeply nested inline schemas. Cyclic `$ref`s are handled
 * separately by the bundler + visited sets; this bounds raw inline nesting only.
 * 100 is far beyond any realistic real-world schema.
 */
const MAX_SCHEMA_DEPTH = 100

function isRef(schema: SchemaObject | ReferenceObject): schema is ReferenceObject {
  return '$ref' in schema
}

/** Direct inline child schemas of `s` (composition, properties, items, additionalProperties). */
function inlineChildren(s: SchemaObject): Array<SchemaObject | ReferenceObject> {
  const children: Array<SchemaObject | ReferenceObject> = []
  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    const list = s[key] as (SchemaObject | ReferenceObject)[] | undefined
    if (list !== undefined) children.push(...list)
  }
  if (s.properties !== undefined) {
    children.push(...Object.values(s.properties as Record<string, SchemaObject | ReferenceObject>))
  }
  const items = (s as unknown as ArraySchemaObject).items
  if (items !== undefined) children.push(items as SchemaObject | ReferenceObject)
  if (s.additionalProperties !== undefined && typeof s.additionalProperties === 'object') {
    children.push(s.additionalProperties as SchemaObject | ReferenceObject)
  }
  return children
}

/**
 * Reject a schema whose inline nesting exceeds {@link MAX_SCHEMA_DEPTH}, before any
 * recursive pass (type/zod emission, topo-sort ref collection, self-ref detection)
 * runs on it. The check is iterative (it keeps its own explicit stack and never
 * recurses), so the guard itself cannot overflow. `$ref`s are treated as leaves.
 */
export function assertBoundedDepth(root: SchemaObject | ReferenceObject): void {
  const stack: Array<{ node: SchemaObject | ReferenceObject; depth: number }> = [
    { node: root, depth: 0 },
  ]
  while (stack.length > 0) {
    const { node, depth } = stack.pop()!
    if (depth > MAX_SCHEMA_DEPTH) {
      throw new Error(
        `Schema nesting exceeds the maximum supported depth (${MAX_SCHEMA_DEPTH}). ` +
          `This usually indicates a malformed or hostile OpenAPI spec.`
      )
    }
    if (isRef(node)) continue
    for (const child of inlineChildren(node as SchemaObject)) {
      stack.push({ node: child, depth: depth + 1 })
    }
  }
}
