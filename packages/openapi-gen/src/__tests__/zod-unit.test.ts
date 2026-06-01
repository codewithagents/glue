import { describe, it, expect } from 'vitest'
import { generateZodSchemas } from '../plugins/zod.js'
import type { OpenAPIV3_1 } from 'openapi-types'

function gen(
  schemas: Record<string, OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject>
): string {
  const spec: OpenAPIV3_1.Document = {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: { schemas },
  }
  return generateZodSchemas(spec).content
}

function genSingle(
  name: string,
  schema: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject
): string {
  return gen({ [name]: schema })
}

describe('output file', () => {
  it('returns filename schemas.ts', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {},
    }
    expect(generateZodSchemas(spec).filename).toBe('schemas.ts')
  })

  it('starts with the bootstrap header', () => {
    const out = genSingle('A', { type: 'object' })
    expect(out).toContain('Bootstrapped by @codewithagents/openapi-gen')
    expect(out).toContain('will NOT overwrite')
  })

  it('imports z from zod', () => {
    const out = genSingle('A', { type: 'object' })
    expect(out).toContain("import { z } from 'zod'")
  })

  it('handles spec with no components gracefully', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {},
    }
    expect(() => generateZodSchemas(spec)).not.toThrow()
  })
})

describe('primitive types', () => {
  it('string → z.string()', () => {
    expect(
      genSingle('A', { type: 'object', required: ['f'], properties: { f: { type: 'string' } } })
    ).toContain('z.string()')
  })

  it('number → z.number()', () => {
    expect(
      genSingle('A', { type: 'object', required: ['f'], properties: { f: { type: 'number' } } })
    ).toContain('z.number()')
  })

  it('integer → z.number()', () => {
    expect(
      genSingle('A', { type: 'object', required: ['f'], properties: { f: { type: 'integer' } } })
    ).toContain('z.number()')
  })

  it('boolean → z.boolean()', () => {
    expect(
      genSingle('A', { type: 'object', required: ['f'], properties: { f: { type: 'boolean' } } })
    ).toContain('z.boolean()')
  })

  it('unknown type → z.unknown()', () => {
    expect(
      genSingle('A', {
        type: 'object',
        required: ['f'],
        // @ts-expect-error intentionally invalid type
        properties: { f: { type: 'custom-type' } },
      })
    ).toContain('z.unknown()')
  })
})

describe('nullable types (OpenAPI 3.1 array syntax)', () => {
  it('["string","null"] → z.string().nullable()', () => {
    expect(
      genSingle('A', { type: 'object', properties: { f: { type: ['string', 'null'] } } })
    ).toContain('z.string().nullable()')
  })

  it('["number","null"] → z.number().nullable()', () => {
    expect(
      genSingle('A', { type: 'object', properties: { f: { type: ['number', 'null'] } } })
    ).toContain('z.number().nullable()')
  })

  it('["string","number"] → z.union([z.string(), z.number()])', () => {
    expect(
      genSingle('A', { type: 'object', properties: { f: { type: ['string', 'number'] } } })
    ).toContain('z.union([z.string(), z.number()])')
  })
})

describe('optional fields', () => {
  it('required field has no .optional()', () => {
    const out = genSingle('A', {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string' } },
    })
    expect(out).toContain('id: z.string()')
    expect(out).not.toContain('id: z.string().optional()')
  })

  it('optional field has .optional()', () => {
    const out = genSingle('A', { type: 'object', properties: { name: { type: 'string' } } })
    expect(out).toContain('name: z.string().optional()')
  })
})

describe('enum types', () => {
  it('string enum → z.enum([...])', () => {
    const out = genSingle('Status', { type: 'string', enum: ['active', 'inactive'] })
    expect(out).toContain(`z.enum(["active", "inactive"])`)
  })

  it('integer enum → z.union([z.literal(...), ...])', () => {
    const out = genSingle('Priority', { type: 'integer', enum: [1, 2, 3] })
    expect(out).toContain('z.union([z.literal(1), z.literal(2), z.literal(3)])')
  })
})

