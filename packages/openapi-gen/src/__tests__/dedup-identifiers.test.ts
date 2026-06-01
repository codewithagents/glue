import { describe, it, expect } from 'vitest'
import { generateTypes } from '../plugins/types.js'
import { generateClient } from '../plugins/client.js'
import type { OpenAPIV3_1 } from 'openapi-types'

/**
 * Tests for deterministic de-duplication of colliding generated type and
 * parameter identifiers (issue #219).
 *
 * Root causes:
 *   - types.ts: two schema names that sanitize to the same TS identifier
 *     (e.g. 'String' and 'string' both become 'String') produce duplicate
 *     export declarations, causing TS2300.
 *   - client.ts: multiple query params whose names sanitize to the same
 *     identifier (e.g. 'StartTime', 'StartTime<', 'StartTime>') produce
 *     duplicate interface properties, causing TS2300.
 */

// ---------------------------------------------------------------------------
// Schema (types.ts) collision tests
// ---------------------------------------------------------------------------

describe('types.ts schema identifier de-duplication', () => {
  it('two schemas that sanitize to the same name get distinct identifiers', () => {
    // 'String' and 'string' both sanitize to 'String' via toTypeName.
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {},
      components: {
        schemas: {
          String: { type: 'string' },
          string: { type: 'string' },
        },
      },
    }

    const { content } = generateTypes(spec)

    // First schema keeps the base name.
    expect(content).toContain('export type String =')
    // Second schema gets the _2 suffix.
    expect(content).toContain('export type String_2 =')
    // No duplicate: exactly one occurrence of each declaration.
    const stringDecls = [...content.matchAll(/export type String =/g)]
    expect(stringDecls).toHaveLength(1)
    const string2Decls = [...content.matchAll(/export type String_2 =/g)]
    expect(string2Decls).toHaveLength(1)
  })

  it('three-way schema collision produces base, _2, and _3', () => {
    // 'DateRange', 'dateRange', 'date_range' all sanitize to 'DateRange'.
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {},
      components: {
        schemas: {
          DateRange: { type: 'string' },
          dateRange: { type: 'string' },
          date_range: { type: 'string' },
        },
      },
    }

    const { content } = generateTypes(spec)

    expect(content).toContain('export type DateRange =')
    expect(content).toContain('export type DateRange_2 =')
    expect(content).toContain('export type DateRange_3 =')
    // Exactly one base declaration (no duplicate).
    const base = [...content.matchAll(/export type DateRange =/g)]
    expect(base).toHaveLength(1)
  })

  it('a $ref pointing to a renamed schema uses the suffixed identifier', () => {
    // Schema 'Wrapper' references 'string' (which gets renamed to 'String_2').
    // The generated alias for 'Wrapper' must reference 'String_2', not 'String'.
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {},
      components: {
        schemas: {
          String: { type: 'object', properties: { value: { type: 'string' } } },
          string: { type: 'string' },
          Wrapper: { $ref: '#/components/schemas/string' },
        },
      },
    }

    const { content } = generateTypes(spec)

    // 'String' keeps base name, 'string' gets _2.
    expect(content).toContain('export interface String {')
    expect(content).toContain('export type String_2 =')
    // Wrapper must reference the renamed identifier, not 'String'.
    expect(content).toContain('export type Wrapper = String_2')
  })

  it('non-colliding schema names are unchanged', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {},
      components: {
        schemas: {
          Task: { type: 'object', properties: { id: { type: 'string' } } },
          User: { type: 'object', properties: { name: { type: 'string' } } },
        },
      },
    }

    const { content } = generateTypes(spec)

    expect(content).toContain('export interface Task {')
    expect(content).toContain('export interface User {')
    // No suffixes for non-colliding names.
    expect(content).not.toContain('Task_2')
    expect(content).not.toContain('User_2')
  })

  it('output is deterministic: same spec produces same names across repeated calls', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {},
      components: {
        schemas: {
          DateRange: { type: 'string' },
          date_range: { type: 'string' },
        },
      },
    }

    const first = generateTypes(spec).content
    const second = generateTypes(spec).content

    expect(first).toBe(second)
    expect(first).toContain('export type DateRange =')
    expect(first).toContain('export type DateRange_2 =')
  })
})

// ---------------------------------------------------------------------------
// Query param (client.ts) collision tests
// ---------------------------------------------------------------------------

describe('client.ts query param identifier de-duplication', () => {
  /** Build a spec with a single GET operation whose query params have the given names. */
  function specWithQueryParams(paramNames: string[]): OpenAPIV3_1.Document {
    return {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {
        '/items': {
          get: {
            operationId: 'listItems',
            parameters: paramNames.map((name) => ({
              name,
              in: 'query' as const,
              schema: { type: 'string' as const },
            })),
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    }
  }

  it('query params that sanitize to the same name get distinct property names', () => {
    // 'StartTime', 'StartTime<', 'StartTime>' all normalize to 'StartTime'.
    const spec = specWithQueryParams(['StartTime', 'StartTime<', 'StartTime>'])
    const { content } = generateClient(spec)

    // All three must appear with distinct names in the params interface.
    expect(content).toContain('StartTime?:')
    expect(content).toContain('StartTime_2?:')
    expect(content).toContain('StartTime_3?:')
    // No fourth suffix should exist.
    expect(content).not.toContain('StartTime_4')
  })

  it('wire names (urlName) are preserved for deduplicated params', () => {
    // The generated searchParams.set calls must use the original wire names so the
    // request reaches the server with the correct keys.
    const spec = specWithQueryParams(['StartTime', 'StartTime<', 'StartTime>'])
    const { content } = generateClient(spec)

    // Wire names appear as string literals in searchParams.set calls.
    expect(content).toContain("searchParams.set('StartTime'")
    expect(content).toContain("searchParams.set('StartTime<'")
    expect(content).toContain("searchParams.set('StartTime>'")
  })

  it('non-colliding query params are unchanged', () => {
    const spec = specWithQueryParams(['limit', 'offset', 'sort'])
    const { content } = generateClient(spec)

    expect(content).toContain('limit?:')
    expect(content).toContain('offset?:')
    expect(content).toContain('sort?:')
    expect(content).not.toContain('limit_2')
    expect(content).not.toContain('offset_2')
  })

  it('deduplication is per-operation, not across the whole spec', () => {
    // Two separate operations can each have a param named 'StartTime' without conflict.
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {
        '/calls': {
          get: {
            operationId: 'listCalls',
            parameters: [{ name: 'StartTime', in: 'query', schema: { type: 'string' } }],
            responses: { '200': { description: 'ok' } },
          },
        },
        '/messages': {
          get: {
            operationId: 'listMessages',
            parameters: [{ name: 'StartTime', in: 'query', schema: { type: 'string' } }],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    }

    const { content } = generateClient(spec)

    // Neither operation should produce a suffix because each has only one 'StartTime'.
    expect(content).not.toContain('StartTime_2')
  })

  it('output is deterministic: same spec produces same param names across repeated calls', () => {
    const spec = specWithQueryParams(['X', 'X<', 'X>'])
    const first = generateClient(spec).content
    const second = generateClient(spec).content
    expect(first).toBe(second)
  })
})
