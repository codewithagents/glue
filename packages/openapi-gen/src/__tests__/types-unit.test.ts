import { describe, it, expect, beforeAll } from 'vitest'
import { generateTypes } from '../plugins/types.js'
import type { OpenAPIV3_1 } from 'openapi-types'
import { parseSpec } from '../parser.js'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const advancedTypesFixture = join(__dirname, '../__fixtures__/specs/advanced-types.json')

// Helper: build a minimal spec with one schema and get the generated output
function genSingle(name: string, schema: OpenAPIV3_1.SchemaObject): string {
  const spec: OpenAPIV3_1.Document = {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: { schemas: { [name]: schema } },
  }
  return generateTypes(spec).content
}

describe('primitive types', () => {
  it('string → string', () => {
    expect(genSingle('A', { type: 'object', required: ['f'], properties: { f: { type: 'string' } } }))
      .toContain('f: string')
  })
  it('number → number', () => {
    expect(genSingle('A', { type: 'object', required: ['f'], properties: { f: { type: 'number' } } }))
      .toContain('f: number')
  })
  it('integer → number', () => {
    expect(genSingle('A', { type: 'object', required: ['f'], properties: { f: { type: 'integer' } } }))
      .toContain('f: number')
  })
  it('boolean → boolean', () => {
    expect(genSingle('A', { type: 'object', required: ['f'], properties: { f: { type: 'boolean' } } }))
      .toContain('f: boolean')
  })
})

describe('nullable types (OpenAPI 3.1 array syntax)', () => {
  it('["string","null"] → string | null', () => {
    expect(genSingle('A', { type: 'object', properties: { f: { type: ['string', 'null'] } } }))
      .toContain('string | null')
  })
  it('["number","null"] → number | null', () => {
    expect(genSingle('A', { type: 'object', properties: { f: { type: ['number', 'null'] } } }))
      .toContain('number | null')
  })
  it('["string","number"] → string | number', () => {
    expect(genSingle('A', { type: 'object', properties: { f: { type: ['string', 'number'] } } }))
      .toContain('string | number')
  })
})

describe('enum types', () => {
  it('string enum → string literal union type alias + values array', () => {
    const out = genSingle('Status', { type: 'string', enum: ['active', 'inactive'] })
    expect(out).toContain(`export type Status = "active" | "inactive"`)
    expect(out).toContain("export const StatusValues = ['active', 'inactive'] as const")
  })
  it('integer enum → number union type alias + values array', () => {
    const out = genSingle('Priority', { type: 'integer', enum: [1, 2, 3] })
    expect(out).toContain('export type Priority = 1 | 2 | 3')
    expect(out).toContain('export const PriorityValues = [1, 2, 3] as const')
  })
  it('number (float) enum → number literal union type alias + values array', () => {
    const out = genSingle('Score', { type: 'number', enum: [0.5, 1.0, 1.5] })
    expect(out).toContain('export type Score = 0.5 | 1 | 1.5')
    expect(out).toContain('export const ScoreValues = [0.5, 1, 1.5] as const')
  })
  it('mixed enum (string + number + null) → union only, no values array', () => {
    // @ts-expect-error — null in enum is valid OpenAPI 3.1, type definitions lag
    const out = genSingle('Mixed', { enum: ['active', 0, null] })
    expect(out).toContain(`export type Mixed = "active" | 0 | null`)
    expect(out).not.toContain('MixedValues')  // mixed enums don't get a values array
  })
  it('enum on object property → inline union', () => {
    const out = genSingle('A', {
      type: 'object',
      required: ['status'],
      properties: { status: { type: 'string', enum: ['a', 'b'] } },
    })
    expect(out).toContain(`status: "a" | "b"`)
  })
})

describe('array types', () => {
  it('array of string → string[]', () => {
    expect(genSingle('A', { type: 'object', properties: { f: { type: 'array', items: { type: 'string' } } } }))
      .toContain('string[]')
  })
  it('array with no items → unknown[]', () => {
    expect(genSingle('A', { type: 'object', properties: { f: { type: 'array' } } }))
      .toContain('unknown[]')
  })
  it('array of $ref → TypeName[]', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {},
      components: {
        schemas: {
          Tag: { type: 'object', properties: { id: { type: 'string' } } },
          A: { type: 'object', properties: { tags: { type: 'array', items: { $ref: '#/components/schemas/Tag' } } } },
        },
      },
    }
    expect(generateTypes(spec).content).toContain('Tag[]')
  })
})

describe('object types', () => {
  it('required fields have no ? modifier', () => {
    const out = genSingle('A', { type: 'object', required: ['id'], properties: { id: { type: 'string' }, name: { type: 'string' } } })
    expect(out).toContain('id: string')
    expect(out).toContain('name?: string')
  })
  it('additionalProperties only → Record<string, T>', () => {
    const out = genSingle('M', { type: 'object', additionalProperties: { type: 'string' } })
    expect(out).toContain('Record<string, string>')
  })
  it('empty object → Record<string, unknown>', () => {
    const out = genSingle('E', { type: 'object' })
    expect(out).toContain('Record<string, unknown>')
  })
})