describe('array types', () => {
  it('array of string → z.array(z.string())', () => {
    expect(
      genSingle('A', {
        type: 'object',
        properties: { f: { type: 'array', items: { type: 'string' } } },
      })
    ).toContain('z.array(z.string())')
  })

  it('array with no items → z.array(z.unknown())', () => {
    expect(genSingle('A', { type: 'object', properties: { f: { type: 'array' } } })).toContain(
      'z.array(z.unknown())'
    )
  })

  it('array of $ref → z.array(TagSchema)', () => {
    const out = gen({
      Tag: { type: 'object', properties: { id: { type: 'string' } } },
      A: {
        type: 'object',
        properties: { tags: { type: 'array', items: { $ref: '#/components/schemas/Tag' } } },
      },
    })
    expect(out).toContain('z.array(TagSchema)')
  })
})

describe('object types', () => {
  it('empty object → z.record(z.string(), z.unknown())', () => {
    const out = genSingle('E', { type: 'object' })
    expect(out).toContain('z.record(z.string(), z.unknown())')
  })

  it('additionalProperties → z.record(z.string(), z.string())', () => {
    const out = genSingle('M', { type: 'object', additionalProperties: { type: 'string' } })
    expect(out).toContain('z.record(z.string(), z.string())')
  })

  it('generates z.object({ ... }) for schemas with properties', () => {
    const out = genSingle('A', { type: 'object', properties: { name: { type: 'string' } } })
    expect(out).toContain('z.object({')
  })

  it('adds .passthrough() to object schemas for forward-compatible server responses', () => {
    const out = genSingle('A', { type: 'object', properties: { name: { type: 'string' } } })
    expect(out).toContain('.passthrough()')
  })
})

describe('$ref handling', () => {
  it('top-level $ref → references other schema by name', () => {
    const out = gen({
      Status: { type: 'string', enum: ['a', 'b'] },
      Task: {
        type: 'object',
        required: ['status'],
        properties: { status: { $ref: '#/components/schemas/Status' } },
      },
    })
    expect(out).toContain('StatusSchema')
    expect(out).toContain('status: StatusSchema')
  })

  it('$ref alias schema → references by schema name', () => {
    const out = gen({
      Original: { type: 'object', properties: { id: { type: 'string' } } },
      Alias: { $ref: '#/components/schemas/Original' },
    })
    expect(out).toContain('AliasSchema = OriginalSchema')
  })
})

describe('composition types', () => {
  it('allOf → .and() chain', () => {
    const out = gen({
      A: { type: 'object', properties: { a: { type: 'string' } } },
      B: { type: 'object', properties: { b: { type: 'string' } } },
      C: { allOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }] },
    })
    expect(out).toContain('ASchema.and(BSchema)')
  })

  it('allOf with sibling properties merges siblings into the .and() chain', () => {
    // The sibling properties outside allOf were previously dropped entirely.
    // They must now appear as an extra z.object() member in the intersection.
    const out = gen({
      Base: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      Extended: {
        allOf: [{ $ref: '#/components/schemas/Base' }],
        properties: { extra: { type: 'number' } },
        required: ['extra'],
      },
    })
    // Must chain onto the base ref schema
    expect(out).toContain('BaseSchema.and(')
    // Sibling properties must appear inside a z.object()
    expect(out).toContain('z.object(')
    // Sibling required field must have no .optional()
    expect(out).toMatch(/extra:\s*z\.number\(\)(?!\.optional)/)
  })

  it('base + extension pattern: required sibling props survive in zod output', () => {
    // Common base+extension pattern where extension adds required and optional fields.
    const out = gen({
      Animal: {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name'],
      },
      Dog: {
        allOf: [{ $ref: '#/components/schemas/Animal' }],
        properties: { breed: { type: 'string' }, age: { type: 'number' } },
        required: ['breed'],
      },
    })
    // Base schema preserved in chain
    expect(out).toContain('AnimalSchema.and(')
    // Required sibling field has no .optional()
    expect(out).toMatch(/breed:\s*z\.string\(\)(?!\.optional)/)
    // Optional sibling field has .optional()
    expect(out).toContain('age: z.number().optional()')
  })

  it('anyOf → z.union([...])', () => {
    const out = gen({
      A: { type: 'object', properties: { a: { type: 'string' } } },
      B: { type: 'object', properties: { b: { type: 'string' } } },
      C: { anyOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }] },
    })
    expect(out).toContain('z.union([ASchema, BSchema])')
  })

  it('oneOf → z.union([...])', () => {
    const out = gen({
      A: { type: 'object', properties: { a: { type: 'string' } } },
      B: { type: 'object', properties: { b: { type: 'string' } } },
      C: { oneOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }] },
    })
    expect(out).toContain('z.union([ASchema, BSchema])')
  })
})

