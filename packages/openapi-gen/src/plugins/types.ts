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

  // enum
  if (schema.enum !== undefined && schema.enum.length > 0) {
    return schema.enum
      .map((v: unknown) => (typeof v === 'string' ? `'${v}'` : String(v)))
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
    return `  ${propKey}${optional ? '?' : ''}: ${typStr}`
  })
  return `{\n${lines.join('\n')}\n}`
}

function isEnumSchema(schema: SchemaObject): boolean {
  return schema.enum !== undefined && schema.enum.length > 0 && schema.type === 'string'
}

function isObjectSchema(schema: SchemaObject): boolean {
  // Has allOf/anyOf/oneOf - treated as type alias
  if (schema.allOf !== undefined || schema.anyOf !== undefined || schema.oneOf !== undefined) {
    return false
  }
  return schema.type === 'object' || schema.properties !== undefined
}

function generateSchemaDeclaration(name: string, schema: SchemaObject | ReferenceObject): string {
  if (isRef(schema)) {
    return `export type ${name} = ${refToTypeName(schema.$ref)}`
  }

  if (isEnumSchema(schema)) {
    const union = schema.enum!
      .map((v: unknown) => (typeof v === 'string' ? `'${v}'` : String(v)))
      .join(' | ')
    return `export type ${name} = ${union}`
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
        propLines.push(`  ${propKey}${optional ? '?' : ''}: ${typStr}`)
      }
    }
    return `export interface ${name} {\n${propLines.join('\n')}\n}`
  }

  // allOf / anyOf / oneOf or other -> type alias
  const typeStr = schemaToTypeString(schema)
  return `export type ${name} = ${typeStr}`
}

export function generateTypes(spec: OpenAPIV3_1.Document): GeneratedFile {
  const schemas = spec.components?.schemas as
    | Record<string, SchemaObject | ReferenceObject>
    | undefined

  const lines: string[] = [
    '// This file is auto-generated by @codewithagents/openapi-client — do not edit',
    '',
  ]

  if (schemas !== undefined) {
    for (const [name, schema] of Object.entries(schemas)) {
      lines.push(generateSchemaDeclaration(name, schema))
      lines.push('')
    }
  }

  return {
    filename: 'models.ts',
    content: lines.join('\n'),
  }
}
