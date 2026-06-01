import type { OpenAPIV3_1 } from 'openapi-types'
import { toPropertyKey, toTypeName, uniquifyName, refToTypeName } from '../utils/naming.js'
import { isDeepRef, resolveJsonPointer } from '../utils/ref-resolver.js'
import {
  buildWritableVariantMap,
  readShapeProperties,
  writeShapeProperties,
} from '../utils/writable-variants.js'

export interface GeneratedFile {
  filename: string
  content: string
}

type SchemaObject = OpenAPIV3_1.SchemaObject
type ArraySchemaObject = OpenAPIV3_1.ArraySchemaObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject

function isRef(schema: SchemaObject | ReferenceObject): schema is ReferenceObject {
  return '$ref' in schema
}

/**
 * Build a rename map from raw schema names to unique TypeScript identifiers.
 * When two or more schema names sanitize to the same identifier (e.g. 'String'
 * and 'string' both become 'String'), the first one keeps the base name and
 * subsequent ones receive a numeric suffix ('String_2', 'String_3', ...).
 * The iteration order of Object.keys() is insertion order, which is deterministic.
 */
function buildSchemaRenameMap(spec: OpenAPIV3_1.Document): Map<string, string> {
  const schemas = spec.components?.schemas as
    | Record<string, SchemaObject | ReferenceObject>
    | undefined
  const map = new Map<string, string>()
  if (schemas === undefined) return map
  const used = new Set<string>()
  for (const name of Object.keys(schemas)) {
    const candidate = toTypeName(name)
    const unique = uniquifyName(candidate, used)
    map.set(name, unique)
  }
  return map
}

/** Return an inline comment for date/date-time formats, or '' for others. */
function formatComment(schema: SchemaObject): string {
  if (schema.type !== 'string') return ''
  const fmt = schema.format as string | undefined
  if (fmt === 'date-time') return ' /* date-time */'
  if (fmt === 'date') return ' /* date */'
  return ''
}

