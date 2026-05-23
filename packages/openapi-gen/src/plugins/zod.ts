import type { OpenAPIV3_1 } from 'openapi-types'
import { toPropertyKey } from '../utils/naming.js'
import type { GeneratedFile } from './types.js'

type SchemaObject = OpenAPIV3_1.SchemaObject
type ArraySchemaObject = OpenAPIV3_1.ArraySchemaObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject

function isRef(schema: SchemaObject | ReferenceObject): schema is ReferenceObject {
  return '$ref' in schema
}

function refToSchemaName(ref: string): string {
  const parts = ref.split('/')
  return `${parts[parts.length - 1]!}Schema`
}

function refToTypeName(ref: string): string {
  const parts = ref.split('/')
  return parts[parts.length - 1]!
}

/** Check whether a schema tree contains a $ref to the given schema name (self-reference). */
function hasSelfRef(schema: SchemaObject | ReferenceObject, name: string, visited = new Set<SchemaObject | ReferenceObject>()): boolean {
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
    for (const propSchema of Object.values(s.properties as Record<string, SchemaObject | ReferenceObject>)) {
      if (hasSelfRef(propSchema, name, visited)) return true
    }
  }

  const items = (s as unknown as ArraySchemaObject).items
  if (items !== undefined) {
    if (hasSelfRef(items as SchemaObject | ReferenceObject, name, visited)) return true
  }

  if (s.additionalProperties !== undefined && typeof s.additionalProperties === 'object') {
    if (hasSelfRef(s.additionalProperties as SchemaObject | ReferenceObject, name, visited)) return true
  }

  return false
}

function primitiveToZod(type: string): string {
  switch (type) {
    case 'string':
      return 'z.string()'
    case 'number':
    case 'integer':
      return 'z.number()'
    case 'boolean':
      return 'z.boolean()'
    case 'null':
      return 'z.null()'
    default:
      return 'z.unknown()'
  }
}

/** Chain OpenAPI string constraints onto a base Zod string expression. */
function applyStringConstraints(base: string, schema: SchemaObject): string {
  let s = base
  if (typeof schema.minLength === 'number') s += `.min(${schema.minLength})`
  if (typeof schema.maxLength === 'number') s += `.max(${schema.maxLength})`
  if (typeof schema.pattern === 'string') s += `.regex(new RegExp(${JSON.stringify(schema.pattern)}))`
  const format = schema.format as string | undefined
  if (format === 'email') s += '.email()'
  else if (format === 'url') s += '.url()'
  else if (format === 'uuid') s += '.uuid()'
  return s
}

/** Chain OpenAPI numeric range constraints onto a base Zod number expression. */
function applyNumberConstraints(base: string, schema: SchemaObject): string {
  let s = base
  const min = schema.minimum ?? (typeof schema.exclusiveMinimum === 'number' ? schema.exclusiveMinimum : undefined)
  const max = schema.maximum ?? (typeof schema.exclusiveMaximum === 'number' ? schema.exclusiveMaximum : undefined)
  if (typeof min === 'number') s += `.min(${min})`
  if (typeof max === 'number') s += `.max(${max})`
  return s
}

