/**
 * Tests for application/x-www-form-urlencoded request body encoding (issue #176).
 *
 * Previously a form-urlencoded request body returned `undefined` from
 * getRequestBodyInfo, so the generated function had no body parameter and sent
 * an empty body (silent data loss). Form bodies must now:
 *   - give the generated function a typed `body` parameter,
 *   - pass `bodyEncoding: 'form'` to the _request helper,
 *   - serialize via URLSearchParams with the correct Content-Type.
 *
 * The form plumbing is gated behind a feature flag, so a spec with no
 * form-urlencoded endpoint must produce a _request helper identical to before
 * (no bodyEncoding field, no URLSearchParams).
 *
 * All specs below are fictional and do not represent real or internal APIs.
 */
import { describe, it, expect } from 'vitest'
import { generateClient } from '../plugins/client.js'
import type { OpenAPIV3_1 } from 'openapi-types'

const formSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional Form API', version: '1' },
  paths: {
    '/tokens': {
      post: {
        operationId: 'createToken',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: {
                  grantType: { type: 'string' },
                  scopes: { type: 'array', items: { type: 'string' } },
                },
                required: ['grantType'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'token',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
  },
}

const jsonOnlySpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional JSON API', version: '1' },
  paths: {
    '/widgets': {
      post: {
        operationId: 'createWidget',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string' } } },
            },
          },
        },
        responses: {
          '200': {
            description: 'widget',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
  },
}

describe('form-urlencoded request bodies (#176)', () => {
  const out = generateClient(formSpec).content

  it('gives the generated function a typed body parameter', () => {
    expect(out).toMatch(/export async function createToken\(\s*body:/)
  })

  it('passes bodyEncoding: form to the request helper', () => {
    expect(out).toContain(`bodyEncoding: 'form'`)
  })

  it('serializes form bodies with URLSearchParams and the form Content-Type', () => {
    expect(out).toContain('application/x-www-form-urlencoded')
    expect(out).toContain('new URLSearchParams(')
  })

  it('still uses JSON.stringify as the non-form serialization path', () => {
    expect(out).toContain('JSON.stringify(opts.body)')
  })
})

describe('JSON-only specs keep the original _request helper (no form plumbing)', () => {
  const out = generateClient(jsonOnlySpec).content

  it('does not emit the bodyEncoding field', () => {
    expect(out).not.toContain('bodyEncoding')
  })

  it('does not emit URLSearchParams body serialization', () => {
    expect(out).not.toContain('new URLSearchParams(')
  })

  it('hard-codes application/json Content-Type for bodies', () => {
    expect(out).toContain(`{ 'Content-Type': 'application/json' }`)
  })
})