// pre-existing size, tracked in #228
// fallow-ignore-next-line complexity
function schemaToTypeString(
  schema: SchemaObject | ReferenceObject,
  renameMap?: Map<string, string>,
  spec?: OpenAPIV3_1.Document,
  visited?: Set<string>
): string {
  if (isRef(schema)) {
    const ref = schema.$ref
    if (spec !== undefined && isDeepRef(ref)) {
      // Deep ref: resolve the JSON pointer and emit the target schema inline.
      // Use a visited set to guard against cycles.
      const visitedSet = visited ?? new Set<string>()
      if (visitedSet.has(ref)) return 'unknown'
      visitedSet.add(ref)
      const resolved = resolveJsonPointer(spec, ref)
      if (resolved === undefined) return 'unknown'
      const result = schemaToTypeString(resolved, renameMap, spec, visitedSet)
      visitedSet.delete(ref)
      return result
    }
    return refToTypeName(ref, renameMap)
  }

  // const keyword: single fixed value -> TS literal type
  const constVal = (schema as SchemaObject & { const?: unknown }).const
  if (constVal !== undefined) {
    if (constVal === null) return 'null'
    if (typeof constVal === 'string') return JSON.stringify(constVal)
    if (typeof constVal === 'number' || typeof constVal === 'boolean') return String(constVal)
    return 'unknown'
  }

  // Handle nullable via OpenAPI 3.1 array type: type: ['string', 'null']
  if (Array.isArray(schema.type)) {
    const types = (schema.type as string[]).map((t) => {
      if (t === 'null') return 'null'
      return primitiveToTs(t, schema.format as string | undefined)
    })
    return types.join(' | ')
  }

  // enum - handles string, integer, number, mixed (null values rendered as "null" literal)
  // Non-primitive enum values (objects, arrays) cannot be expressed as TS literal types,
  // so they are widened to 'unknown' to avoid emitting invalid syntax like [object Object].
  if (schema.enum !== undefined && schema.enum.length > 0) {
    return schema.enum
      .map((v: unknown) => {
        if (v === null) return 'null'
        if (typeof v === 'string') return JSON.stringify(v) // double-quotes, handles apostrophes safely
        if (typeof v === 'number' || typeof v === 'boolean') return String(v)
        return 'unknown' // object or array enum value - no valid TS literal representation
      })
      .join(' | ')
  }

  // allOf: intersect all members, then merge in any sibling properties/required
  if (schema.allOf !== undefined && schema.allOf.length > 0) {
    const parts = (schema.allOf as (SchemaObject | ReferenceObject)[]).map((s) =>
      schemaToTypeString(s, renameMap, spec, visited)
    )
    // Sibling properties live outside the allOf array and must be included as an extra member
    const siblingProps = schema.properties as
      | Record<string, SchemaObject | ReferenceObject>
      | undefined
    if (siblingProps !== undefined && Object.keys(siblingProps).length > 0) {
      parts.push(inlineObjectType(schema, renameMap, spec, visited))
    }
    if (parts.length === 1) return parts[0]!
    return parts.join(' & ')
  }

  // anyOf
  if (schema.anyOf !== undefined && schema.anyOf.length > 0) {
    return (schema.anyOf as (SchemaObject | ReferenceObject)[])
      .map((s) => schemaToTypeString(s, renameMap, spec, visited))
      .join(' | ')
  }

  // oneOf
  if (schema.oneOf !== undefined && schema.oneOf.length > 0) {
    return (schema.oneOf as (SchemaObject | ReferenceObject)[])
      .map((s) => schemaToTypeString(s, renameMap, spec, visited))
      .join(' | ')
  }

  const type = schema.type as string | undefined

  // array
  if (type === 'array') {
    // prefixItems (OpenAPI 3.1 / JSON Schema 2020-12): fixed-position tuple elements
    const prefixItems = (
      schema as SchemaObject & { prefixItems?: (SchemaObject | ReferenceObject)[] }
    ).prefixItems
    if (prefixItems !== undefined && prefixItems.length > 0) {
      const tupleElements = prefixItems.map((item) =>
        schemaToTypeString(item, renameMap, spec, visited)
      )
      const arraySchema = schema as ArraySchemaObject
      const restItems = arraySchema.items as SchemaObject | ReferenceObject | undefined
      if (restItems !== undefined) {
        // Tuple with rest: [T0, T1, ...Rest[]]
        return `[${tupleElements.join(', ')}, ...${schemaToTypeString(restItems, renameMap, spec, visited)}[]]`
      }
      return `[${tupleElements.join(', ')}]`
    }

    const arraySchema = schema as ArraySchemaObject
    const items = arraySchema.items as SchemaObject | ReferenceObject | undefined
    if (items !== undefined) {
      return `${schemaToTypeString(items, renameMap, spec, visited)}[]`
    }
    return 'unknown[]'
  }

  // object
  if (type === 'object') {
    // additionalProperties without explicit properties -> Record
    if (
      schema.additionalProperties !== undefined &&
      schema.additionalProperties !== false &&
      schema.additionalProperties !== true &&
      (schema.properties === undefined || Object.keys(schema.properties).length === 0)
    ) {
      const valType = schemaToTypeString(
        schema.additionalProperties as SchemaObject | ReferenceObject,
        renameMap,
        spec,
        visited
      )
      return `Record<string, ${valType}>`
    }
    // inline object with properties
    if (schema.properties !== undefined) {
      return inlineObjectType(schema, renameMap, spec, visited)
    }
    return 'Record<string, unknown>'
  }

  if (type !== undefined) {
    return primitiveToTs(type, schema.format as string | undefined)
  }

  return 'unknown'
}

/**
 * Map an OpenAPI primitive type to a TypeScript type.
 * For integer with format int64, returns bigint instead of number
 * to preserve precision for 64-bit IDs.
 */
function primitiveToTs(type: string, format?: string): string {
  switch (type) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'integer':
      // int64 requires bigint for precision-safe 64-bit IDs (JS number cannot represent >2^53)
      return format === 'int64' ? 'bigint' : 'number'
    case 'boolean':
      return 'boolean'
    case 'null':
      return 'null'
    default:
      return 'unknown'
  }
}

function inlineObjectType(
  schema: SchemaObject,
  renameMap?: Map<string, string>,
  spec?: OpenAPIV3_1.Document,
  visited?: Set<string>
): string {
  const required = new Set<string>(schema.required ?? [])
  const props = schema.properties as Record<string, SchemaObject | ReferenceObject> | undefined
  if (props === undefined || Object.keys(props).length === 0) {
    return 'Record<string, unknown>'
  }
  const lines = Object.entries(props).map(([key, propSchema]) => {
    const optional = !required.has(key)
    const propKey = toPropertyKey(key)
    const typStr = schemaToTypeString(propSchema, renameMap, spec, visited)
    // Add inline format comment for date/date-time string properties
    const comment = isRef(propSchema) ? '' : formatComment(propSchema as SchemaObject)
    return `  ${propKey}${optional ? '?' : ''}: ${typStr}${comment}`
  })
  return `{\n${lines.join('\n')}\n}`
}

