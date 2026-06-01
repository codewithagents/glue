import type { OpenAPIV3_1 } from 'openapi-types'
import { toPropertyKey, toTypeName } from '../utils/naming.js'
import type { GeneratedFile } from './types.js'

type SchemaObject = OpenAPIV3_1.SchemaObject
type ArraySchemaObject = OpenAPIV3_1.ArraySchemaObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject

function isRef(schema: SchemaObject | ReferenceObject): schema is ReferenceObject {
  return '$ref' in schema
}

function refToSchemaName(ref: string): string {
  // '#/components/schemas/Foo' -> 'FooSchema' (sanitized to a valid TS identifier)
  const parts = ref.split('/')
  return `${toTypeName(parts[parts.length - 1]!)}Schema`
}

function refToTypeName(ref: string): string {
  // '#/components/schemas/Foo' -> 'Foo' (sanitized to a valid TS identifier)
  const parts = ref.split('/')
  return toTypeName(parts[parts.length - 1]!)
}

/** Check whether a schema tree contains a $ref to the given schema name (self-reference). */
function hasSelfRef(
  schema: SchemaObject | ReferenceObject,
  name: string,
  visited = new Set<SchemaObject | ReferenceObject>()
): boolean {
  if (visited.has(schema)) return false
  visited.add(schema)

  if (isRef(schema)) {
    return refToTypeName(schema.$ref) === name
  }

  const s = schema as SchemaObject

  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    const list = s[key] as (SchemaObject | ReferenceObject)[] | undefined
    if (list !== undefined) {
      for (const item of list) {
        if (hasSelfRef(item, name, visited)) return true
      }
    }
  }

  if (s.properties !== undefined) {
    for (const propSchema of Object.values(
      s.properties as Record<string, SchemaObject | ReferenceObject>
    )) {
      if (hasSelfRef(propSchema, name, visited)) return true
    }
  }

  const items = (s as unknown as ArraySchemaObject).items
  if (items !== undefined) {
    if (hasSelfRef(items as SchemaObject | ReferenceObject, name, visited)) return true
  }

  if (s.additionalProperties !== undefined && typeof s.additionalProperties === 'object') {
    if (hasSelfRef(s.additionalProperties as SchemaObject | ReferenceObject, name, visited))
      return true
  }

  return false
}

/**
 * Serialize a JSON value as a TypeScript literal expression.
 * Used for `default` and `const` values.
 */
function serializeLiteral(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  // Arrays and objects: use JSON.stringify (produces valid JS literal)
  return JSON.stringify(value)
}

/**
 * Return the Zod v4 base expression for a primitive type.
 * For integer with format int64, returns z.bigint() instead of z.number()
 * to preserve precision for 64-bit IDs.
 */
function primitiveToZod(type: string, format?: string): string {
  switch (type) {
    case 'string':
      return 'z.string()'
    case 'number':
      return 'z.number()'
    case 'integer':
      // int64 requires bigint for precision-safe 64-bit IDs (JS number cannot represent >2^53)
      return format === 'int64' ? 'z.bigint()' : 'z.number()'
    case 'boolean':
      return 'z.boolean()'
    case 'null':
      return 'z.null()'
    default:
      return 'z.unknown()'
  }
}

/**
 * Return the Zod v4 base for a string schema, using top-level format validators
 * (z.email(), z.url(), z.uuid(), z.iso.datetime(), z.iso.date()) where applicable.
 * These are the Zod v4 equivalents of the deprecated chained .email()/.url()/.uuid() methods.
 * byte/binary formats stay as z.string() (no runtime validation, correct base type).
 */
function stringBase(format: string | undefined): string {
  switch (format) {
    case 'email':
      return 'z.email()'
    case 'url':
      return 'z.url()'
    case 'uuid':
      return 'z.uuid()'
    case 'date-time':
      return 'z.iso.datetime()'
    case 'date':
      return 'z.iso.date()'
    default:
      return 'z.string()'
  }
}