function schemaToZod(schema: SchemaObject | ReferenceObject): string {
  if (isRef(schema)) {
    return refToSchemaName(schema.$ref)
  }

  // OpenAPI 3.1 array type: type: ['string', 'null']
  if (Array.isArray(schema.type)) {
    const types = schema.type as string[]
    const isNullable = types.includes('null')
    const nonNull = types.filter((t) => t !== 'null')
    if (nonNull.length === 1) {
      let base = primitiveToZod(nonNull[0]!)
      if (nonNull[0] === 'string') base = applyStringConstraints(base, schema)
      else if (nonNull[0] === 'number' || nonNull[0] === 'integer') base = applyNumberConstraints(base, schema)
      return isNullable ? `${base}.nullable()` : base
    }
    const parts = types.map((t) => (t === 'null' ? 'z.null()' : primitiveToZod(t)))
    return `z.union([${parts.join(', ')}])`
  }

  // String enum → z.enum([...])
  if (schema.enum !== undefined && schema.enum.length > 0 && schema.type === 'string') {
    const vals = (schema.enum as string[]).map((v) => `'${v}'`).join(', ')
    return `z.enum([${vals}])`
  }

  // Number/integer enum → z.union([z.literal(...), ...])
  if (schema.enum !== undefined && schema.enum.length > 0) {
    const literals = (schema.enum as unknown[]).map((v) => `z.literal(${String(v)})`).join(', ')
    return `z.union([${literals}])`
  }

  // allOf → chain with .and()
  if (schema.allOf !== undefined && schema.allOf.length > 0) {
    const parts = (schema.allOf as (SchemaObject | ReferenceObject)[]).map(schemaToZod)
    if (parts.length === 1) return parts[0]!
    return parts.slice(1).reduce((acc, part) => `${acc}.and(${part})`, parts[0]!)
  }

  // anyOf → z.union([...])
  if (schema.anyOf !== undefined && schema.anyOf.length > 0) {
    const parts = (schema.anyOf as (SchemaObject | ReferenceObject)[]).map(schemaToZod)
    return `z.union([${parts.join(', ')}])`
  }

  // oneOf → z.union([...])
  if (schema.oneOf !== undefined && schema.oneOf.length > 0) {
    const parts = (schema.oneOf as (SchemaObject | ReferenceObject)[]).map(schemaToZod)
    return `z.union([${parts.join(', ')}])`
  }

  const type = schema.type as string | undefined

  // Array
  if (type === 'array') {
    const arraySchema = schema as unknown as ArraySchemaObject
    const items = arraySchema.items as SchemaObject | ReferenceObject | undefined
    if (items !== undefined) {
      return `z.array(${schemaToZod(items)})`
    }
    return 'z.array(z.unknown())'
  }

  // Object
  if (type === 'object') {
    // additionalProperties only → z.record()
    if (
      schema.additionalProperties !== undefined &&
      schema.additionalProperties !== false &&
      schema.additionalProperties !== true &&
      (schema.properties === undefined || Object.keys(schema.properties).length === 0)
    ) {
      const valZod = schemaToZod(schema.additionalProperties as SchemaObject | ReferenceObject)
      return `z.record(z.string(), ${valZod})`
    }

    if (schema.properties !== undefined && Object.keys(schema.properties).length > 0) {
      return inlineObjectZod(schema)
    }

    return 'z.record(z.string(), z.unknown())'
  }

  if (type !== undefined) {
    const base = primitiveToZod(type)
    if (type === 'string') return applyStringConstraints(base, schema)
    if (type === 'number' || type === 'integer') return applyNumberConstraints(base, schema)
    return base
  }

  return 'z.unknown()'
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
  return `z.object({\n${lines.join(',\n')}\n})`
}

function generateSchemaDeclaration(name: string, schema: SchemaObject | ReferenceObject): string {
  const circular = !isRef(schema) && hasSelfRef(schema, name)

  if (circular) {
    // Wrap in z.lazy() for circular/self-referential schemas
    const inner = schemaToZod(schema)
    return `export const ${name}Schema: z.ZodType = z.lazy(() => ${inner})`
  }

  return `export const ${name}Schema = ${schemaToZod(schema)}`
}

export function generateZodSchemas(spec: OpenAPIV3_1.Document): GeneratedFile {
  const schemas = spec.components?.schemas as
    | Record<string, SchemaObject | ReferenceObject>
    | undefined

  const lines: string[] = [
    '// Bootstrapped by @codewithagents/openapi-gen — this file is yours.',
    '// Add error messages, refinements, and business rules freely.',
    '// Re-running the generator will NOT overwrite this file.',
    '// Requires zod v4 (z.record takes two args, z.lazy for circular refs).',
    '',
    "import { z } from 'zod'",
    '',
  ]

  if (schemas !== undefined) {
    for (const [name, schema] of Object.entries(schemas)) {
      lines.push(generateSchemaDeclaration(name, schema))
      lines.push('')
    }
  }

  return {
    filename: 'schemas.ts',
    content: lines.join('\n'),
  }
}