function isEnumSchema(schema: SchemaObject): boolean {
  if (schema.enum === undefined || schema.enum.length === 0) return false
  // String enums, numeric enums (integer/number), and mixed/untyped enums
  if (schema.type === 'string' || schema.type === 'integer' || schema.type === 'number') return true
  // Mixed enums: no explicit type but enum values present
  if (schema.type === undefined) return true
  return false
}

/** True when every enum value is a number (no strings, no nulls). */
function isNumericEnum(schema: SchemaObject): boolean {
  return (schema.enum ?? []).every((v: unknown) => typeof v === 'number')
}

/** True when every enum value is a string (no numbers, no nulls). */
function isStringEnum(schema: SchemaObject): boolean {
  return (schema.enum ?? []).every((v: unknown) => typeof v === 'string')
}

function isObjectSchema(schema: SchemaObject): boolean {
  // allOf with sibling properties/required is object-like: the sibling props/required apply to
  // the merged result, so schema-enhanced mode should defer to z.infer<> for it.
  if (schema.allOf !== undefined) {
    const siblingProps = schema.properties as Record<string, unknown> | undefined
    return siblingProps !== undefined && Object.keys(siblingProps).length > 0
  }
  // anyOf/oneOf without allOf are treated as type aliases
  if (schema.anyOf !== undefined || schema.oneOf !== undefined) {
    return false
  }
  return schema.type === 'object' || schema.properties !== undefined
}

/** Derive the discriminator literal value for a variant ref */
function discriminatorLiteralFor(ref: string, mapping: Record<string, string> | undefined): string {
  if (mapping !== undefined) {
    // Find the key whose value matches the ref
    for (const [key, val] of Object.entries(mapping)) {
      if (val === ref || val.endsWith(`/${ref.split('/').pop()!}`)) {
        return key
      }
    }
  }
  // Fall back: extract the type name from the ref and lowercase it
  const typeName = refToTypeName(ref)
  return typeName.charAt(0).toLowerCase() + typeName.slice(1)
}

interface TypesOptions {
  schemaNames?: Set<string>
  schemaImportPath?: string
}

