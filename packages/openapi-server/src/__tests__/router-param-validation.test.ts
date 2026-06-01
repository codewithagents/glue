/**
 * Tests for path / query / header parameter validation in generated routers.
 * Covers all three frameworks (Hono, Express, Fastify) and verifies:
 *   - Path param format (uuid) validation generates Zod checks
 *   - Required query param enforcement generates Zod checks
 *   - Integer/number query param validation generates Zod checks
 *   - Header param enforcement generates Zod checks
 *   - The 422 error shape matches the body-validation shape
 *   - Specs without params produce no validation code (no drift)
 *   - All three framework generators produce consistent output
 */
import { describe, expect, it } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateRouter, generateExpressRouter, generateFastifyRouter } from '../plugins/router.js'

// ── Fixture helpers ────────────────────────────────────────────────────────────

function makeSpec(paths: OpenAPIV3_1.PathsObject, title = 'Library API'): OpenAPIV3_1.Document {
  return {
    openapi: '3.1.0',
    info: { title, version: '1.0.0' },
    paths,
  }
}

// ── No-param specs: output must be unchanged (no drift) ───────────────────────

describe('no-param spec produces no param validation code', () => {
  const noParamSpec = makeSpec({
    '/books': {
      get: {
        operationId: 'listBooks',
        responses: { '200': { description: 'ok' } },
      },
    },
  })

  it('Hono: no _pv/_qv/_hv variables when no params', () => {
    const { content } = generateRouter(noParamSpec)
    expect(content).not.toContain('_pv')
    expect(content).not.toContain('_qv')
    expect(content).not.toContain('_hv')
    expect(content).not.toContain("import { z } from 'zod'")
  })

  it('Express: no _pv/_qv/_hv variables when no params', () => {
    const { content } = generateExpressRouter(noParamSpec)
    expect(content).not.toContain('_pv')
    expect(content).not.toContain('_qv')
    expect(content).not.toContain('_hv')
    expect(content).not.toContain("import { z } from 'zod'")
  })

  it('Fastify: no _pv/_qv/_hv variables when no params', () => {
    const { content } = generateFastifyRouter(noParamSpec)
    expect(content).not.toContain('_pv')
    expect(content).not.toContain('_qv')
    expect(content).not.toContain('_hv')
    expect(content).not.toContain("import { z } from 'zod'")
  })
})

describe('optional string-only params produce no validation code (no drift)', () => {
  const optionalStringSpec = makeSpec({
    '/books': {
      get: {
        operationId: 'listBooks',
        parameters: [
          { name: 'author', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'ok' } },
      },
    },
    '/books/{id}': {
      get: {
        operationId: 'getBook',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'ok' } },
      },
    },
  })

  it('Hono: optional string query + plain string path produce no validation code', () => {
    const { content } = generateRouter(optionalStringSpec)
    expect(content).not.toContain('_qv')
    expect(content).not.toContain('_pv')
    expect(content).not.toContain("import { z } from 'zod'")
  })

  it('Express: optional string query + plain string path produce no validation code', () => {
    const { content } = generateExpressRouter(optionalStringSpec)
    expect(content).not.toContain('_qv')
    expect(content).not.toContain('_pv')
    expect(content).not.toContain("import { z } from 'zod'")
  })

  it('Fastify: optional string query + plain string path produce no validation code', () => {
    const { content } = generateFastifyRouter(optionalStringSpec)
    expect(content).not.toContain('_qv')
    expect(content).not.toContain('_pv')
    expect(content).not.toContain("import { z } from 'zod'")
  })
})

// ── Path param: uuid format validation ────────────────────────────────────────