describe('schema emission order — topological sort', () => {
  it('dependency emitted before dependent even when defined after it in the spec', () => {
    // Platform is listed AFTER Request in the spec object — this is the bug scenario.
    // Without topo-sort, RequestSchema references PlatformSchema before it is declared.
    const out = gen({
      Request: {
        type: 'object',
        properties: { platform: { $ref: '#/components/schemas/Platform' } },
      },
      Platform: { type: 'string', enum: ['DESKTOP', 'MWEB'] },
    })
    const platformIdx = out.indexOf('PlatformSchema =')
    const requestIdx = out.indexOf('RequestSchema =')
    expect(platformIdx).toBeGreaterThanOrEqual(0)
    expect(requestIdx).toBeGreaterThanOrEqual(0)
    expect(platformIdx).toBeLessThan(requestIdx)
  })

  it('chain of forward refs sorted leaves-first (C → B → A, defined in C B A order)', () => {
    const out = gen({
      C: { type: 'object', properties: { b: { $ref: '#/components/schemas/B' } } },
      B: { type: 'object', properties: { a: { $ref: '#/components/schemas/A' } } },
      A: { type: 'string' },
    })
    const aIdx = out.indexOf('ASchema =')
    const bIdx = out.indexOf('BSchema =')
    const cIdx = out.indexOf('CSchema =')
    expect(aIdx).toBeLessThan(bIdx)
    expect(bIdx).toBeLessThan(cIdx)
  })

  it('already-sorted schemas remain stable', () => {
    const out = gen({
      Status: { type: 'string', enum: ['a', 'b'] },
      Task: { type: 'object', properties: { status: { $ref: '#/components/schemas/Status' } } },
    })
    const statusIdx = out.indexOf('StatusSchema =')
    const taskIdx = out.indexOf('TaskSchema =')
    expect(statusIdx).toBeLessThan(taskIdx)
  })
})

describe('circular / self-referential schemas', () => {
  it('wraps self-referential schema in z.lazy()', () => {
    const out = gen({
      TreeNode: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          children: { type: 'array', items: { $ref: '#/components/schemas/TreeNode' } },
        },
      },
    })
    expect(out).toContain('z.lazy(')
    expect(out).toContain('TreeNodeSchema')
  })

  it('mutually circular schemas (A ↔ B) are both wrapped in z.lazy()', () => {
    const out = gen({
      A: { type: 'object', properties: { b: { $ref: '#/components/schemas/B' } } },
      B: { type: 'object', properties: { a: { $ref: '#/components/schemas/A' } } },
    })
    // Both must be lazy so they can reference each other safely
    const aDecl = out.match(/export const ASchema[^=]*=.*/)
    const bDecl = out.match(/export const BSchema[^=]*=.*/)
    expect(aDecl?.[0]).toContain('z.lazy(')
    expect(bDecl?.[0]).toContain('z.lazy(')
  })

  it('non-circular schema is NOT wrapped in z.lazy()', () => {
    const out = gen({
      Tag: { type: 'object', properties: { id: { type: 'string' } } },
      Task: { type: 'object', properties: { tag: { $ref: '#/components/schemas/Tag' } } },
    })
    expect(out).not.toContain('z.lazy(')
  })
})

describe('special property names', () => {
  it('hyphenated property key is quoted', () => {
    const out = genSingle('A', {
      type: 'object',
      properties: { 'Content-Type': { type: 'string' } },
    })
    expect(out).toMatch(/'Content-Type'/)
  })
})

describe('schema const naming', () => {
  it('exports const named <TypeName>Schema', () => {
    const out = genSingle('Task', { type: 'object', properties: { id: { type: 'string' } } })
    expect(out).toContain('export const TaskSchema')
  })
})