// pre-existing size, tracked in #228
// fallow-ignore-next-line complexity
function generateSchemaDeclaration(
  name: string,
  schema: SchemaObject | ReferenceObject,
  options?: TypesOptions,
  renameMap?: Map<string, string>,
  spec?: OpenAPIV3_1.Document,
  writableVariantMap?: Map<string, string>
): string {
  // Use the pre-computed unique name from the rename map when available;
  // otherwise fall back to the standard sanitization.
  const safeName = renameMap?.get(name) ?? toTypeName(name)

  if (isRef(schema)) {
    const ref = schema.$ref
    if (spec !== undefined && isDeepRef(ref)) {
      const resolved = resolveJsonPointer(spec, ref)
      const inlineType =
        resolved !== undefined ? schemaToTypeString(resolved, renameMap, spec) : 'unknown'
      return `export type ${safeName} = ${inlineType}`
    }
    return `export type ${safeName} = ${refToTypeName(ref, renameMap)}`
  }

  // const keyword: single fixed value -> TS literal type alias
  const constVal = (schema as SchemaObject & { const?: unknown }).const
  if (constVal !== undefined) {
    if (constVal === null) return `export type ${safeName} = null`
    if (typeof constVal === 'string') return `export type ${safeName} = ${JSON.stringify(constVal)}`
    if (typeof constVal === 'number' || typeof constVal === 'boolean')
      return `export type ${safeName} = ${String(constVal)}`
    return `export type ${safeName} = unknown`
  }

  // Schema-enhanced mode: for object schemas with a matching Zod schema, use z.infer
  if (
    options?.schemaNames !== undefined &&
    options.schemaNames.has(`${safeName}Schema`) &&
    isObjectSchema(schema)
  ) {
    return `export type ${safeName} = z.infer<typeof ${safeName}Schema>`
  }

  if (isEnumSchema(schema)) {
    const union = schema
      .enum!.map((v: unknown) => {
        if (v === null) return 'null'
        if (typeof v === 'string') return JSON.stringify(v) // double-quotes, handles apostrophes safely
        return String(v)
      })
      .join(' | ')
    const typeDecl = `export type ${safeName} = ${union}`
    // Emit a values array for pure string and pure numeric enums so consumers can
    // iterate valid values (e.g. to populate a <select>) without hardcoding them.
    // Mixed enums (string + number, or containing null) intentionally get no array.
    if (isStringEnum(schema)) {
      const arr = (schema.enum as string[]).map((v) => JSON.stringify(v)).join(', ')
      return `${typeDecl}\nexport const ${safeName}Values = [${arr}] as const`
    }
    if (isNumericEnum(schema)) {
      const arr = (schema.enum as number[]).join(', ')
      return `${typeDecl}\nexport const ${safeName}Values = [${arr}] as const`
    }
    return typeDecl
  }

  // allOf with sibling properties: emit as merged type alias, not an interface.
  // Generating an interface here would only capture the sibling properties and silently
  // drop the allOf base types. schemaToTypeString handles the merge correctly.
  if (schema.allOf !== undefined && schema.allOf.length > 0) {
    const typeStr = schemaToTypeString(schema, renameMap, spec)
    return `export type ${safeName} = ${typeStr}`
  }

  if (isObjectSchema(schema)) {
    const required = new Set<string>(schema.required ?? [])
    const props = schema.properties as Record<string, SchemaObject | ReferenceObject> | undefined

    // object with additionalProperties (no properties) -> type alias
    if (
      schema.additionalProperties !== undefined &&
      schema.additionalProperties !== false &&
      schema.additionalProperties !== true &&
      (props === undefined || Object.keys(props).length === 0)
    ) {
      const valType = schemaToTypeString(
        schema.additionalProperties as SchemaObject | ReferenceObject,
        renameMap,
        spec
      )
      return `export type ${safeName} = Record<string, ${valType}>`
    }

    // Check if this schema has a writable variant (readOnly/writeOnly properties present)
    const writableName = writableVariantMap?.get(name)
    const hasSplit = writableName !== undefined

    // Build the read-shape (X): exclude writeOnly properties when split is active
    const readProps = hasSplit ? readShapeProperties(schema) : props
    const propLines: string[] = []
    if (readProps !== undefined) {
      for (const [key, propSchema] of Object.entries(readProps)) {
        const optional = !required.has(key)
        const propKey = toPropertyKey(key)
        const typStr = schemaToTypeString(propSchema, renameMap, spec)
        // Add inline format comment for date/date-time string properties
        const comment = isRef(propSchema) ? '' : formatComment(propSchema as SchemaObject)
        propLines.push(`  ${propKey}${optional ? '?' : ''}: ${typStr}${comment}`)
      }
    }

    const readDecl =
      propLines.length === 0
        ? `export type ${safeName} = Record<string, unknown>`
        : `export interface ${safeName} {\n${propLines.join('\n')}\n}`

    if (!hasSplit) return readDecl

    // Build the write-shape (XWritable): exclude readOnly properties
    const writeProps = writeShapeProperties(schema)
    const writePropLines: string[] = []
    for (const [key, propSchema] of Object.entries(writeProps)) {
      const optional = !required.has(key)
      const propKey = toPropertyKey(key)
      const typStr = schemaToTypeString(propSchema, renameMap, spec)
      const comment = isRef(propSchema) ? '' : formatComment(propSchema as SchemaObject)
      writePropLines.push(`  ${propKey}${optional ? '?' : ''}: ${typStr}${comment}`)
    }
    const writableDecl =
      writePropLines.length === 0
        ? `export interface ${writableName} {}`
        : `export interface ${writableName} {\n${writePropLines.join('\n')}\n}`

    return `${readDecl}\n\n${writableDecl}`
  }

  // Discriminated union via oneOf/anyOf + discriminator
  const discriminator = (
    schema as SchemaObject & {
      discriminator?: { propertyName: string; mapping?: Record<string, string> }
    }
  ).discriminator
  const compositeVariants = schema.oneOf ?? schema.anyOf
  if (
    discriminator !== undefined &&
    compositeVariants !== undefined &&
    compositeVariants.length > 0
  ) {
    const { propertyName, mapping } = discriminator
    const variants = (compositeVariants as (SchemaObject | ReferenceObject)[]).map((variant) => {
      if (!isRef(variant)) {
        // Inline schema in discriminated union - emit as plain variant
        return schemaToTypeString(variant, renameMap, spec)
      }
      const ref = (variant as ReferenceObject).$ref
      const typeName = refToTypeName(ref, renameMap)
      const literalValue = discriminatorLiteralFor(ref, mapping)
      return `(${typeName} & { ${propertyName}: '${literalValue}' })`
    })
    const lines = variants.map((v, i) => (i === 0 ? `  | ${v}` : `  | ${v}`))
    return `export type ${safeName} =\n${lines.join('\n')}`
  }

  // allOf / anyOf / oneOf or other -> type alias
  const typeStr = schemaToTypeString(schema, renameMap, spec)
  return `export type ${safeName} = ${typeStr}`
}

/**
 * Build the file header lines for models.ts.
 * In schema-enhanced mode, emits the zod import and the named schema imports.
 * In plain mode, emits only the auto-generated banner.
 */
