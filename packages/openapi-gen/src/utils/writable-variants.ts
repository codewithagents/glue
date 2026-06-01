import type { OpenAPIV3_1 } from 'openapi-types'
import { toTypeName, uniquifyName } from './naming.js'

type SchemaObject = OpenAPIV3_1.SchemaObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject

function isRef(schema: SchemaObject | ReferenceObject): schema is ReferenceObject {
  return '$ref' in schema
}

/**
 * Collect the effective flat list of (propertyName, schemaObject) pairs for a component schema.
 * Covers direct `properties` PLUS inline-object members of any `allOf` entries.
 * Only top-level allOf members that are inline objects (not $refs) are expanded.
 * This intentionally does NOT recurse into $ref targets: only component-level schemas
 * use this helper, and cross-schema readOnly/writeOnly inheritance is a future concern.
 */
function collectEffectiveProperties(
  schema: SchemaObject | ReferenceObject
): Array<{ name: string; schema: SchemaObject }> {
  if (isRef(schema)) return []

  const s = schema as SchemaObject
  const result: Array<{ name: string; schema: SchemaObject }> = []

  // Direct properties
  const directProps = s.properties as Record<string, SchemaObject | ReferenceObject> | undefined
  if (directProps !== undefined) {
    for (const [name, propSchema] of Object.entries(directProps)) {
      if (!isRef(propSchema)) {
        result.push({ name, schema: propSchema as SchemaObject })
      }
    }
  }

  // Inline-object allOf members
  if (s.allOf !== undefined) {
    for (const allOfMember of s.allOf as (SchemaObject | ReferenceObject)[]) {
      if (isRef(allOfMember)) continue
      const member = allOfMember as SchemaObject
      // Only expand inline objects that themselves have properties
      const memberProps = member.properties as
        | Record<string, SchemaObject | ReferenceObject>
        | undefined
      if (memberProps !== undefined) {
        for (const [name, propSchema] of Object.entries(memberProps)) {
          if (!isRef(propSchema)) {
            result.push({ name, schema: propSchema as SchemaObject })
          }
        }
      }
    }
  }

  return result
}

/**
 * Returns true when a component schema X has at least one readOnly or writeOnly property.
 * When true, two variants should be emitted: X (read shape) and XWritable (write shape).
 */
function schemaHasSplitProperties(schema: SchemaObject | ReferenceObject): boolean {
  const props = collectEffectiveProperties(schema)
  return props.some(
    (p) => (p.schema as SchemaObject & { readOnly?: boolean; writeOnly?: boolean }).readOnly === true ||
    (p.schema as SchemaObject & { readOnly?: boolean; writeOnly?: boolean }).writeOnly === true
  )
}

/**
 * Build a map from raw schema name to the resolved unique XWritable variant name.
 * Only includes schemas that actually need a split (have readOnly or writeOnly props).
 *
 * The "used" set passed in must already contain all top-level schema safe names
 * (from buildSchemaRenameMap) so that XWritable names never collide with them.
 */
export function buildWritableVariantMap(spec: OpenAPIV3_1.Document): Map<string, string> {
  const schemas = spec.components?.schemas as
    | Record<string, SchemaObject | ReferenceObject>
    | undefined

  const map = new Map<string, string>()
  if (schemas === undefined) return map

  // Collect all top-level safe names first (same logic as buildSchemaRenameMap in types.ts)
  const used = new Set<string>()
  for (const name of Object.keys(schemas)) {
    used.add(toTypeName(name))
  }

  for (const [name, schema] of Object.entries(schemas)) {
    if (!schemaHasSplitProperties(schema)) continue
    const safeName = toTypeName(name)
    const writableCandidate = `${safeName}Writable`
    const resolvedName = uniquifyName(writableCandidate, used)
    map.set(name, resolvedName)
  }

  return map
}

/**
 * Filter a schema's properties for the read (response) shape.
 * Excludes properties where writeOnly === true.
 */
export function readShapeProperties(
  schema: SchemaObject
): Record<string, SchemaObject | ReferenceObject> {
  const props = schema.properties as Record<string, SchemaObject | ReferenceObject> | undefined
  if (props === undefined) return {}
  const filtered: Record<string, SchemaObject | ReferenceObject> = {}
  for (const [key, propSchema] of Object.entries(props)) {
    if (!isRef(propSchema)) {
      const s = propSchema as SchemaObject & { writeOnly?: boolean }
      if (s.writeOnly === true) continue
    }
    filtered[key] = propSchema
  }
  return filtered
}

/**
 * Filter a schema's properties for the write (request) shape.
 * Excludes properties where readOnly === true.
 */
export function writeShapeProperties(
  schema: SchemaObject
): Record<string, SchemaObject | ReferenceObject> {
  const props = schema.properties as Record<string, SchemaObject | ReferenceObject> | undefined
  if (props === undefined) return {}
  const filtered: Record<string, SchemaObject | ReferenceObject> = {}
  for (const [key, propSchema] of Object.entries(props)) {
    if (!isRef(propSchema)) {
      const s = propSchema as SchemaObject & { readOnly?: boolean }
      if (s.readOnly === true) continue
    }
    filtered[key] = propSchema
  }
  return filtered
}