describe('string validation constraints', () => {
  it('minLength → .min(n)', () => {
    expect(genSingle('A', { type: 'string', minLength: 1 })).toContain('z.string().min(1)')
  })

  it('maxLength → .max(n)', () => {
    expect(genSingle('A', { type: 'string', maxLength: 255 })).toContain('z.string().max(255)')
  })

  it('minLength + maxLength → chained', () => {
    expect(genSingle('A', { type: 'string', minLength: 2, maxLength: 100 })).toContain(
      'z.string().min(2).max(100)'
    )
  })

  it('pattern → .regex(new RegExp(...))', () => {
    const out = genSingle('A', { type: 'string', pattern: '^[a-z]+$' })
    expect(out).toContain('z.string().regex(new RegExp("^[a-z]+$"))')
  })

  it('format: email → z.email() (Zod v4 top-level validator)', () => {
    expect(genSingle('A', { type: 'string', format: 'email' })).toContain('z.email()')
  })

  it('format: url → z.url() (Zod v4 top-level validator)', () => {
    expect(genSingle('A', { type: 'string', format: 'url' })).toContain('z.url()')
  })

  it('format: uuid → z.uuid() (Zod v4 top-level validator)', () => {
    expect(genSingle('A', { type: 'string', format: 'uuid' })).toContain('z.uuid()')
  })

  it('format: date-time → z.iso.datetime() (Zod v4 ISO datetime validator)', () => {
    expect(genSingle('A', { type: 'string', format: 'date-time' })).toContain('z.iso.datetime()')
  })

  it('format: date → z.iso.date() (Zod v4 ISO date validator)', () => {
    expect(genSingle('A', { type: 'string', format: 'date' })).toContain('z.iso.date()')
  })

  it('format: byte/binary stays as z.string() base (no special runtime validator)', () => {
    expect(genSingle('A', { type: 'string', format: 'byte' })).toContain('z.string()')
    expect(genSingle('A', { type: 'string', format: 'binary' })).toContain('z.string()')
  })

  it('combined: maxLength + email uses z.email().max(n)', () => {
    const out = genSingle('A', { type: 'string', maxLength: 255, format: 'email' })
    expect(out).toContain('z.email().max(255)')
  })

  it('string property in object gets Zod v4 format validators', () => {
    const out = genSingle('User', {
      type: 'object',
      required: ['email'],
      properties: { email: { type: 'string', format: 'email', maxLength: 255 } },
    })
    expect(out).toContain('email: z.email().max(255)')
  })

  it('nullable string with constraint: type: [string, null] + minLength', () => {
    const out = genSingle('A', {
      type: 'object',
      properties: { f: { type: ['string', 'null'], minLength: 1 } },
    })
    expect(out).toContain('z.string().min(1).nullable()')
  })

  it('no constraints → plain z.string()', () => {
    const out = genSingle('A', { type: 'string' })
    expect(out).toContain('z.string()')
    expect(out).not.toContain('.min(')
    expect(out).not.toContain('.max(')
    expect(out).not.toContain('.email(')
  })
})

describe('array length constraints', () => {
  it('applies minItems constraint', () => {
    const out = genSingle('A', { type: 'array', items: { type: 'string' }, minItems: 1 })
    expect(out).toContain('z.array(z.string()).min(1)')
  })

  it('applies maxItems constraint', () => {
    const out = genSingle('A', { type: 'array', items: { type: 'string' }, maxItems: 3 })
    expect(out).toContain('z.array(z.string()).max(3)')
  })

  it('applies both minItems and maxItems', () => {
    const out = genSingle('A', {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 3,
    })
    expect(out).toContain('z.array(z.string()).min(1).max(3)')
  })

  it('array with no items and minItems → z.array(z.unknown()).min(n)', () => {
    const out = genSingle('A', { type: 'array', minItems: 2 })
    expect(out).toContain('z.array(z.unknown()).min(2)')
  })

  it('array with no constraints → no .min() or .max()', () => {
    const out = genSingle('A', { type: 'array', items: { type: 'string' } })
    expect(out).toContain('z.array(z.string())')
    expect(out).not.toContain('.min(')
    expect(out).not.toContain('.max(')
  })
})