function buildModelsHeader(
  schemas: Record<string, SchemaObject | ReferenceObject> | undefined,
  options: TypesOptions | undefined,
  renameMap: Map<string, string>
): string[] {
  const banner = '// This file is auto-generated by @codewithagents/openapi-gen - do not edit'
  if (options?.schemaNames === undefined || options.schemaImportPath === undefined) {
    return [banner, '']
  }
  const importedSchemas: string[] = []
  for (const name of Object.keys(schemas ?? {})) {
    const safeName = renameMap.get(name) ?? toTypeName(name)
    if (options.schemaNames.has(`${safeName}Schema`)) {
      importedSchemas.push(`${safeName}Schema`)
    }
  }
  return [
    banner,
    "import type { z } from 'zod'",
    `import type { ${importedSchemas.join(', ')} } from '${options.schemaImportPath}'`,
    '',
  ]
}

/**
 * Collect sub-schemas from the `definitions` / `$defs` blocks that some specs
 * embed inside a component schema object (e.g. `#/components/schemas/Account/definitions/accountRef`).
 * These sub-schemas are referenced by other schemas via their last-segment name but are never
 * emitted as top-level types unless we surface them here.
 *
 * Rules:
 *  - Only the `definitions` and `$defs` keywords are supported (JSON Schema conventions).
 *  - The candidate PascalCase name must not collide with an existing top-level schema name.
 *    If it does, the sub-schema is skipped (the top-level type already satisfies the reference).
 *  - Names are deduped: when two parents expose a sub-def that sanitizes to the same identifier
 *    the second one is skipped (they are expected to be structurally identical cross-references).
 */
function collectSubDefinitions(
  schemas: Record<string, SchemaObject | ReferenceObject>
): Map<string, SchemaObject | ReferenceObject> {
  const topLevelNames = new Set(Object.keys(schemas).map((n) => toTypeName(n)))
  const collected = new Map<string, SchemaObject | ReferenceObject>()

  for (const parentSchema of Object.values(schemas)) {
    if (isRef(parentSchema)) continue
    const s = parentSchema as SchemaObject & {
      definitions?: Record<string, SchemaObject | ReferenceObject>
      $defs?: Record<string, SchemaObject | ReferenceObject>
    }
    const defs: Record<string, SchemaObject | ReferenceObject> = {
      ...(s.definitions ?? {}),
      ...(s.$defs ?? {}),
    }
    for (const [defName, defSchema] of Object.entries(defs)) {
      const safeName = toTypeName(defName)
      // Skip if the PascalCase name collides with a top-level schema or was already collected.
      if (topLevelNames.has(safeName) || collected.has(safeName)) continue
      collected.set(safeName, defSchema)
    }
  }

  return collected
}

export function generateTypes(spec: OpenAPIV3_1.Document, options?: TypesOptions): GeneratedFile {
  const schemas = spec.components?.schemas as
    | Record<string, SchemaObject | ReferenceObject>
    | undefined

  // Build rename map so duplicate sanitized identifiers get deterministic suffixes.
  // E.g. schemas 'String' and 'string' both sanitize to 'String'; the second becomes 'String_2'.
  const renameMap = buildSchemaRenameMap(spec)

  // Build the map of component schemas that need a readOnly/writeOnly split.
  // Keys are raw schema names; values are the resolved unique XWritable variant names.
  const writableVariantMap = buildWritableVariantMap(spec)

  const lines: string[] = buildModelsHeader(schemas, options, renameMap)

  if (schemas !== undefined) {
    for (const [name, schema] of Object.entries(schemas)) {
      lines.push(
        generateSchemaDeclaration(name, schema, options, renameMap, spec, writableVariantMap)
      )
      lines.push('')
    }

    // Emit sub-definitions from definitions/$defs blocks inside component schemas.
    // These are referenced by other schemas via their last-segment PascalCase name
    // (e.g. #/components/schemas/Account/definitions/accountRef -> AccountRef) but are
    // not emitted by the top-level loop above.
    const subDefs = collectSubDefinitions(schemas)
    for (const [safeName, defSchema] of subDefs) {
      // Sub-defs are already sanitized; pass the safe name directly by faking a
      // 1-entry rename map so generateSchemaDeclaration picks it up.
      const subRenameMap = new Map([[safeName, safeName]])
      lines.push(generateSchemaDeclaration(safeName, defSchema, options, subRenameMap, spec))
      lines.push('')
    }
  }

  return {
    filename: 'models.ts',
    content: lines.join('\n'),
  }
}
