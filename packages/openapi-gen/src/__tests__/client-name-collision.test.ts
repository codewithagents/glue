import { describe, it, expect } from 'vitest'
import { generateClient } from '../plugins/client.js'
import type { OpenAPIV3_1 } from 'openapi-types'

/**
 * Tests for deterministic deduplication of colliding generated function names.
 * Issue #182: duplicate operationIds or paths that derive the same identifier
 * would both emit `export async function <sameName>`, causing a TS duplicate-
 * identifier error or silent shadowing.
 *
 * Issue #218: spec-derived operation names must not collide with client-internal
 * identifiers (getConfig, fetch, ApiError, etc.) that are defined or imported at
 * file scope in the generated output.
 */

// ---------------------------------------------------------------------------
// Reserved / client-internal name collision tests (#218)
// ---------------------------------------------------------------------------

describe('client-internal name collision: getConfig (#218)', () => {
  // airflow / configcat pattern: spec has operationId 'get_config' or 'get-config'
  // which sanitizes to 'getConfig', colliding with the imported helper.
  it('operation named getConfig gets a numeric suffix', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Fictional Config API', version: '1' },
      paths: {
        '/config': {
          get: {
            operationId: 'get_config',
            responses: {
              '200': {
                description: 'ok',
                content: { 'application/json': { schema: { type: 'object' } } },
              },
            },
          },
        },
      },
    }

    const { content } = generateClient(spec)

    // The generated function must NOT be named 'getConfig' (that name is taken by the import).
    expect(content).not.toContain('export async function getConfig(')
    // It must receive a suffix.
    expect(content).toContain('export async function getConfig_2(')
    // The imported helper must still be present.
    expect(content).toContain("import { getConfig, type ClientConfig } from './client-config.js'")
  })

  it('operation named get-config (kebab) also gets a suffix', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Fictional Config API', version: '1' },
      paths: {
        '/cfg': {
          get: {
            operationId: 'get-config',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    }

    const { content } = generateClient(spec)

    expect(content).not.toContain('export async function getConfig(')
    expect(content).toContain('export async function getConfig_2(')
  })
})

describe('client-internal name collision: fetch (#218)', () => {
  // pinecone pattern: spec has an operation whose sanitized name is 'fetch',
  // which would shadow the global fetch() used inside the _request helper and
  // break the _FetchResponse type alias.
  it('operation named fetch gets a numeric suffix', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Fictional Vector API', version: '1' },
      paths: {
        '/vectors/fetch': {
          get: {
            operationId: 'fetch',
            requestBody: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/FetchRequest' },
                },
              },
            },
            responses: {
              '200': {
                description: 'ok',
                content: {
                  'application/json': { schema: { $ref: '#/components/schemas/FetchResponse' } },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          FetchRequest: {
            type: 'object',
            properties: { ids: { type: 'array', items: { type: 'string' } } },
          },
          FetchResponse: {
            type: 'object',
            properties: { vectors: { type: 'object' } },
          },
        },
      },
    }

    const { content } = generateClient(spec)

    // The generated operation function must not be named 'fetch' (shadows the global).
    expect(content).not.toContain('export async function fetch(')
    // It must receive a suffix.
    expect(content).toContain('export async function fetch_2(')
    // The _FetchResponse type alias must still use the global fetch, not the local one.
    expect(content).toContain('type _FetchResponse = Awaited<ReturnType<typeof fetch>>')
    // Schema types from models must still be imported.
    expect(content).toContain('FetchRequest')
    expect(content).toContain('FetchResponse')
  })
})