/**
 * Chain OpenAPI string constraints (minLength, maxLength, pattern) onto a base Zod string
 * expression. Format-based validators are handled in stringBase() instead.
 */
function applyStringConstraints(base: string, schema: SchemaObject): string {
  let s = base
  if (typeof schema.minLength === 'number') s += `.min(${schema.minLength})`
  if (typeof schema.maxLength === 'number') s += `.max(${schema.maxLength})`
  if (typeof schema.pattern === 'string')
    s += `.regex(new RegExp(${JSON.stringify(schema.pattern)}))`
  return s
}

/** Return full Zod expression for a string schema (base + constraints). */
function stringSchemaExpr(schema: SchemaObject): string {
  const format = schema.format as string | undefined
  const base = stringBase(format)
  return applyStringConstraints(base, schema)
}

/** Chain OpenAPI numeric range constraints and multipleOf onto a Zod number expression. */
function applyNumberConstraints(base: string, schema: SchemaObject): string {
  let s = base
  const min =
    schema.minimum ??
    (typeof schema.exclusiveMinimum === 'number' ? schema.exclusiveMinimum : undefined)
  const max =
    schema.maximum ??
    (typeof schema.exclusiveMaximum === 'number' ? schema.exclusiveMaximum : undefined)
  if (typeof min === 'number') s += `.min(${min})`
  if (typeof max === 'number') s += `.max(${max})`
  if (typeof schema.multipleOf === 'number') s += `.multipleOf(${schema.multipleOf})`
  return s
}

