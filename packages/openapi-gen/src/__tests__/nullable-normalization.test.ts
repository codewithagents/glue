/**
 * Tests for OpenAPI 3.0 nullable: true normalization (issue #179).
 *
 * The normalization pass converts `nullable: true` / `x-nullable: true` into
 * the 3.1 null-union form at parse time so the types and zod plugins handle
 * nullability through their existing logic without duplication.
 *
 * All specs below are fictional.
 */

import { describe, it, expect } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateTypes } from '../plugins/types.js'
import { generateZodSchemas } from '../plugins/zod.js'
import { normalizeNullable } from '../utils/normalize-nullable.js'

/** Build a minimal spec with given schemas, run normalization, then generate types. */
function genTypes(schemas: Record<string, OpenAPIV3_1.SchemaObject>): string {
  const spec: OpenAPIV3_1.Document = {
    openapi: '3.0.3',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: { schemas },
  }
  normalizeNullable(spec)
  return generateTypes(spec).content
}

/** Build a minimal spec with given schemas, run normalization, then generate Zod schemas. */
function genZod(schemas: Record<string, OpenAPIV3_1.SchemaObject>): string {
  const spec: OpenAPIV3_1.Document = {
    openapi: '3.0.3',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: { schemas },
  }
  normalizeNullable(spec)
  return generateZodSchemas(spec).content
}

// ---------------------------------------------------------------------------
// Primitive + nullable
// ---------------------------------------------------------------------------

describe('primitive + nullable: true', () => {
  it('string + nullable → models.ts has | null', () => {
    const out = genTypes({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: { type: 'string', nullable: true } as any,
        },
      },
    })
    expect(out).toContain('string | null')
  })

  it('string + nullable → schemas.ts has .nullable()', () => {
    const out = genZod({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: { type: 'string', nullable: true } as any,
        },
      },
    })
    expect(out).toContain('z.string().nullable()')
  })

  it('integer + nullable → models.ts has | null', () => {
    const out = genTypes({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          count: { type: 'integer', nullable: true } as any,
        },
      },
    })
    expect(out).toContain('number | null')
  })

  it('integer + nullable → schemas.ts has .nullable()', () => {
    const out = genZod({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          count: { type: 'integer', nullable: true } as any,
        },
      },
    })
    expect(out).toContain('z.number().nullable()')
  })

  it('boolean + nullable → models.ts has | null', () => {
    const out = genTypes({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Flag: { type: 'boolean', nullable: true } as any,
    })
    expect(out).toContain('boolean | null')
  })

  it('boolean + nullable → schemas.ts has .nullable()', () => {
    const out = genZod({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Flag: { type: 'boolean', nullable: true } as any,
    })
    expect(out).toContain('z.boolean().nullable()')
  })
})

// ---------------------------------------------------------------------------
// Array type + nullable
// ---------------------------------------------------------------------------

describe('array type + nullable: true', () => {
  it("type: ['string','number'] + nullable → type union gains null in models.ts", () => {
    const out = genTypes({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          val: { type: ['string', 'number'], nullable: true } as any,
        },
      },
    })
    // The resulting type should include all three
    expect(out).toContain('string | number | null')
  })

  it("type: ['string','number'] + nullable → z.union includes z.null() in schemas.ts", () => {
    const out = genZod({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          val: { type: ['string', 'number'], nullable: true } as any,
        },
      },
    })
    expect(out).toContain('z.null()')
  })

  it("type array already contains 'null' — no duplicate null added", () => {
    // This is a 3.1 spec with correct null union. The normalization should be a no-op.
    const out = genTypes({
      Widget: {
        type: 'object',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        properties: { val: { type: ['string', 'null'] } as any },
      },
    })
    // Exactly one null, not 'null | null'
    const matches = out.match(/null/g)
    expect(matches).not.toBeNull()
    // Count occurrences — should not see 'null | null'
    expect(out).not.toContain('null | null')
  })
})

// ---------------------------------------------------------------------------
// Object / array + nullable: structure must be preserved (regression guard)
//
// A nullable object/array must NOT collapse to `unknown | null`. The array form
// type: ['object','null'] cannot carry properties/items, so these schemas are
// wrapped in anyOf so the generators render each member recursively.
// ---------------------------------------------------------------------------