describe('client-internal name collision: multiple reserved names (#218)', () => {
  it('all reserved names (getConfig, fetch, ApiError, etc.) are pre-seeded so specs cannot collide', () => {
    // Verify that operations producing getConfig and fetch each receive suffixes.
    // Both names are reserved because they are used at file scope in the generated output.
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Fictional Multi-Reserved API', version: '1' },
      paths: {
        '/config': {
          get: {
            operationId: 'getConfig',
            responses: { '200': { description: 'ok' } },
          },
        },
        '/fetch': {
          get: {
            operationId: 'fetch',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    }

    const { content } = generateClient(spec)

    // Neither reserved name should appear as a generated function.
    expect(content).not.toContain('export async function getConfig(')
    expect(content).not.toContain('export async function fetch(')
    // Both must receive suffixes.
    expect(content).toContain('export async function getConfig_2(')
    expect(content).toContain('export async function fetch_2(')
    // The imported helper and the type alias must still reference the originals.
    expect(content).toContain("import { getConfig, type ClientConfig } from './client-config.js'")
    expect(content).toContain('type _FetchResponse = Awaited<ReturnType<typeof fetch>>')
  })
})

describe('client name-collision deduplication', () => {
  it('two operationIds that sanitize to the same identifier get distinct names', () => {
    // "users.list" and "users-list" both sanitize to "usersList".
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {
        '/users': {
          get: {
            operationId: 'users.list',
            responses: { '200': { description: 'ok' } },
          },
        },
        '/users/search': {
          get: {
            operationId: 'users-list',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    }

    const { content } = generateClient(spec)

    // First occurrence keeps the canonical name.
    expect(content).toContain('export async function usersList(')
    // Second occurrence must have a suffix.
    expect(content).toContain('export async function usersList_2(')
    // Only two exports should exist, not a third one.
    const matches = [...content.matchAll(/export async function usersList/g)]
    expect(matches).toHaveLength(2)
  })

  it('three-way collision produces _2 and _3 suffixes', () => {
    // "a.b", "a-b", "a_b" all sanitize to "aB".
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {
        '/r1': { get: { operationId: 'a.b', responses: { '200': { description: 'ok' } } } },
        '/r2': { get: { operationId: 'a-b', responses: { '200': { description: 'ok' } } } },
        '/r3': { get: { operationId: 'a_b', responses: { '200': { description: 'ok' } } } },
      },
    }

    const { content } = generateClient(spec)

    expect(content).toContain('export async function aB(')
    expect(content).toContain('export async function aB_2(')
    expect(content).toContain('export async function aB_3(')
  })

  it('two paths without operationId that derive the same name get distinct names', () => {
    // GET /users and GET /users (exact duplicate paths) is illegal in practice,
    // but two separate paths can also map to the same derived name when both
    // start with the same resource and have equivalent segments after stripping
    // the API prefix. The realistic trigger is different API prefix stripping:
    // /api/v1/users and /users both derive "getUsers" for GET.
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {
        '/api/v1/users': {
          // deriveOperationName('get', '/api/v1/users') -> 'getUsers'
          get: { responses: { '200': { description: 'ok' } } },
        },
        '/users': {
          // deriveOperationName('get', '/users') -> 'getUsers'
          get: { responses: { '200': { description: 'ok' } } },
        },
      },
    }

    const { content } = generateClient(spec)

    expect(content).toContain('export async function getUsers(')
    expect(content).toContain('export async function getUsers_2(')
  })

  it('non-colliding names are unchanged', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {
        '/users': {
          get: {
            operationId: 'listUsers',
            responses: { '200': { description: 'ok' } },
          },
        },
        '/posts': {
          get: {
            operationId: 'listPosts',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    }

    const { content } = generateClient(spec)

    expect(content).toContain('export async function listUsers(')
    expect(content).toContain('export async function listPosts(')
    // No suffixes should appear for non-colliding names.
    expect(content).not.toContain('listUsers_2')
    expect(content).not.toContain('listPosts_2')
  })

  it('output is deterministic: same spec produces same names across repeated calls', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {
        '/a': { get: { operationId: 'x.y', responses: { '200': { description: 'ok' } } } },
        '/b': { get: { operationId: 'x-y', responses: { '200': { description: 'ok' } } } },
      },
    }

    const first = generateClient(spec).content
    const second = generateClient(spec).content

    expect(first).toBe(second)
  })
})