describe('composition types', () => {
  it('allOf → intersection with &', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {},
      components: { schemas: {
        A: { type: 'object', properties: { a: { type: 'string' } } },
        B: { type: 'object', properties: { b: { type: 'string' } } },
        C: { allOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }] },
      }},
    }
    expect(generateTypes(spec).content).toContain('A & B')
  })
  it('anyOf → union with |', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {},
      components: { schemas: {
        A: { type: 'object', properties: { a: { type: 'string' } } },
        B: { type: 'object', properties: { b: { type: 'string' } } },
        C: { anyOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }] },
      }},
    }
    expect(generateTypes(spec).content).toContain('A | B')
  })
  it('oneOf → union with |', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {},
      components: { schemas: {
        A: { type: 'object', properties: { a: { type: 'string' } } },
        B: { type: 'object', properties: { b: { type: 'string' } } },
        C: { oneOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }] },
      }},
    }
    expect(generateTypes(spec).content).toContain('A | B')
  })
})

describe('$ref handling', () => {
  it('$ref on required property → TypeName (no ?)', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {},
      components: { schemas: {
        Status: { type: 'string', enum: ['a', 'b'] },
        Task: { type: 'object', required: ['status'], properties: { status: { $ref: '#/components/schemas/Status' } } },
      }},
    }
    expect(generateTypes(spec).content).toContain('status: Status')
  })
  it('$ref on optional property → TypeName?', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {},
      components: { schemas: {
        Status: { type: 'string', enum: ['a', 'b'] },
        Task: { type: 'object', properties: { status: { $ref: '#/components/schemas/Status' } } },
      }},
    }
    expect(generateTypes(spec).content).toContain('status?: Status')
  })
})

describe('special property names', () => {
  it('property with hyphen is quoted', () => {
    const out = genSingle('A', { type: 'object', properties: { 'Content-Type': { type: 'string' } } })
    expect(out).toMatch(/'Content-Type'/)
  })
  it('normal camelCase property is not quoted', () => {
    const out = genSingle('A', { type: 'object', properties: { createdAt: { type: 'string' } } })
    expect(out).toContain('createdAt')
    expect(out).not.toMatch(/'createdAt'/)
  })
})

describe('self-referential schemas', () => {
  it('handles circular $ref without infinite loop', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {},
      components: { schemas: {
        TreeNode: {
          type: 'object',
          properties: {
            value: { type: 'string' },
            children: { type: 'array', items: { $ref: '#/components/schemas/TreeNode' } },
          },
        },
      }},
    }
    // Should not throw, should contain TreeNode
    const out = generateTypes(spec).content
    expect(out).toContain('TreeNode')
    expect(out).toContain('TreeNode[]')
  })
})

describe('uncovered branches', () => {
  it('schema with no type and no composition → unknown', () => {
    // Covers: schemaToTypeString fallback `return 'unknown'` (no type, no enum, no allOf/anyOf/oneOf)
    const out = genSingle('A', { type: 'object', required: ['f'], properties: { f: {} } })
    expect(out).toContain('f: unknown')
  })

  it('object property with unknown primitive type → unknown', () => {
    // Covers: primitiveToTs default branch
    const out = genSingle('A', {
      type: 'object',
      required: ['f'],
      // @ts-expect-error — intentionally invalid type to hit default branch
      properties: { f: { type: 'custom-unknown-type' } },
    })
    expect(out).toContain('f: unknown')
  })

  it('top-level $ref schema → type alias', () => {
    // Covers: generateSchemaDeclaration isRef branch (line 148)
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {},
      components: {
        schemas: {
          Original: { type: 'object', properties: { id: { type: 'string' } } },
          Alias: { $ref: '#/components/schemas/Original' },
        },
      },
    }
    const out = generateTypes(spec).content
    expect(out).toContain('export type Alias = Original')
  })

  it('inline object with no properties → Record<string, unknown>', () => {
    // Covers: inlineObjectType early return when props is empty
    const out = genSingle('A', {
      type: 'object',
      required: ['f'],
      properties: { f: { type: 'object', properties: {} } },
    })
    expect(out).toContain('Record<string, unknown>')
  })
})

describe('output file', () => {
  it('always starts with the auto-generated header', () => {
    const out = genSingle('A', { type: 'object' })
    expect(out.startsWith('// This file is auto-generated by @codewithagents/openapi-gen')).toBe(true)
  })
  it('returns filename as models.ts', () => {
    const spec: OpenAPIV3_1.Document = { openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {} }
    expect(generateTypes(spec).filename).toBe('models.ts')
  })
  it('handles empty components gracefully', () => {
    const spec: OpenAPIV3_1.Document = { openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {} }
    expect(() => generateTypes(spec)).not.toThrow()
  })
  it('handles spec with no components at all', () => {
    const spec = { openapi: '3.1.0', info: { title: 'T', version: '1' }, paths: {} } as OpenAPIV3_1.Document
    expect(() => generateTypes(spec)).not.toThrow()
  })
})

