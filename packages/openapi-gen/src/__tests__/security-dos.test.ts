/**
 * Security regression tests: deeply nested inline schemas must not crash the
 * generator with an unbounded-recursion stack overflow (denial of service).
 *
 * THREAT: an attacker-supplied OpenAPI spec with a very deeply nested inline
 * schema (e.g. tens of thousands of nested `array.items`) would otherwise drive
 * the recursive type/zod emitters and the topo-sort passes past the call-stack
 * limit, killing the build (e.g. in CI). `generate()` runs `assertBoundedDepth`
 * over every component schema up front so the spec is rejected with a clean error
 * before any recursive pass runs. Cyclic $refs are handled separately by the
 * bundler + visited sets; this guards raw inline nesting depth.
 *
 * See SECURITY.md ("Security regression tests"). Run only these with:
 *   pnpm -r test -t SECURITY
 */
import { describe, expect, it } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { assertBoundedDepth } from '../utils/schema-depth.js'

/** Build an inline schema nested `depth` levels deep via array items. */
function deeplyNested(depth: number): OpenAPIV3_1.SchemaObject {
  let schema: OpenAPIV3_1.SchemaObject = { type: 'string' }
  for (let i = 0; i < depth; i++) {
    schema = { type: 'array', items: schema }
  }
  return schema
}

describe('SECURITY: deeply nested schemas are rejected with a clean error, not a stack overflow', () => {
  it('throws a bounded depth error on a 10000-deep array schema', () => {
    expect(() => assertBoundedDepth(deeplyNested(10_000))).toThrowError(/maximum supported depth/i)
  })

  it('throws on deep nesting reached via properties and additionalProperties', () => {
    let viaProps: OpenAPIV3_1.SchemaObject = { type: 'string' }
    for (let i = 0; i < 5000; i++) {
      viaProps = { type: 'object', properties: { child: viaProps } }
    }
    expect(() => assertBoundedDepth(viaProps)).toThrowError(/maximum supported depth/i)

    let viaAdditional: OpenAPIV3_1.SchemaObject = { type: 'string' }
    for (let i = 0; i < 5000; i++) {
      viaAdditional = { type: 'object', additionalProperties: viaAdditional }
    }
    expect(() => assertBoundedDepth(viaAdditional)).toThrowError(/maximum supported depth/i)
  })

  it('the guard itself does not recurse, so it cannot overflow on hostile input', () => {
    // A 200000-deep schema would blow a recursive checker's stack; the iterative
    // guard must still return a clean thrown error rather than a RangeError.
    expect(() => assertBoundedDepth(deeplyNested(200_000))).toThrowError(/maximum supported depth/i)
  })

  it('a realistically nested schema (depth 20) passes', () => {
    expect(() => assertBoundedDepth(deeplyNested(20))).not.toThrow()
  })

  it('treats $ref as a leaf (does not follow references)', () => {
    const withRef: OpenAPIV3_1.SchemaObject = {
      type: 'object',
      properties: { self: { $ref: '#/components/schemas/Node' } as never },
    }
    expect(() => assertBoundedDepth(withRef)).not.toThrow()
  })
})