describe('object / array + nullable: true (structure preserved)', () => {
  it('object with properties + nullable → inline object | null, not unknown | null', () => {
    const out = genTypes({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          meta: {
            type: 'object',
            nullable: true,
            properties: { id: { type: 'string' }, label: { type: 'string' } },
            required: ['id'],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
    })
    expect(out).not.toContain('unknown | null')
    expect(out).toContain('| null')
    // The inner object structure survives.
    expect(out).toContain('id: string')
  })

  it('object with additionalProperties + nullable → Record<...> | null', () => {
    const out = genTypes({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          scores: {
            type: 'object',
            nullable: true,
            additionalProperties: { type: 'integer' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
    })
    expect(out).not.toContain('unknown | null')
    expect(out).toContain('Record<string, number> | null')
  })

  it('array + nullable → T[] | null, not unknown | null', () => {
    const out = genTypes({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tags: { type: 'array', nullable: true, items: { type: 'string' } } as any,
        },
      },
    })
    expect(out).not.toContain('unknown | null')
    expect(out).toContain('string[]')
    expect(out).toContain('| null')
  })

  it('object with properties + nullable → schemas.ts keeps z.object and adds null', () => {
    const out = genZod({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          meta: {
            type: 'object',
            nullable: true,
            properties: { id: { type: 'string' } },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
    })
    // The object schema survives (z.object) and null is part of the union.
    expect(out).toContain('z.object(')
    expect(out).toContain('z.null()')
  })
})

// ---------------------------------------------------------------------------
// Enum + nullable
// ---------------------------------------------------------------------------

describe('enum + nullable: true', () => {
  it('string enum + nullable → models.ts union includes | null', () => {
    const out = genTypes({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Status: { type: 'string', enum: ['active', 'inactive'], nullable: true } as any,
    })
    expect(out).toContain('null')
    // The enum should still list the string values
    expect(out).toContain('"active"')
    expect(out).toContain('"inactive"')
  })

  it('string enum + nullable → schemas.ts Zod accepts null literal', () => {
    const out = genZod({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Status: { type: 'string', enum: ['active', 'inactive'], nullable: true } as any,
    })
    // With null in enum, falls into mixed-enum union path: z.union([z.literal(...), z.literal(null)])
    // OR a z.enum that includes 'null' coercion — either way null must appear
    expect(out).toContain('null')
  })

  it('enum + nullable — null not duplicated if already present', () => {
    // Spec that already carries null in the enum (unusual but valid in 3.0 too)
    const out = genTypes({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Status: { type: 'string', enum: ['active', null], nullable: true } as any,
    })
    // Should not contain 'null, null' or double null in the union
    expect(out).not.toMatch(/null.*null.*null/)
  })
})

// ---------------------------------------------------------------------------
// x-nullable vendor extension
// ---------------------------------------------------------------------------

describe('x-nullable: true vendor extension', () => {
  it('x-nullable treated same as nullable for string field → | null in models.ts', () => {
    const out = genTypes({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: { type: 'string', 'x-nullable': true } as any,
        },
      },
    })
    expect(out).toContain('string | null')
  })

  it('x-nullable treated same as nullable → .nullable() in schemas.ts', () => {
    const out = genZod({
      Widget: {
        type: 'object',
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: { type: 'string', 'x-nullable': true } as any,
        },
      },
    })
    expect(out).toContain('z.string().nullable()')
  })
})

// ---------------------------------------------------------------------------
// allOf + nullable
// ---------------------------------------------------------------------------

describe('allOf + nullable: true', () => {
  it('allOf + nullable → models.ts has | null in the union', () => {
    const out = genTypes({
      Base: { type: 'object', properties: { id: { type: 'string' } } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Extended: { allOf: [{ $ref: '#/components/schemas/Base' }], nullable: true } as any,
    })
    // Extended should produce a type that includes null
    expect(out).toContain('null')
  })

  it('allOf + nullable → schemas.ts has z.null() in the union', () => {
    const out = genZod({
      Base: { type: 'object', properties: { id: { type: 'string' } } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Extended: { allOf: [{ $ref: '#/components/schemas/Base' }], nullable: true } as any,
    })
    expect(out).toContain('z.null()')
  })
})

// ---------------------------------------------------------------------------
// OpenAPI 3.1 regression: existing null-union syntax must work unchanged
// ---------------------------------------------------------------------------

describe('OpenAPI 3.1 null union (no regression)', () => {
  it("type: ['string','null'] in 3.1 spec still produces | null in models.ts", () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1.0.0' },
      paths: {},
      components: {
        schemas: {
          Widget: {
            type: 'object',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            properties: { name: { type: ['string', 'null'] } as any },
          },
        },
      },
    }
    // Normalization should be a no-op (no nullable: true present)
    normalizeNullable(spec)
    const out = generateTypes(spec).content
    expect(out).toContain('string | null')
    expect(out).not.toContain('null | null')
  })

  it("type: ['string','null'] in 3.1 spec still produces .nullable() in schemas.ts", () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1.0.0' },
      paths: {},
      components: {
        schemas: {
          Widget: {
            type: 'object',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            properties: { name: { type: ['string', 'null'] } as any },
          },
        },
      },
    }
    normalizeNullable(spec)
    const out = generateZodSchemas(spec).content
    expect(out).toContain('z.string().nullable()')
  })
})

// ---------------------------------------------------------------------------
// Cycle guard: shared schema object references do not infinite-loop
// ---------------------------------------------------------------------------

describe('normalizeNullable cycle guard', () => {
  it('shared schema objects do not cause infinite loop', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharedProp: any = { type: 'string', nullable: true }
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.0.3',
      info: { title: 'Test', version: '1.0.0' },
      paths: {},
      components: {
        schemas: {
          Widget: {
            type: 'object',
            properties: {
              a: sharedProp,
              b: sharedProp, // same object reference — visited guard fires
            },
          },
        },
      },
    }
    // Should not throw or loop
    expect(() => normalizeNullable(spec)).not.toThrow()
    const out = generateTypes(spec).content
    // Both properties should be string | null
    expect(out).toContain('string | null')
  })
})