function schemaToZod(schema: SchemaObject | ReferenceObject): string {
  if (isRef(schema)) {
    return refToSchemaName(schema.$ref)
  }

  // const keyword: single fixed value -> z.literal(value)
  // Must be checked before type/enum handling (const overrides type in JSON Schema)
  const constVal = (schema as SchemaObject & { const?: unknown }).const
  if (constVal !== undefined) {
    return `z.literal(${serializeLiteral(constVal)})`
  }

  // OpenAPI 3.1 array type: type: ['string', 'null']
  if (Array.isArray(schema.type)) {
    const types = schema.type as string[]
    const isNullable = types.includes('null')
    const nonNull = types.filter((t) => t !== 'null')
    if (nonNull.length === 1) {
      let base: string
      if (nonNull[0] === 'string') {
        base = stringSchemaExpr(schema)
      } else if (nonNull[0] === 'integer') {
        base = primitiveToZod('integer', schema.format as string | undefined)
        base = applyNumberConstraints(base, schema)
      } else if (nonNull[0] === 'number') {
        base = primitiveToZod('number')
        base = applyNumberConstraints(base, schema)
      } else {
        base = primitiveToZod(nonNull[0]!)
      }
      const expr = isNullable ? `${base}.nullable()` : base
      return applyDefault(expr, schema)
    }
    const parts = types.map((t) => (t === 'null' ? 'z.null()' : primitiveToZod(t)))
    return applyDefault(`z.union([${parts.join(', ')}])`, schema)
  }

  // String enum -> z.enum([...])
  // Use JSON.stringify to produce double-quoted strings, safe for values with apostrophes ("won't fix").
  // Cast null values to string "null" - some specs mix null with string enums (technically invalid OpenAPI
  // but common in practice, e.g. GitHub's dismissed_reason: [null, "false positive", "won't fix"]).
  if (schema.enum !== undefined && schema.enum.length > 0 && schema.type === 'string') {
    const vals = (schema.enum as (string | null)[])
      .map((v) => JSON.stringify(v ?? 'null'))
      .join(', ')
    return applyDefault(`z.enum([${vals}])`, schema)
  }

  // Mixed/number/integer enum -> z.union([z.literal(...), ...])
  // Must quote strings (JSON.stringify), leave numbers/null as-is.
  // Non-primitive values (objects, arrays) cannot be expressed as Zod literals,
  // so they are widened to z.unknown() to avoid emitting invalid syntax like z.literal([object Object]).
  if (schema.enum !== undefined && schema.enum.length > 0) {
    const literals = (schema.enum as unknown[])
      .map((v) => {
        if (typeof v === 'string') return `z.literal(${JSON.stringify(v)})`
        if (v === null) return `z.literal(null)`
        if (typeof v === 'number' || typeof v === 'boolean') return `z.literal(${String(v)})`
        return 'z.unknown()' // object or array enum value - no valid Zod literal representation
      })
      .join(', ')
    return applyDefault(`z.union([${literals}])`, schema)
  }

  // allOf: chain with .and(), merging any sibling properties/required as an extra member
  if (schema.allOf !== undefined && schema.allOf.length > 0) {
    const parts = (schema.allOf as (SchemaObject | ReferenceObject)[]).map(schemaToZod)
    // Sibling properties outside the allOf array must be merged in as an extra intersection member
    const siblingProps = schema.properties as
      | Record<string, SchemaObject | ReferenceObject>
      | undefined
    if (siblingProps !== undefined && Object.keys(siblingProps).length > 0) {
      parts.push(inlineObjectZod(schema))
    }
    if (parts.length === 1) return parts[0]!
    return parts.slice(1).reduce((acc, part) => `${acc}.and(${part})`, parts[0]!)
  }

  // anyOf -> z.union([...])
  if (schema.anyOf !== undefined && schema.anyOf.length > 0) {
    const parts = (schema.anyOf as (SchemaObject | ReferenceObject)[]).map(schemaToZod)
    return `z.union([${parts.join(', ')}])`
  }

  // oneOf -> z.union([...])
  if (schema.oneOf !== undefined && schema.oneOf.length > 0) {
    const parts = (schema.oneOf as (SchemaObject | ReferenceObject)[]).map(schemaToZod)
    return `z.union([${parts.join(', ')}])`
  }

  const type = schema.type as string | undefined

  // Array
  if (type === 'array') {
    const arraySchema = schema as unknown as ArraySchemaObject

    // prefixItems (OpenAPI 3.1 / JSON Schema 2020-12): fixed-position tuple elements
    const prefixItems = (
      schema as SchemaObject & { prefixItems?: (SchemaObject | ReferenceObject)[] }
    ).prefixItems
    if (prefixItems !== undefined && prefixItems.length > 0) {
      const tupleElements = prefixItems.map((item) => schemaToZod(item))
      let base = `z.tuple([${tupleElements.join(', ')}])`
      // items after prefixItems is the rest type in JSON Schema 2020-12
      const restItems = arraySchema.items as SchemaObject | ReferenceObject | undefined
      if (restItems !== undefined) {
        base += `.rest(${schemaToZod(restItems)})`
      }
      return applyDefault(base, schema)
    }

    const items = arraySchema.items as SchemaObject | ReferenceObject | undefined
    let base: string
    if (items !== undefined) {
      base = `z.array(${schemaToZod(items)})`
    } else {
      base = 'z.array(z.unknown())'
    }
    const s = schema as SchemaObject
    if (typeof s.minItems === 'number') base += `.min(${s.minItems})`
    if (typeof s.maxItems === 'number') base += `.max(${s.maxItems})`
    // uniqueItems: refine to enforce distinct values at runtime
    if ((s as SchemaObject & { uniqueItems?: boolean }).uniqueItems === true) {
      base += `.refine((a) => new Set(a).size === a.length, { message: 'Items must be unique' })`
    }
    return applyDefault(base, schema)
  }

  // Object
  if (type === 'object') {
    // additionalProperties only (no explicit properties) -> z.record()
    if (
      schema.additionalProperties !== undefined &&
      schema.additionalProperties !== false &&
      schema.additionalProperties !== true &&
      (schema.properties === undefined || Object.keys(schema.properties).length === 0)
    ) {
      const valZod = schemaToZod(schema.additionalProperties as SchemaObject | ReferenceObject)
      return applyDefault(`z.record(z.string(), ${valZod})`, schema)
    }

    if (schema.properties !== undefined && Object.keys(schema.properties).length > 0) {
      return applyDefault(inlineObjectZod(schema), schema)
    }

    return applyDefault('z.record(z.string(), z.unknown())', schema)
  }

  if (type !== undefined) {
    let base: string
    if (type === 'string') {
      base = stringSchemaExpr(schema)
    } else if (type === 'integer') {
      base = primitiveToZod('integer', schema.format as string | undefined)
      if (base !== 'z.bigint()') {
        base = applyNumberConstraints(base, schema)
      }
    } else if (type === 'number') {
      base = primitiveToZod('number')
      base = applyNumberConstraints(base, schema)
    } else {
      base = primitiveToZod(type)
    }
    return applyDefault(base, schema)
  }

  return 'z.unknown()'
}