describe('number validation constraints', () => {
  it('minimum → .min(n)', () => {
    expect(genSingle('A', { type: 'number', minimum: 0 })).toContain('z.number().min(0)')
  })

  it('maximum → .max(n)', () => {
    expect(genSingle('A', { type: 'integer', maximum: 100 })).toContain('z.number().max(100)')
  })

  it('minimum + maximum → chained', () => {
    expect(genSingle('A', { type: 'integer', minimum: 0, maximum: 100 })).toContain(
      'z.number().min(0).max(100)'
    )
  })

  it('number property in object gets range constraints', () => {
    const out = genSingle('Score', {
      type: 'object',
      required: ['value'],
      properties: { value: { type: 'integer', minimum: 1, maximum: 10 } },
    })
    expect(out).toContain('value: z.number().min(1).max(10)')
  })

  it('no constraints → plain z.number()', () => {
    const out = genSingle('A', { type: 'number' })
    expect(out).toContain('z.number()')
    expect(out).not.toContain('.min(')
    expect(out).not.toContain('.max(')
  })

  it('exclusiveMinimum (numeric, OpenAPI 3.0 style) → .min(n)', () => {
    // Covers the `typeof schema.exclusiveMinimum === 'number'` branch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(genSingle('A', { type: 'number', exclusiveMinimum: 0 } as any)).toContain(
      'z.number().min(0)'
    )
  })

  it('exclusiveMaximum (numeric, OpenAPI 3.0 style) → .max(n)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(genSingle('A', { type: 'integer', exclusiveMaximum: 100 } as any)).toContain(
      'z.number().max(100)'
    )
  })

  it('exclusiveMinimum + exclusiveMaximum both numeric → chained .min().max()', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(
      genSingle('A', { type: 'number', exclusiveMinimum: 1, exclusiveMaximum: 99 } as any)
    ).toContain('z.number().min(1).max(99)')
  })
})

describe('coverage: array type with single non-null element (no null)', () => {
  it("type: ['string'] → z.string() (false branch of isNullable check)", () => {
    // Covers the `return isNullable ? ... : base` false branch — isNullable is false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { type: ['string'] } as any)
    expect(out).toContain('z.string()')
    expect(out).not.toContain('.nullable()')
  })
})

describe('coverage: hasSelfRef — additionalProperties self-reference', () => {
  it('schema with additionalProperties pointing to itself generates z.lazy()', () => {
    // Covers the additionalProperties branch in hasSelfRef
    // The schema Foo has additionalProperties: { $ref: 'Foo' } which is a self-reference
    const out = gen({
      Foo: {
        type: 'object',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        additionalProperties: { $ref: '#/components/schemas/Foo' } as any,
      },
    })
    // Self-referential schemas are wrapped in z.lazy()
    expect(out).toContain('z.lazy(')
    expect(out).toContain('FooSchema')
  })
})

describe('coverage: hasSelfRef — visited cycle guard', () => {
  it('schema whose property is the same object as a sibling property does not infinite-loop', () => {
    // Covers the `if (visited.has(schema)) return false` cycle guard
    // Build a spec programmatically so two properties share the same object reference
    const sharedProp: OpenAPIV3_1.SchemaObject = { type: 'string' }
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1.0.0' },
      paths: {},
      components: {
        schemas: {
          Item: {
            type: 'object',
            properties: {
              a: sharedProp,
              b: sharedProp, // same object reference — visited guard fires on second traversal
            },
          },
        },
      },
    }
    const { content } = generateZodSchemas(spec)
    expect(content).toContain('ItemSchema')
  })
})

describe('coverage: multi-type array with null member (zod.ts line 118 TRUE branch)', () => {
  it("type: ['string', 'number', 'null'] produces z.union with z.null() (t === 'null' TRUE)", () => {
    // nonNull = ['string', 'number'] (length > 1) → reaches const parts = types.map(...)
    // For 'null' in the original types array: t === 'null' → TRUE → 'z.null()'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { type: ['string', 'number', 'null'] } as any)
    expect(out).toContain('z.union(')
    expect(out).toContain('z.null()')
    expect(out).toContain('z.string()')
    expect(out).toContain('z.number()')
  })
})

