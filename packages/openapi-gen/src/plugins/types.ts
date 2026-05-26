import type { OpenAPIV3_1 } from 'openapi-types'
import { toPropertyKey } from '../utils/naming.js'

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

function refToTypeName(ref: string): string {
  // '#/components/schemas/Foo' -> 'Foo'
  const parts = ref.split('/')
  return parts[parts.length - 1]!
}

/** Feature 3: Return an inline comment for date/date-time formats, or '' for others. */
function formatComment(schema: SchemaObject): string {
  if (schema.type !== 'string') return ''
  const fmt = schema.format as string | undefined
  if (fmt === 'date-time') return ' /* date-time */'
  if (fmt === 'date') return ' /* date */'
  return ''
}

function schemaToTypeString(schema: SchemaObject | ReferenceObject): string {
  if (isRef(schema)) {
    return refToTypeName(schema.$ref)
  }

  // Handle nullable via OpenAPI 3.1 array type: type: ['string', 'null']
  if (Array.isArray(schema.type)) {
    const types = (schema.type as string[]).map((t) => {
      if (t === 'null') return 'null'
      return primitiveToTs(t)
    })
    return types.join(' | ')
  }

  // enum — handles string, integer, number, mixed (null values rendered as "null" literal)
  if (schema.enum !== undefined && schema.enum.length > 0) {
    return schema.enum
      .map((v: unknown) => {
        if (v === null) return 'null'
        if (typeof v === 'string') return `'${v}'`
        return String(v)
      })
      .join(' | ')
  }

  // allOf
  if (schema.allOf !== undefined && schema.allOf.length > 0) {
    return (schema.allOf as (SchemaObject | ReferenceObject)[])
      .map(schemaToTypeString)
      .join(' & ')
  }

  // anyOf
  if (schema.anyOf !== undefined && schema.anyOf.length > 0) {
    return (schema.anyOf as (SchemaObject | ReferenceObject)[])
      .map(schemaToTypeString)
      .join(' | ')
  }

  // oneOf
  if (schema.oneOf !== undefined && schema.oneOf.length > 0) {
    return (schema.oneOf as (SchemaObject | ReferenceObject)[])
      .map(schemaToTypeString)
      .join(' | ')
  }

  const type = schema.type as string | undefined

  // array
  if (type === 'array') {
    const arraySchema = schema as ArraySchemaObject
    const items = arraySchema.items as SchemaObject | ReferenceObject | undefined
    if (items !== undefined) {
      return `${schemaToTypeString(items)}[]`
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
      const valType = schemaToTypeString(schema.additionalProperties as SchemaObject | ReferenceObject)
      return `Record<string, ${valType}>`
    }
    // inline object with properties
    if (schema.properties !== undefined) {
      return inlineObjectType(schema)
    }
    return 'Record<string, unknown>'
  }

  if (type !== undefined) {
    return primitiveToTs(type)
  }

  return 'unknown'
}

function primitiveToTs(type: string): string {
  switch (type) {
    case 'string':
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'null':
      return 'null'
    default:
      return 'unknown'
  }
}