/**
 * If the schema has a `default` value, append `.default(value)` to the zod expression.
 * Skips if the expression already ends with a complex refine (for readability).
 */
function applyDefault(expr: string, schema: SchemaObject): string {
  if (schema.default === undefined) return expr
  return `${expr}.default(${serializeLiteral(schema.default)})`
}

function inlineObjectZod(schema: SchemaObject): string {
  const required = new Set<string>(schema.required ?? [])
  const props = schema.properties as Record<string, SchemaObject | ReferenceObject>
  const lines = Object.entries(props).map(([key, propSchema]) => {
    const propKey = toPropertyKey(key)
    const zodStr = schemaToZod(propSchema)
    const suffix = required.has(key) ? '' : '.optional()'
    return `  ${propKey}: ${zodStr}${suffix}`
  })
  // additionalProperties: false means no extra keys are allowed -> use .strict()
  // otherwise use .passthrough() to keep unknown server fields (forward-compatible)
  const tail = schema.additionalProperties === false ? '.strict()' : '.passthrough()'
  return `z.object({\n${lines.join(',\n')}\n})${tail}`
}

/** Collect all #/components/schemas/ ref names reachable from a schema tree. */
function collectRefsInto(schema: SchemaObject | ReferenceObject, out: Set<string>): void {
  if (isRef(schema)) {
    if (schema.$ref.startsWith('#/components/schemas/')) {
      out.add(refToTypeName(schema.$ref))
    }
    return
  }

  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    const list = schema[key] as (SchemaObject | ReferenceObject)[] | undefined
    if (list !== undefined) {
      for (const item of list) collectRefsInto(item, out)
    }
  }

  if (schema.properties !== undefined) {
    for (const propSchema of Object.values(
      schema.properties as Record<string, SchemaObject | ReferenceObject>
    )) {
      collectRefsInto(propSchema, out)
    }
  }

  const items = (schema as unknown as ArraySchemaObject).items
  if (items !== undefined) collectRefsInto(items as SchemaObject | ReferenceObject, out)

  if (
    schema.additionalProperties !== undefined &&
    typeof schema.additionalProperties === 'object'
  ) {
    collectRefsInto(schema.additionalProperties as SchemaObject | ReferenceObject, out)
  }
}

/**
 * Topologically sort schemas so dependencies (referenced schemas) are emitted
 * before the schemas that reference them.
 *
 * Returns { sorted, cyclic } where:
 * - sorted: all schema names in a safe emission order
 * - cyclic: names that are part of a dependency cycle (appended at the end of sorted)
 */
