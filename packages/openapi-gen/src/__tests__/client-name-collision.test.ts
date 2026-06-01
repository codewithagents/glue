import { describe, it, expect } from 'vitest'
import { generateClient } from '../plugins/client.js'
import type { OpenAPIV3_1 } from 'openapi-types'

/**
 * Tests for deterministic deduplication of colliding generated function names.
 * Issue #182: duplicate operationIds or paths that derive the same identifier
 * would both emit `export async function <sameName>`, causing a TS duplicate-
 * identifier error or silent shadowing.
 */
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
