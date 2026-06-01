import type { OpenAPIV3_1 } from 'openapi-types'
import { toTypeName, uniquifyName } from './naming.js'

type SchemaObject = OpenAPIV3_1.SchemaObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject
type PropMap = Record<string, SchemaObject | ReferenceObject>

function isRef(schema: SchemaObject | ReferenceObject): schema is ReferenceObject {
  return '$ref' in schema
}

/**
 * Copy a property map, optionally dropping properties flagged readOnly or writeOnly.
 * $ref properties carry no readOnly/writeOnly flag and are always kept.
 * Pass `exclude: null` to copy every property unchanged.
 */
function filterProps(
  props: PropMap | undefined,
  exclude: 'readOnly' | 'writeOnly' | null
): PropMap {
  const out: PropMap = {}
  if (props === undefined) return out
  for (const [key, propSchema] of Object.entries(props)) {
    if (exclude !== null && !isRef(propSchema)) {
      if ((propSchema as SchemaObject & Record<string, unknown>)[exclude] === true) continue
    }
    out[key] = propSchema
  }
  return out
}

/** True when any inline property in the map is flagged readOnly or writeOnly. */
function hasSplitFlag(props: PropMap | undefined): boolean {
  if (props === undefined) return false
  return Object.values(props).some((p) => {
    if (isRef(p)) return false
    const s = p as SchemaObject & { readOnly?: boolean; writeOnly?: boolean }
    return s.readOnly === true || s.writeOnly === true
  })
}

/**
 * Returns true when a component schema X has at least one readOnly or writeOnly property
 * (in its direct properties or an inline-object allOf member). When true, two variants
 * should be emitted: X (read shape) and XWritable (write shape).
 * Does not recurse into $ref targets: cross-schema flag inheritance is a future concern.
 */
function schemaHasSplitProperties(schema: SchemaObject | ReferenceObject): boolean {
  if (isRef(schema)) return false
  const s = schema as SchemaObject
  if (hasSplitFlag(s.properties as PropMap | undefined)) return true
  for (const member of (s.allOf as (SchemaObject | ReferenceObject)[] | undefined) ?? []) {
    if (
      !isRef(member) &&
      hasSplitFlag((member as SchemaObject).properties as PropMap | undefined)
    ) {
      return true
    }
  }
  return false
}

/**
 * Build a map from raw schema name to the resolved unique XWritable variant name.
 * Only includes schemas that actually need a split (have readOnly or writeOnly props).
 * XWritable names are uniquified against all top-level schema safe names so they never collide.
 */
export function buildWritableVariantMap(spec: OpenAPIV3_1.Document): Map<string, string> {
  const schemas = spec.components?.schemas as
    | Record<string, SchemaObject | ReferenceObject>
    | undefined
  const map = new Map<string, string>()
  if (schemas === undefined) return map

  const used = new Set<string>()
  for (const name of Object.keys(schemas)) used.add(toTypeName(name))

  for (const [name, schema] of Object.entries(schemas)) {
    if (!schemaHasSplitProperties(schema)) continue
    const resolvedName = uniquifyName(`${toTypeName(name)}Writable`, used)
    map.set(name, resolvedName)
  }
  return map
}

/**
 * Filter a schema's direct properties for the read (response) shape: excludes writeOnly props.
 * For allOf schemas use filterAllOfMembersForRead instead.
 */
export function readShapeProperties(schema: SchemaObject): PropMap {
  return filterProps(schema.properties as PropMap | undefined, 'writeOnly')
}

/**
 * Return the schema's allOf array with writeOnly properties removed from inline (non-$ref)
 * members. $ref members are kept unchanged. Used to rebuild the read-shape type for allOf schemas.
 */
export function filterAllOfMembersForRead(
  schema: SchemaObject
): Array<SchemaObject | ReferenceObject> {
  const allOf = schema.allOf as (SchemaObject | ReferenceObject)[] | undefined
  if (allOf === undefined) return []
  return allOf.map((member) => {
    if (isRef(member)) return member
    const m = member as SchemaObject
    if (m.properties === undefined) return m
    return { ...m, properties: filterProps(m.properties as PropMap, 'writeOnly') } as SchemaObject
  })
}

/**
 * Collect all effective write-shape properties for a schema: direct properties plus inline
 * allOf member properties, excluding readOnly ones. Required is the union of the direct
 * `required` and each inline allOf member's `required`.
 */
export function effectiveWriteProperties(schema: SchemaObject): {
  props: PropMap
  required: Set<string>
} {
  const props: PropMap = {}
  const required = new Set<string>()

  const addSource = (
    sourceProps: PropMap | undefined,
    sourceRequired: string[] | undefined
  ): void => {
    for (const r of sourceRequired ?? []) required.add(r)
    Object.assign(props, filterProps(sourceProps, 'readOnly'))
  }

  addSource(schema.properties as PropMap | undefined, schema.required as string[] | undefined)
  for (const member of (schema.allOf as (SchemaObject | ReferenceObject)[] | undefined) ?? []) {
    if (isRef(member)) continue
    const m = member as SchemaObject
    addSource(m.properties as PropMap | undefined, m.required as string[] | undefined)
  }

  return { props, required }
}