function topoSortSchemas(schemas: Record<string, SchemaObject | ReferenceObject>): {
  sorted: string[]
  cyclic: Set<string>
} {
  const names = Object.keys(schemas)
  const knownNames = new Set(names)

  // deps[A] = set of schema names A depends on (excluding A itself)
  const deps = new Map<string, Set<string>>()
  for (const [name, schema] of Object.entries(schemas)) {
    const refs = new Set<string>()
    collectRefsInto(schema, refs)
    refs.delete(name) // self-references handled separately via z.lazy()
    deps.set(name, new Set([...refs].filter((r) => knownNames.has(r))))
  }

  // Kahn's algorithm:
  // inDegree[A] = number of not-yet-emitted schemas A depends on
  // reverseDeps[B] = schemas that depend on B (decrement their in-degree when B is emitted)
  const inDegree = new Map<string, number>()
  const reverseDeps = new Map<string, Set<string>>()

  for (const name of names) {
    inDegree.set(name, deps.get(name)!.size)
    reverseDeps.set(name, new Set())
  }
  for (const [name, depSet] of deps) {
    for (const dep of depSet) {
      reverseDeps.get(dep)!.add(name)
    }
  }

  const queue = names.filter((n) => inDegree.get(n) === 0)
  const sorted: string[] = []

  while (queue.length > 0) {
    const node = queue.shift()!
    sorted.push(node)
    for (const dependent of reverseDeps.get(node)!) {
      const newDeg = inDegree.get(dependent)! - 1
      inDegree.set(dependent, newDeg)
      if (newDeg === 0) queue.push(dependent)
    }
  }

  const sortedSet = new Set(sorted)
  const cyclic = new Set(names.filter((n) => !sortedSet.has(n)))

  return { sorted: [...sorted, ...cyclic], cyclic }
}

function generateSchemaDeclaration(
  name: string,
  schema: SchemaObject | ReferenceObject,
  inCycle = false
): string {
  // Sanitize schema name to a valid TS identifier (e.g. 'Foo-bar' -> 'FooBar')
  const safeName = toTypeName(name)
  const useLazy = inCycle || (!isRef(schema) && hasSelfRef(schema, safeName))

  if (useLazy) {
    // Wrap in z.lazy() for circular/self-referential schemas.
    // z.lazy() defers evaluation until first use, by which point all
    // schema variables are declared - safe even for mutual cycles.
    const inner = schemaToZod(schema)
    return `export const ${safeName}Schema: z.ZodType = z.lazy(() => ${inner})`
  }

  return `export const ${safeName}Schema = ${schemaToZod(schema)}`
}

export function generateZodSchemas(spec: OpenAPIV3_1.Document): GeneratedFile {
  const schemas = spec.components?.schemas as
    | Record<string, SchemaObject | ReferenceObject>
    | undefined

  const lines: string[] = [
    '// Bootstrapped by @codewithagents/openapi-gen - this file is yours.',
    '// Add error messages, refinements, and business rules freely.',
    '// Re-running the generator will NOT overwrite this file.',
    '// Requires zod v4 (z.record takes two args, z.lazy for circular refs).',
    '//',
    '// Object schemas include .passthrough() so new optional server fields are',
    '// preserved when the API evolves - without breaking existing consumers.',
    '// Schemas with additionalProperties: false use .strict() instead.',
    '//',
    '// Form wizard pattern: extend API schemas for UI-only fields.',
    '// The generated client strips unknown keys before sending, so extra form',
    '// fields (step, confirmCheckbox, etc.) are never leaked to the backend:',
    '//',
    '//   export const CreateOrderFormSchema = CreateOrderSchema.extend({',
    '//     step: z.number(),',
    '//     confirmTerms: z.boolean(),',
    '//   })',
    '//',
    '// Use CreateOrderFormSchema for React Hook Form validation, then pass the',
    '// full form values to the generated client - it strips to API fields only.',
    '',
    "import { z } from 'zod'",
    '',
  ]

  if (schemas !== undefined) {
    // Sanitize schema names so the topo sort and ref-collection use consistent identifiers.
    // Schema names like 'Foo-bar' become 'FooBar' - safe for use as TS variable names.
    const sanitizedSchemas: Record<string, SchemaObject | ReferenceObject> = {}
    for (const [name, schema] of Object.entries(schemas)) {
      sanitizedSchemas[toTypeName(name)] = schema
    }

    const { sorted, cyclic } = topoSortSchemas(sanitizedSchemas)
    for (const name of sorted) {
      const schema = sanitizedSchemas[name]!
      lines.push(generateSchemaDeclaration(name, schema, cyclic.has(name)))
      lines.push('')
    }
  }

  return {
    filename: 'schemas.ts',
    content: lines.join('\n'),
  }
}