describe('int64 format -> bigint', () => {
  it('integer with format int64 -> z.bigint()', () => {
    const out = genSingle('Id', { type: 'integer', format: 'int64' })
    // Check the schema declaration line specifically to avoid matching header comments
    expect(out).toContain('IdSchema = z.bigint()')
  })

  it('integer with format int32 -> z.number() (only int64 gets bigint)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('Id', { type: 'integer', format: 'int32' } as any)
    expect(out).toContain('IdSchema = z.number()')
    expect(out).not.toContain('z.bigint()')
  })

  it('integer with no format -> z.number()', () => {
    const out = genSingle('Count', { type: 'integer' })
    expect(out).toContain('CountSchema = z.number()')
    expect(out).not.toContain('z.bigint()')
  })

  it('int64 as object property', () => {
    const out = genSingle('Obj', {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'integer', format: 'int64' } },
    })
    expect(out).toContain('id: z.bigint()')
  })

  it('nullable int64 array type: [integer, null] with int64 format', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('Id', { type: ['integer', 'null'], format: 'int64' } as any)
    expect(out).toContain('z.bigint().nullable()')
  })
})

describe('default keyword', () => {
  it('string with default -> .default("value")', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { type: 'string', default: 'hello' } as any)
    expect(out).toContain('z.string().default("hello")')
  })

  it('number with default -> .default(n)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { type: 'number', default: 0 } as any)
    expect(out).toContain('z.number().default(0)')
  })

  it('boolean with default false -> .default(false)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { type: 'boolean', default: false } as any)
    expect(out).toContain('z.boolean().default(false)')
  })

  it('object property with default', () => {
    const out = genSingle('Config', {
      type: 'object',
      properties: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enabled: { type: 'boolean', default: true } as any,
      },
    })
    expect(out).toContain('z.boolean().default(true)')
  })

  it('no default -> no .default() call', () => {
    const out = genSingle('A', { type: 'string' })
    expect(out).not.toContain('.default(')
  })
})

describe('const keyword -> z.literal()', () => {
  it('const string -> z.literal("value")', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { const: 'fixed' } as any)
    expect(out).toContain('z.literal("fixed")')
  })

  it('const number -> z.literal(42)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { const: 42 } as any)
    expect(out).toContain('z.literal(42)')
  })

  it('const null -> z.literal(null)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { const: null } as any)
    expect(out).toContain('z.literal(null)')
  })

  it('const boolean -> z.literal(true)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', { const: true } as any)
    expect(out).toContain('z.literal(true)')
  })

  it('const property in object schema', () => {
    const out = genSingle('Obj', {
      type: 'object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties: { kind: { const: 'circle' } as any },
    })
    expect(out).toContain('z.literal("circle")')
  })
})

describe('multipleOf constraint', () => {
  it('integer with multipleOf -> .multipleOf(n)', () => {
    const out = genSingle('A', { type: 'integer', multipleOf: 5 })
    expect(out).toContain('z.number().multipleOf(5)')
  })

  it('number with multipleOf -> .multipleOf(n)', () => {
    const out = genSingle('A', { type: 'number', multipleOf: 0.5 })
    expect(out).toContain('z.number().multipleOf(0.5)')
  })

  it('multipleOf combined with min/max', () => {
    const out = genSingle('A', { type: 'integer', minimum: 0, maximum: 100, multipleOf: 5 })
    expect(out).toContain('z.number().min(0).max(100).multipleOf(5)')
  })

  it('no multipleOf -> no .multipleOf() call', () => {
    const out = genSingle('A', { type: 'integer' })
    expect(out).not.toContain('.multipleOf(')
  })
})

describe('uniqueItems constraint', () => {
  it('array with uniqueItems: true -> .refine() for uniqueness', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('A', {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
    } as any)
    expect(out).toContain('.refine(')
    expect(out).toContain('unique')
  })

  it('array without uniqueItems -> no .refine() added', () => {
    const out = genSingle('A', { type: 'array', items: { type: 'string' } })
    expect(out).not.toContain('.refine(')
  })
})