describe('coverage: schemaToTypeString numeric enum inline (line 52)', () => {
  it('numeric enum as object property → inline number literal union', () => {
    // Covers schemaToTypeString enum branch for non-string values: return String(v)
    // When { type: 'integer', enum: [1, 2, 3] } is used as a property type, schemaToTypeString
    // is called (not generateSchemaDeclaration) so the String(v) path is exercised inline.
    const out = genSingle('A', {
      type: 'object',
      properties: {
        priority: { type: 'integer', enum: [1, 2, 3] },
      },
    })
    expect(out).toContain('priority?: 1 | 2 | 3')
  })
})

describe('coverage: schemaToTypeString object no-properties fallback (line 106)', () => {
  it('inline object property with no properties key → Record<string, unknown>', () => {
    // Covers schemaToTypeString: type === 'object', no additionalProperties, no properties key
    // → returns 'Record<string, unknown>' at the fallback line
    const out = genSingle('A', {
      type: 'object',
      properties: {
        meta: { type: 'object' },  // no 'properties' key → schemaToTypeString fallback
      },
    })
    expect(out).toContain('meta?: Record<string, unknown>')
  })
})

describe('coverage: isEnumSchema returns false for array type with enum (line 155)', () => {
  it('array schema with enum values → isEnumSchema returns false, falls through to type alias', () => {
    // isEnumSchema: type is 'array' (not string/integer/number/undefined) → returns false
    // generateSchemaDeclaration then falls through to schemaToTypeString which renders the enum branch
    // @ts-expect-error — enum on array is unusual but valid to test the isEnumSchema branch
    const out = genSingle('Flags', { type: 'array', enum: ['x', 'y'] })
    // schemaToTypeString renders the enum values since it checks enum before array
    expect(out).toContain(`export type Flags = "x" | "y"`)
  })
})

describe('coverage: discriminated union with explicit mapping (lines 171-181, 240-253)', () => {
  let content: string

  beforeAll(async () => {
    const spec = await parseSpec(advancedTypesFixture)
    content = generateTypes(spec).content
  })

  it('generates Shape as discriminated union with mapping-derived literals', () => {
    // Shape has oneOf + discriminator.mapping — exercises discriminatorLiteralFor with mapping
    // and the discriminated union generation block in generateSchemaDeclaration
    expect(content).toContain('export type Shape =')
    expect(content).toContain("Circle & { kind: 'circle' }")
    expect(content).toContain("Rectangle & { kind: 'rectangle' }")
    expect(content).toContain("Triangle & { kind: 'triangle' }")
  })

  it('generates Animal as discriminated union without mapping (lowercase fallback)', () => {
    // Animal has anyOf + discriminator without mapping — exercises the fallback path
    expect(content).toContain('export type Animal =')
    // Fallback: type name lowercased first char
    expect(content).toContain("Circle & { type: 'circle' }")
    expect(content).toContain("Rectangle & { type: 'rectangle' }")
  })
})

describe('coverage: discriminated union with inline (non-$ref) variants', () => {
  it('inline variant schemas are emitted via schemaToTypeString fallback', () => {
    // Covers the !isRef(variant) branch in generateSchemaDeclaration (types.ts ~line 284)
    // When oneOf variants are inline objects rather than $refs, schemaToTypeString is called directly
    const out = genSingle('Shape', {
      oneOf: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { type: 'object', properties: { kind: { type: 'string' }, radius: { type: 'number' } } } as any,
        { type: 'object', properties: { kind: { type: 'string' }, side: { type: 'number' } } } as any,
      ],
      discriminator: { propertyName: 'kind' },
    } as any)
    // The inline variants are rendered as inline object type strings (not NamedType & { discriminator } literals)
    expect(out).toContain('export type Shape =')
    // Inline objects with properties produce `{ prop?: type }` shapes, not $ref-style intersections
    expect(out).toContain('kind')
  })
})

describe('coverage: generateTypes schema-enhanced mode with no schemas (types.ts line 310)', () => {
  it('spec with no components.schemas in schema-enhanced mode: schemas ?? {} fallback taken', () => {
    // generateTypes with schemaNames option on a spec that has no components.schemas
    // exercises the `schemas ?? {}` fallback at line 310
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {},
      // no components.schemas
    }
    expect(() => generateTypes(spec, {
      schemaNames: new Set(['FooSchema']),
      schemaImportPath: './schemas.js',
    })).not.toThrow()
    const out = generateTypes(spec, {
      schemaNames: new Set(['FooSchema']),
      schemaImportPath: './schemas.js',
    }).content
    // No schemas to import, but the file header is still emitted
    expect(out).toContain('// This file is auto-generated by @codewithagents/openapi-gen')
  })
})