function inlineObjectType(schema: SchemaObject): string {
  const required = new Set<string>(schema.required ?? [])
  const props = schema.properties as Record<string, SchemaObject | ReferenceObject> | undefined
  if (props === undefined || Object.keys(props).length === 0) {
    return 'Record<string, unknown>'
  }
  const lines = Object.entries(props).map(([key, propSchema]) => {
    const optional = !required.has(key)
    const propKey = toPropertyKey(key)
    const typStr = schemaToTypeString(propSchema)
    // Feature 3: add inline format comment for date/date-time string properties
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
  // Has allOf/anyOf/oneOf - treated as type alias
  if (schema.allOf !== undefined || schema.anyOf !== undefined || schema.oneOf !== undefined) {
    return false
  }
  return schema.type === 'object' || schema.properties !== undefined
}

/** Feature 5: derive the discriminator literal value for a variant ref */
function discriminatorLiteralFor(
  ref: string,
  mapping: Record<string, string> | undefined,
): string {
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

function generateSchemaDeclaration(name: string, schema: SchemaObject | ReferenceObject, options?: TypesOptions): string {
  if (isRef(schema)) {
    return `export type ${name} = ${refToTypeName(schema.$ref)}`
  }

  // Schema-enhanced mode: for object schemas with a matching Zod schema, use z.infer
  if (
    options?.schemaNames !== undefined &&
    options.schemaNames.has(`${name}Schema`) &&
    isObjectSchema(schema)
  ) {
    return `export type ${name} = z.infer<typeof ${name}Schema>`
  }

  if (isEnumSchema(schema)) {
    const union = schema.enum!
      .map((v: unknown) => {
        if (v === null) return 'null'
        if (typeof v === 'string') return `'${v}'`
        return String(v)
      })
      .join(' | ')
    const typeDecl = `export type ${name} = ${union}`
    // Emit a values array for pure string and pure numeric enums so consumers can
    // iterate valid values (e.g. to populate a <select>) without hardcoding them.
    // Mixed enums (string + number, or containing null) intentionally get no array.
    if (isStringEnum(schema)) {
      const arr = (schema.enum as string[]).map(v => `'${v}'`).join(', ')
      return `${typeDecl}\nexport const ${name}Values = [${arr}] as const`
    }
    if (isNumericEnum(schema)) {
      const arr = (schema.enum as number[]).join(', ')
      return `${typeDecl}\nexport const ${name}Values = [${arr}] as const`
    }
    return typeDecl
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
      const valType = schemaToTypeString(schema.additionalProperties as SchemaObject | ReferenceObject)
      return `export type ${name} = Record<string, ${valType}>`
    }

    const propLines: string[] = []
    if (props !== undefined) {
      for (const [key, propSchema] of Object.entries(props)) {
        const optional = !required.has(key)
        const propKey = toPropertyKey(key)
        const typStr = schemaToTypeString(propSchema)
        // Feature 3: add inline format comment for date/date-time string properties
        const comment = isRef(propSchema) ? '' : formatComment(propSchema as SchemaObject)
        propLines.push(`  ${propKey}${optional ? '?' : ''}: ${typStr}${comment}`)
      }
    }
    if (propLines.length === 0) {
      return `export type ${name} = Record<string, unknown>`
    }
    return `export interface ${name} {\n${propLines.join('\n')}\n}`
  }

  // Feature 5: discriminated union via oneOf/anyOf + discriminator
  const discriminator = (schema as SchemaObject & { discriminator?: { propertyName: string; mapping?: Record<string, string> } }).discriminator
  const compositeVariants = schema.oneOf ?? schema.anyOf
  if (
    discriminator !== undefined &&
    compositeVariants !== undefined &&
    compositeVariants.length > 0
  ) {
    const { propertyName, mapping } = discriminator
    const variants = (compositeVariants as (SchemaObject | ReferenceObject)[])
      .map((variant) => {
        if (!isRef(variant)) {
          // Inline schema in discriminated union — emit as plain variant
          return schemaToTypeString(variant)
        }
        const ref = (variant as ReferenceObject).$ref
        const typeName = refToTypeName(ref)
        const literalValue = discriminatorLiteralFor(ref, mapping)
        return `(${typeName} & { ${propertyName}: '${literalValue}' })`
      })
    const lines = variants.map((v, i) => (i === 0 ? `  | ${v}` : `  | ${v}`))
    return `export type ${name} =\n${lines.join('\n')}`
  }

  // allOf / anyOf / oneOf or other -> type alias
  const typeStr = schemaToTypeString(schema)
  return `export type ${name} = ${typeStr}`
}

export function generateTypes(spec: OpenAPIV3_1.Document, options?: TypesOptions): GeneratedFile {
  const schemas = spec.components?.schemas as
    | Record<string, SchemaObject | ReferenceObject>
    | undefined

  const lines: string[] = []

  if (options?.schemaNames !== undefined && options.schemaImportPath !== undefined) {
    // Schema-enhanced mode: build header with Zod imports
    const importedSchemas: string[] = []
    for (const name of Object.keys(schemas ?? {})) {
      if (options.schemaNames.has(`${name}Schema`)) {
        importedSchemas.push(`${name}Schema`)
      }
    }

    lines.push('// This file is auto-generated by @codewithagents/openapi-gen — do not edit')
    lines.push("import type { z } from 'zod'")
    lines.push(`import type { ${importedSchemas.join(', ')} } from '${options.schemaImportPath}'`)
    lines.push('')
  } else {
    lines.push('// This file is auto-generated by @codewithagents/openapi-gen — do not edit')
    lines.push('')
  }

  if (schemas !== undefined) {
    for (const [name, schema] of Object.entries(schemas)) {
      lines.push(generateSchemaDeclaration(name, schema, options))
      lines.push('')
    }
  }

  return {
    filename: 'models.ts',
    content: lines.join('\n'),
  }
}
