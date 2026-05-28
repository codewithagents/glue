import { describe, expect, it } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateRouter } from '../plugins/router.js'

// ── Fixture helpers ────────────────────────────────────────────────────────────

function makeSpec(paths: OpenAPIV3_1.PathsObject, title = 'Pet Store'): OpenAPIV3_1.Document {
  return {
    openapi: '3.1.0',
    info: { title, version: '1.0.0' },
    paths,
  }
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('generateRouter', () => {
  it('returns a GeneratedFile with filename router.ts', () => {
    const spec = makeSpec({})
    const result = generateRouter(spec)
    expect(result).toBeDefined()
    expect(result.filename).toBe('router.ts')
  })

  it('output starts with auto-generated header', () => {
    const spec = makeSpec({})
    const result = generateRouter(spec)
    expect(result.content).toMatch(/^\/\/ This file is auto-generated/)
  })

  it('imports Hono from hono', () => {
    const spec = makeSpec({})
    const result = generateRouter(spec)
    expect(result.content).toContain("import { Hono } from 'hono'")
  })

  it('imports service interface from service.js', () => {
    const spec = makeSpec({})
    const result = generateRouter(spec)
    expect(result.content).toContain("from './service.js'")
  })

  it('exports createRouter function', () => {
    const spec = makeSpec({})
    const result = generateRouter(spec)
    expect(result.content).toContain('export function createRouter(')
  })

  it('GET route uses app.get', () => {
    const spec = makeSpec({
      '/pets': {
        get: {
          operationId: 'listPets',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain("app.get('/pets'")
  })

  it('POST route uses app.post', () => {
    const spec = makeSpec({
      '/pets': {
        post: {
          operationId: 'createPet',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePetRequest' } } },
          },
          responses: { '201': { description: 'created' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain("app.post('/pets'")
  })

  it('DELETE route uses app.delete', () => {
    const spec = makeSpec({
      '/pets/{id}': {
        delete: {
          operationId: 'deletePet',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '204': { description: 'deleted' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain("app.delete('/pets/:id'")
  })

  it('path param {id} becomes :id in Hono route', () => {
    const spec = makeSpec({
      '/pets/{id}': {
        get: {
          operationId: 'getPet',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain("app.get('/pets/:id'")
  })

  it('path param extracted via c.req.param()', () => {
    const spec = makeSpec({
      '/pets/{id}': {
        get: {
          operationId: 'getPet',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain("c.req.param('id')")
  })

  it('query params extracted via c.req.query()', () => {
    const spec = makeSpec({
      '/pets': {
        get: {
          operationId: 'listPets',
          parameters: [
            { name: 'species', in: 'query', required: false, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain("c.req.query('species')")
  })

  it('numeric query param uses Number() coercion', () => {
    const spec = makeSpec({
      '/pets': {
        get: {
          operationId: 'listPets',
          parameters: [
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain('Number(')
  })

  it('POST extracts JSON body with typed generic', () => {
    const spec = makeSpec({
      '/pets': {
        post: {
          operationId: 'createPet',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePetRequest' } } },
          },
          responses: { '201': { description: 'created' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain('c.req.json<CreatePetRequest>()')
  })

  it('imports body type from models.js when typed body used', () => {
    const spec = makeSpec({
      '/pets': {
        post: {
          operationId: 'createPet',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePetRequest' } } },
          },
          responses: { '201': { description: 'created' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain("import type { CreatePetRequest } from './models.js'")
  })

  it('no models import when no typed body', () => {
    const spec = makeSpec({
      '/pets': {
        get: {
          operationId: 'listPets',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).not.toContain("from './models.js'")
  })

  it('POST with 201 response uses c.json(result, 201)', () => {
    const spec = makeSpec({
      '/pets': {
        post: {
          operationId: 'createPet',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object' } } },
          },
          responses: {
            '201': {
              description: 'created',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Pet' } } },
            },
          },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain('c.json(await service.createPet(')
    expect(result.content).toContain(', 201)')
  })

  it('DELETE with 204 returns new Response(null, { status: 204 })', () => {
    const spec = makeSpec({
      '/pets/{id}': {
        delete: {
          operationId: 'deletePet',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '204': { description: 'deleted' } },
        },
      },
    })
    const result = generateRouter(spec)
    expect(result.content).toContain('new Response(null, { status: 204 })')
  })

  it('returns empty Hono app when no operations', () => {
    const spec = makeSpec({})
    const result = generateRouter(spec)
    expect(result.content).toContain('const app = new Hono()')
    expect(result.content).toContain('return app')
  })

  it('multiple path params passed in order to service', () => {
    const spec = makeSpec({
      '/owners/{ownerId}/pets/{petId}': {
        get: {
          operationId: 'getOwnerPet',
          parameters: [
            { name: 'ownerId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'petId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    // Should pass both path params
    expect(result.content).toContain("c.req.param('ownerId')")
    expect(result.content).toContain("c.req.param('petId')")
  })

  it('query param name with [] suffix is normalized to a valid TypeScript identifier', () => {
    const spec = makeSpec({
      '/events': {
        get: {
          operationId: 'listEvents',
          parameters: [
            { name: 'project_ids[]', in: 'query', required: false, schema: { type: 'string' } },
            { name: 'event_types[]', in: 'query', required: false, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    // Normalized names must be used as TypeScript property names in the params object
    expect(result.content).toContain('projectIds')
    expect(result.content).toContain('eventTypes')
    // Raw names with [] must not appear in generated TypeScript
    expect(result.content).not.toContain('project_ids[]')
    expect(result.content).not.toContain('event_types[]')
  })

  it('path param with hyphens like {job-id}: c.req.param uses raw name from path', () => {
    const spec = makeSpec({
      '/jobs/{job-id}': {
        get: {
          operationId: 'getJob',
          parameters: [{ name: 'job-id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    // c.req.param uses the raw OpenAPI path param name matching the Hono route :job-id
    expect(result.content).toContain("c.req.param('job-id')")
    // The generated code must call the service method
    expect(result.content).toContain('service.getJob(')
  })

  it('mixed path segment "{maxLat}.{format}" (no operationId) does not break method name derivation', () => {
    const spec = makeSpec({
      '/map/{versionNumber}/tile/{maxLon}/{maxLat}.{format}': {
        get: {
          // no operationId — forces deriveOperationName to handle the mixed segment
          parameters: [
            { name: 'versionNumber', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'maxLon', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'maxLat', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'format', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const result = generateRouter(spec)
    // The derived method name must be a valid identifier — no }.{ from mixed segment
    expect(result.content).not.toMatch(/service\.[a-zA-Z]*\}/)
    // A route handler must be generated
    expect(result.content).toContain('app.get(')
  })

  it('service interface reference uses title-derived name', () => {
    const spec = makeSpec({}, 'My API')
    const result = generateRouter(spec)
    expect(result.content).toContain('MyAPIService')
  })
})

// ── Schema validation tests ────────────────────────────────────────────────────

describe('generateRouter with schemaNames (Zod validation)', () => {
  const postSpec = makeSpec({
    '/pets': {
      post: {
        operationId: 'createPet',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePetRequest' } } },
        },
        responses: { '201': { description: 'created' } },
      },
    },
  })

  it('adds safeParse validation when schema is in schemaNames', () => {
    const result = generateRouter(postSpec, {
      schemaNames: new Set(['CreatePetRequestSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).toContain('CreatePetRequestSchema.safeParse(body)')
    expect(result.content).toContain('parseResult.success')
    expect(result.content).toContain('422')
  })

  it('uses validatedBody in service call when schema is present', () => {
    const result = generateRouter(postSpec, {
      schemaNames: new Set(['CreatePetRequestSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).toContain('validatedBody')
    expect(result.content).toContain('service.createPet(validatedBody')
  })

  it('imports z from zod and schema from schemaImportPath', () => {
    const result = generateRouter(postSpec, {
      schemaNames: new Set(['CreatePetRequestSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).toContain("import { z } from 'zod'")
    expect(result.content).toContain("import { CreatePetRequestSchema } from './schemas.js'")
  })

  it('does not import schema when schemaNames does not match the body type', () => {
    const result = generateRouter(postSpec, {
      schemaNames: new Set(['SomeOtherSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).not.toContain("import { z } from 'zod'")
    expect(result.content).not.toContain('safeParse')
  })

  it('does not add validation when options is undefined', () => {
    const result = generateRouter(postSpec)
    expect(result.content).not.toContain('safeParse')
    expect(result.content).not.toContain("import { z } from 'zod'")
    // uses body directly in service call
    expect(result.content).toContain('service.createPet(body')
  })

  it('does not add validation when schemaNames is empty set', () => {
    const result = generateRouter(postSpec, {
      schemaNames: new Set(),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).not.toContain('safeParse')
    expect(result.content).toContain('service.createPet(body')
  })

  it('returns 422 with Zod issues on parse failure', () => {
    const result = generateRouter(postSpec, {
      schemaNames: new Set(['CreatePetRequestSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).toContain("{ error: 'Invalid request body', issues: parseResult.error.issues }")
    expect(result.content).toContain('422')
  })

  it('only imports schemas actually used', () => {
    const specWithTwo = makeSpec({
      '/pets': {
        post: {
          operationId: 'createPet',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePetRequest' } } },
          },
          responses: { '201': { description: 'created' } },
        },
      },
      '/owners': {
        post: {
          operationId: 'createOwner',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOwnerRequest' } } },
          },
          responses: { '201': { description: 'created' } },
        },
      },
    })
    // Only CreatePetRequestSchema in schemaNames, not CreateOwnerRequestSchema
    const result = generateRouter(specWithTwo, {
      schemaNames: new Set(['CreatePetRequestSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).toContain('CreatePetRequestSchema')
    expect(result.content).not.toContain('CreateOwnerRequestSchema')
  })
})
