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

// ---------------------------------------------------------------------------
// Form-urlencoded body with a $ref schema must be imported (#218)
// box pattern: operations like post_oauth2_revoke use application/x-www-form-urlencoded
// with a $ref schema body. The type must appear in the import statement so that
// the generated function compiles (TS2304 fix).
// ---------------------------------------------------------------------------

const refFormSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional OAuth API', version: '1' },
  paths: {
    '/oauth2/revoke': {
      post: {
        operationId: 'postOauth2Revoke',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/RevokeRequest' },
            },
          },
        },
        responses: { '200': { description: 'ok' } },
      },
    },
    '/oauth2/token': {
      post: {
        operationId: 'postOauth2Token',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/TokenRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'ok',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RevokeRequest: {
        type: 'object',
        properties: { token: { type: 'string' }, clientId: { type: 'string' } },
        required: ['token'],
      },
      TokenRequest: {
        type: 'object',
        properties: { grantType: { type: 'string' }, code: { type: 'string' } },
        required: ['grantType'],
      },
      TokenResponse: {
        type: 'object',
        properties: { accessToken: { type: 'string' } },
      },
    },
  },
}

describe('form-urlencoded body with $ref schema imports the type (#218)', () => {
  const out = generateClient(refFormSpec).content

  it('imports the $ref schema type used as the form body', () => {
    // RevokeRequest and TokenRequest are form-urlencoded body types.
    // They must appear in the models import so the body parameter compiles.
    expect(out).toContain('RevokeRequest')
    expect(out).toContain('TokenRequest')
    const importLine = out.split('\n').find((l) => l.startsWith('import type {'))
    expect(importLine).toBeDefined()
    expect(importLine).toContain('RevokeRequest')
    expect(importLine).toContain('TokenRequest')
  })

  it('uses the $ref type name in the function body parameter', () => {
    expect(out).toContain('postOauth2Revoke(body: RevokeRequest')
    expect(out).toContain('postOauth2Token(body: TokenRequest')
  })

  it('emits form encoding for both operations', () => {
    expect(out).toContain("bodyEncoding: 'form'")
  })
})