describe('additionalProperties: false -> .strict()', () => {
  it('object with additionalProperties: false -> .strict() instead of .passthrough()', () => {
    const out = genSingle('A', {
      type: 'object',
      properties: { name: { type: 'string' } },
      additionalProperties: false,
    })
    // The schema declaration should end with .strict()
    expect(out).toContain('}).strict()')
    // The schema declaration should NOT use .passthrough()
    expect(out).not.toContain('}).passthrough()')
  })

  it('object without additionalProperties: false -> .passthrough()', () => {
    const out = genSingle('A', {
      type: 'object',
      properties: { name: { type: 'string' } },
    })
    // The schema declaration should end with .passthrough()
    expect(out).toContain('}).passthrough()')
    // The schema declaration should NOT use .strict()
    expect(out).not.toContain('}).strict()')
  })
})

describe('prefixItems -> z.tuple()', () => {
  it('array with prefixItems -> z.tuple([...])', () => {
    const out = genSingle('A', {
      type: 'array',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prefixItems: [{ type: 'string' }, { type: 'number' }],
    } as any)
    expect(out).toContain('z.tuple([z.string(), z.number()])')
  })

  it('tuple with rest items -> z.tuple([...]).rest(...)', () => {
    const out = genSingle('A', {
      type: 'array',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prefixItems: [{ type: 'string' }],
      items: { type: 'number' },
    } as any)
    expect(out).toContain('z.tuple([z.string()]).rest(z.number())')
  })

  it('tuple with $ref elements', () => {
    const out = gen({
      Point: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } } },
      Pair: {
        type: 'array',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prefixItems: [
          { $ref: '#/components/schemas/Point' },
          { $ref: '#/components/schemas/Point' },
        ],
      } as any,
    })
    expect(out).toContain('z.tuple([PointSchema, PointSchema])')
  })
})

describe('additionalProperties handling in zod', () => {
  it('additionalProperties as inline primitive schema -> z.record(z.string(), z.string())', () => {
    const out = genSingle('Labels', { type: 'object', additionalProperties: { type: 'string' } })
    expect(out).toContain('z.record(z.string(), z.string())')
    expect(out).not.toContain('[object Object]')
  })

  it('additionalProperties as inline array schema -> z.record(z.string(), z.array(...))', () => {
    // Reproduces the docker PortMap bug: additionalProperties is an inline array schema with a $ref
    const out = gen({
      PortBinding: { type: 'object', properties: { HostPort: { type: 'string' } } },
      PortMap: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: { $ref: '#/components/schemas/PortBinding' },
        },
      },
    })
    expect(out).toContain('z.record(z.string(), z.array(PortBindingSchema))')
    expect(out).not.toContain('[object Object]')
  })

  it('additionalProperties as $ref -> z.record(z.string(), ContainerSchema)', () => {
    const out = gen({
      Container: { type: 'object', properties: { id: { type: 'string' } } },
      ContainerMap: {
        type: 'object',
        additionalProperties: { $ref: '#/components/schemas/Container' },
      },
    })
    expect(out).toContain('z.record(z.string(), ContainerSchema)')
    expect(out).not.toContain('[object Object]')
  })

  it('additionalProperties: true -> z.record(z.string(), z.unknown())', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('Loose', { type: 'object', additionalProperties: true } as any)
    expect(out).toContain('z.record(z.string(), z.unknown())')
  })

  it('additionalProperties: false -> .strict() on object schema', () => {
    const out = genSingle('Strict', {
      type: 'object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      additionalProperties: false as any,
      properties: { id: { type: 'string' } },
    })
    expect(out).toContain('.strict()')
    // The file header comment always mentions .passthrough(); assert the schema
    // body (non-comment lines) does not use it for an additionalProperties:false schema.
    const body = out
      .split('\n')
      .filter((l) => !l.trim().startsWith('//'))
      .join('\n')
    expect(body).not.toContain('.passthrough()')
  })

  it('inline additionalProperties with object-enum values -> z.record containing z.unknown not [object Object]', () => {
    // Reproduces the docker ContainerConfig.ExposedPorts bug:
    // additionalProperties has enum: [{}] (empty object). String({}) was emitting [object Object].
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = genSingle('ExposedPorts', {
      type: 'object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      additionalProperties: { type: 'object', enum: [{}] } as any,
    })
    expect(out).not.toContain('[object Object]')
    // Non-primitive enum values widen to z.unknown(), present in the record value expression
    expect(out).toContain('z.unknown()')
  })
})