describe('path param with format:uuid generates Zod validation', () => {
  const uuidSpec = makeSpec({
    '/books/{id}': {
      get: {
        operationId: 'getBook',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: { '200': { description: 'ok' } },
      },
    },
  })

  it('Hono: generates _pv with z.string().uuid() for uuid path param', () => {
    const { content } = generateRouter(uuidSpec)
    expect(content).toContain('_pv')
    expect(content).toContain('z.string().uuid()')
    expect(content).toContain("import { z } from 'zod'")
  })

  it('Hono: _pv.safeParse passes the raw c.req.param() value', () => {
    const { content } = generateRouter(uuidSpec)
    expect(content).toContain('c.req.param("id")')
    expect(content).toContain('_pv.success')
  })

  it('Hono: 422 response uses Invalid path parameters error label', () => {
    const { content } = generateRouter(uuidSpec)
    expect(content).toContain("error: 'Invalid path parameters'")
    expect(content).toContain('_pv.error.issues')
    expect(content).toContain('422')
  })

  it('Express: generates _pv with z.string().uuid()', () => {
    const { content } = generateExpressRouter(uuidSpec)
    expect(content).toContain('_pv')
    expect(content).toContain('z.string().uuid()')
    expect(content).toContain("import { z } from 'zod'")
  })

  it("Express: _pv.safeParse passes req.params['id']", () => {
    const { content } = generateExpressRouter(uuidSpec)
    expect(content).toContain("req.params[\"id\"]")
    expect(content).toContain('_pv.success')
  })

  it('Express: returns 422 with void pattern on failure', () => {
    const { content } = generateExpressRouter(uuidSpec)
    expect(content).toContain('return void res.status(422).json(')
    expect(content).toContain("error: 'Invalid path parameters'")
    expect(content).toContain('_pv.error.issues')
  })

  it('Fastify: generates _pv with z.string().uuid()', () => {
    const { content } = generateFastifyRouter(uuidSpec)
    expect(content).toContain('_pv')
    expect(content).toContain('z.string().uuid()')
    expect(content).toContain("import { z } from 'zod'")
  })

  it('Fastify: _pv.safeParse passes req.params.id', () => {
    const { content } = generateFastifyRouter(uuidSpec)
    expect(content).toContain('req.params.id')
    expect(content).toContain('_pv.success')
  })

  it('Fastify: returns 422 via reply.status(422).send() on failure', () => {
    const { content } = generateFastifyRouter(uuidSpec)
    expect(content).toContain('reply.status(422).send(')
    expect(content).toContain("error: 'Invalid path parameters'")
    expect(content).toContain('_pv.error.issues')
  })

  it('plain string path param (no format) does NOT generate _pv', () => {
    const plainSpec = makeSpec({
      '/books/{id}': {
        get: {
          operationId: 'getBook',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateRouter(plainSpec)
    expect(content).not.toContain('_pv')
    expect(content).not.toContain('z.string().uuid()')
  })
})

// ── Query param: required enforcement ─────────────────────────────────────────

describe('required query param generates Zod validation', () => {
  const requiredQuerySpec = makeSpec({
    '/books': {
      get: {
        operationId: 'listBooks',
        parameters: [
          { name: 'genre', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'author', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'ok' } },
      },
    },
  })

  it('Hono: generates _qv with z.string() for required and z.string().optional() for optional', () => {
    const { content } = generateRouter(requiredQuerySpec)
    expect(content).toContain('_qv')
    expect(content).toContain('genre: z.string()')
    expect(content).toContain('author: z.string().optional()')
    expect(content).toContain("import { z } from 'zod'")
  })

  it('Hono: 422 response uses Invalid query parameters error label', () => {
    const { content } = generateRouter(requiredQuerySpec)
    expect(content).toContain("error: 'Invalid query parameters'")
    expect(content).toContain('_qv.error.issues')
    expect(content).toContain('422')
  })

  it('Express: generates _qv with required/optional Zod schema', () => {
    const { content } = generateExpressRouter(requiredQuerySpec)
    expect(content).toContain('_qv')
    expect(content).toContain('genre: z.string()')
    expect(content).toContain('author: z.string().optional()')
  })

  it('Express: returns 422 with void pattern on failure', () => {
    const { content } = generateExpressRouter(requiredQuerySpec)
    expect(content).toContain('return void res.status(422).json(')
    expect(content).toContain("error: 'Invalid query parameters'")
  })

  it('Fastify: generates _qv with required/optional Zod schema', () => {
    const { content } = generateFastifyRouter(requiredQuerySpec)
    expect(content).toContain('_qv')
    expect(content).toContain('genre: z.string()')
    expect(content).toContain('author: z.string().optional()')
  })

  it('Fastify: returns 422 via reply.status(422).send() on failure', () => {
    const { content } = generateFastifyRouter(requiredQuerySpec)
    expect(content).toContain('reply.status(422).send(')
    expect(content).toContain("error: 'Invalid query parameters'")
  })
})

// ── Query param: integer coercion validation ──────────────────────────────────

describe('integer query param generates z.number() validation', () => {
  const intQuerySpec = makeSpec({
    '/books': {
      get: {
        operationId: 'listBooks',
        parameters: [
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'page', in: 'query', required: true, schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'ok' } },
      },
    },
  })

  it('Hono: generates _qv with z.number().optional() for optional integer', () => {
    const { content } = generateRouter(intQuerySpec)
    expect(content).toContain('_qv')
    expect(content).toContain('limit: z.number().optional()')
    expect(content).toContain('page: z.number()')
  })

  it('Hono: still uses Number() coercion in params extraction', () => {
    const { content } = generateRouter(intQuerySpec)
    expect(content).toContain('Number(')
  })

  it('Express: generates _qv for integer params', () => {
    const { content } = generateExpressRouter(intQuerySpec)
    expect(content).toContain('_qv')
    expect(content).toContain('limit: z.number().optional()')
    expect(content).toContain('page: z.number()')
  })

  it('Fastify: generates _qv for integer params', () => {
    const { content } = generateFastifyRouter(intQuerySpec)
    expect(content).toContain('_qv')
    expect(content).toContain('limit: z.number().optional()')
    expect(content).toContain('page: z.number()')
  })
})

// ── Header param: required header enforcement ─────────────────────────────────

describe('required header param generates Zod validation', () => {
  const headerSpec = makeSpec({
    '/books': {
      post: {
        operationId: 'createBook',
        parameters: [
          { name: 'x-api-key', in: 'header', required: true, schema: { type: 'string' } },
          { name: 'x-trace-id', in: 'header', required: false, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { '201': { description: 'created' } },
      },
    },
  })

  it('Hono: generates _hv with z.string() for required header', () => {
    const { content } = generateRouter(headerSpec)
    expect(content).toContain('_hv')
    expect(content).toContain('"x-api-key": z.string()')
    expect(content).toContain('"x-trace-id": z.string().optional()')
    expect(content).toContain("import { z } from 'zod'")
  })

  it('Hono: uses c.req.header() to read header values', () => {
    const { content } = generateRouter(headerSpec)
    expect(content).toContain('c.req.header("x-api-key")')
  })

  it('Hono: 422 response uses Invalid request headers error label', () => {
    const { content } = generateRouter(headerSpec)
    expect(content).toContain("error: 'Invalid request headers'")
    expect(content).toContain('_hv.error.issues')
    expect(content).toContain('422')
  })

  it('Express: generates _hv with required/optional header schema', () => {
    const { content } = generateExpressRouter(headerSpec)
    expect(content).toContain('_hv')
    expect(content).toContain('"x-api-key": z.string()')
    expect(content).toContain('"x-trace-id": z.string().optional()')
  })

  it('Express: reads headers via req.headers[...] with string cast', () => {
    const { content } = generateExpressRouter(headerSpec)
    expect(content).toContain('req.headers["x-api-key"] as string | undefined')
  })

  it('Express: returns 422 with void pattern on header failure', () => {
    const { content } = generateExpressRouter(headerSpec)
    expect(content).toContain('return void res.status(422).json(')
    expect(content).toContain("error: 'Invalid request headers'")
    expect(content).toContain('_hv.error.issues')
  })

  it('Fastify: generates _hv and reads headers via req.headers[...]', () => {
    const { content } = generateFastifyRouter(headerSpec)
    expect(content).toContain('_hv')
    expect(content).toContain('req.headers["x-api-key"]')
    expect(content).toContain('"x-api-key": z.string()')
  })

  it('Fastify: returns 422 via reply.status(422).send() on header failure', () => {
    const { content } = generateFastifyRouter(headerSpec)
    expect(content).toContain('reply.status(422).send(')
    expect(content).toContain("error: 'Invalid request headers'")
    expect(content).toContain('_hv.error.issues')
  })
})

// ── 422 shape consistency across param types ──────────────────────────────────

describe('422 shape is consistent with body validation shape', () => {
  it('Hono path: uses c.json({ error, issues }, 422) like body validation', () => {
    const uuidSpec = makeSpec({
      '/books/{id}': {
        get: {
          operationId: 'getBook',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateRouter(uuidSpec)
    expect(content).toMatch(/c\.json\(\{[^}]*error:[^}]*issues:[^}]*\},\s*422\)/)
  })

  it('Express query: uses { error, issues } object shape', () => {
    const spec = makeSpec({
      '/books': {
        get: {
          operationId: 'listBooks',
          parameters: [{ name: 'page', in: 'query', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateExpressRouter(spec)
    expect(content).toContain("error: 'Invalid query parameters'")
    expect(content).toContain('_qv.error.issues')
  })

  it('Fastify header: uses { error, issues } object shape', () => {
    const spec = makeSpec({
      '/books': {
        get: {
          operationId: 'listBooks',
          parameters: [{ name: 'x-api-key', in: 'header', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateFastifyRouter(spec)
    expect(content).toContain("error: 'Invalid request headers'")
    expect(content).toContain('_hv.error.issues')
  })
})

// ── Path param: hyphenated name uses quoted Zod key ───────────────────────────

describe('path param with hyphens uses quoted key in Zod object', () => {
  const hyphenSpec = makeSpec({
    '/jobs/{job-id}': {
      get: {
        operationId: 'getJob',
        parameters: [
          {
            name: 'job-id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: { '200': { description: 'ok' } },
      },
    },
  })

  it('Hono: uses quoted "job-id" key in z.object()', () => {
    const { content } = generateRouter(hyphenSpec)
    expect(content).toContain('"job-id": z.string().uuid()')
  })

  it('Hono: passes c.req.param("job-id") to safeParse', () => {
    const { content } = generateRouter(hyphenSpec)
    expect(content).toContain('c.req.param("job-id")')
  })

  it('Express: uses req.params["job-id"] in safeParse', () => {
    const { content } = generateExpressRouter(hyphenSpec)
    expect(content).toContain('req.params["job-id"]')
  })

  it('Fastify: uses req.params["job-id"] (bracket notation for hyphenated name)', () => {
    const { content } = generateFastifyRouter(hyphenSpec)
    expect(content).toContain('req.params["job-id"]')
  })
})

// ── Other format constraints ───────────────────────────────────────────────────

describe('additional format constraints generate appropriate Zod modifiers', () => {
  it('email format generates z.string().email()', () => {
    const spec = makeSpec({
      '/users/{email}': {
        get: {
          operationId: 'getUser',
          parameters: [
            { name: 'email', in: 'path', required: true, schema: { type: 'string', format: 'email' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateRouter(spec)
    expect(content).toContain('z.string().email()')
  })

  it('date-time format generates z.string().datetime()', () => {
    const spec = makeSpec({
      '/events/{ts}': {
        get: {
          operationId: 'getEvent',
          parameters: [
            { name: 'ts', in: 'path', required: true, schema: { type: 'string', format: 'date-time' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateRouter(spec)
    expect(content).toContain('z.string().datetime()')
  })

  it('uri format generates z.string().url()', () => {
    const spec = makeSpec({
      '/resources/{url}': {
        get: {
          operationId: 'getResource',
          parameters: [
            { name: 'url', in: 'path', required: true, schema: { type: 'string', format: 'uri' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateRouter(spec)
    expect(content).toContain('z.string().url()')
  })

  it('unknown format does not generate path param validation', () => {
    const spec = makeSpec({
      '/items/{code}': {
        get: {
          operationId: 'getItem',
          parameters: [
            { name: 'code', in: 'path', required: true, schema: { type: 'string', format: 'custom-format' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateRouter(spec)
    expect(content).not.toContain('_pv')
  })
})

// ── Zod import gating ─────────────────────────────────────────────────────────

describe('z import is added only when param validation is needed', () => {
  it('Hono: adds z import when uuid path param exists', () => {
    const spec = makeSpec({
      '/items/{id}': {
        get: {
          operationId: 'getItem',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    expect(generateRouter(spec).content).toContain("import { z } from 'zod'")
  })

  it('Hono: adds z import when required query param exists', () => {
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: 'listItems',
          parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    expect(generateRouter(spec).content).toContain("import { z } from 'zod'")
  })

  it('Hono: adds z import when header param exists', () => {
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: 'listItems',
          parameters: [{ name: 'x-api-key', in: 'header', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    expect(generateRouter(spec).content).toContain("import { z } from 'zod'")
  })

  it('Hono: adds z import when integer query param exists (NaN guard)', () => {
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: 'listItems',
          parameters: [{ name: 'limit', in: 'query', required: false, schema: { type: 'integer' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    expect(generateRouter(spec).content).toContain("import { z } from 'zod'")
  })

  it('Hono: does NOT add z import for optional string query only', () => {
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: 'listItems',
          parameters: [{ name: 'q', in: 'query', required: false, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    expect(generateRouter(spec).content).not.toContain("import { z } from 'zod'")
  })
})

// ── $ref params resolve correctly ─────────────────────────────────────────────

describe('$ref path params resolve to their schema for validation', () => {
  it('Hono: resolves $ref path param and validates uuid format', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1.0.0' },
      paths: {
        '/books/{id}': {
          get: {
            operationId: 'getBook',
            parameters: [{ $ref: '#/components/parameters/BookId' }],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      components: {
        parameters: {
          BookId: {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        },
      },
    }
    const { content } = generateRouter(spec)
    expect(content).toContain('z.string().uuid()')
    expect(content).toContain('_pv')
  })
})
