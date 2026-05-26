import { describe, expect, it } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateService } from '../plugins/service.js'

// ── Fixture helpers ────────────────────────────────────────────────────────────

function makeSpec(paths: OpenAPIV3_1.PathsObject, title = 'Test API'): OpenAPIV3_1.Document {
  return {
    openapi: '3.1.0',
    info: { title, version: '1.0.0' },
    paths,
  }
}

function makeGetOp(opts: {
  operationId?: string
  pathParams?: string[]
  queryParams?: { name: string; required: boolean; type?: string }[]
  responseRef?: string
  responseArray?: boolean
}): OpenAPIV3_1.OperationObject {
  const parameters: OpenAPIV3_1.ParameterObject[] = []

  for (const p of opts.pathParams ?? []) {
    parameters.push({ name: p, in: 'path', required: true, schema: { type: 'string' } })
  }

  for (const q of opts.queryParams ?? []) {
    parameters.push({
      name: q.name,
      in: 'query',
      required: q.required,
      schema: { type: (q.type ?? 'string') as 'string' | 'integer' },
    })
  }

  let responseSchema: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject | undefined
  if (opts.responseRef !== undefined) {
    if (opts.responseArray) {
      responseSchema = { type: 'array', items: { $ref: `#/components/schemas/${opts.responseRef}` } }
    } else {
      responseSchema = { $ref: `#/components/schemas/${opts.responseRef}` }
    }
  }

  return {
    operationId: opts.operationId,
    parameters,
    responses: responseSchema !== undefined
      ? {
          '200': {
            description: 'ok',
            content: { 'application/json': { schema: responseSchema } },
          },
        }
      : { '200': { description: 'ok' } },
  }
}

function makePostOp(opts: {
  operationId?: string
  bodyRef?: string
  responseRef?: string
  responseStatus?: '200' | '201'
}): OpenAPIV3_1.OperationObject {
  const requestBody: OpenAPIV3_1.RequestBodyObject | undefined = opts.bodyRef !== undefined
    ? {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${opts.bodyRef}` },
          },
        },
      }
    : undefined

  const status = opts.responseStatus ?? '201'
  const responseSchema: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject | undefined = opts.responseRef !== undefined
    ? { $ref: `#/components/schemas/${opts.responseRef}` }
    : undefined

  return {
    operationId: opts.operationId,
    requestBody,
    responses: responseSchema !== undefined
      ? {
          [status]: {
            description: 'created',
            content: { 'application/json': { schema: responseSchema } },
          },
        }
      : { [status]: { description: 'created' } },
  }
}

function makeDeleteOp(operationId?: string): OpenAPIV3_1.OperationObject {
  return {
    operationId,
    responses: { '204': { description: 'deleted' } },
  }
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('generateService', () => {
  it('output always starts with auto-generated header comment', () => {
    const spec = makeSpec({ '/pets': { get: makeGetOp({ operationId: 'listPets' }) } })
    const { content } = generateService(spec)
    expect(content).toMatch(/^\/\/ This file is auto-generated/)
  })

  it('filename is always service.ts', () => {
    const spec = makeSpec({ '/pets': { get: makeGetOp({ operationId: 'listPets' }) } })
    const { filename } = generateService(spec)
    expect(filename).toBe('service.ts')
  })

  it('derives interface name from spec title', () => {
    const spec = makeSpec({}, 'Pet Store')
    const { content } = generateService(spec)
    expect(content).toContain('export interface PetStoreService {')
  })

  it('uses ApiService as fallback when title is empty', () => {
    const spec = makeSpec({}, '')
    const { content } = generateService(spec)
    expect(content).toContain('export interface ApiService {')
  })

  it('produces empty interface for spec with no operations', () => {
    const spec = makeSpec({})
    const { content } = generateService(spec)
    expect(content).toContain('export interface TestAPIService {')
    expect(content).toContain('}')
  })

  it('basic GET produces correct method signature', () => {
    const spec = makeSpec({ '/pets': { get: makeGetOp({ operationId: 'listPets' }) } })
    const { content } = generateService(spec)
    expect(content).toContain('listPets(): Promise<void>')
  })

  it('GET with typed response reference produces correct return type', () => {
    const spec = makeSpec({ '/pets': { get: makeGetOp({ operationId: 'listPets', responseRef: 'Pet', responseArray: true }) } })
    const { content } = generateService(spec)
    expect(content).toContain('listPets(): Promise<Pet[]>')
  })

  it('GET with single object response produces Promise<TypeName>', () => {
    const spec = makeSpec({ '/pets/{id}': { get: makeGetOp({ operationId: 'getPet', pathParams: ['id'], responseRef: 'Pet' }) } })
    const { content } = generateService(spec)
    expect(content).toContain('getPet(id: string): Promise<Pet>')
  })

  it('imports types from ./models.js when response type is named', () => {
    const spec = makeSpec({ '/pets': { get: makeGetOp({ operationId: 'listPets', responseRef: 'Pet', responseArray: true }) } })
    const { content } = generateService(spec)
    expect(content).toContain("import type { Pet } from './models.js'")
  })

  it('no import statement when no named types used', () => {
    const spec = makeSpec({ '/pets': { get: makeGetOp({ operationId: 'listPets' }) } })
    const { content } = generateService(spec)
    expect(content).not.toContain('import type')
  })

  it('path params become positional string args', () => {
    const spec = makeSpec({
      '/pets/{id}': {
        get: makeGetOp({ operationId: 'getPet', pathParams: ['id'] }),
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('getPet(id: string)')
  })

  it('multiple path params in template order', () => {
    const spec = makeSpec({
      '/owners/{ownerId}/pets/{petId}': {
        get: makeGetOp({ operationId: 'getOwnerPet', pathParams: ['ownerId', 'petId'] }),
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('getOwnerPet(ownerId: string, petId: string)')
  })

  it('optional query params become params? object', () => {
    const spec = makeSpec({
      '/pets': {
        get: makeGetOp({
          operationId: 'listPets',
          queryParams: [
            { name: 'species', required: false },
            { name: 'limit', required: false },
          ],
        }),
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('params?: {')
    expect(content).toContain('species?: string')
    expect(content).toContain('limit?: string')
  })

  it('required query param makes params required', () => {
    const spec = makeSpec({
      '/pets': {
        get: makeGetOp({
          operationId: 'listPets',
          queryParams: [
            { name: 'species', required: true },
            { name: 'limit', required: false },
          ],
        }),
      },
    })
    const { content } = generateService(spec)
    // params should be required (no ?) because at least one query param is required
    expect(content).toContain('params: {')
    expect(content).toContain('species: string')
    expect(content).toContain('limit?: string')
  })

  it('POST with requestBody produces body param', () => {
    const spec = makeSpec({
      '/pets': {
        post: makePostOp({ operationId: 'createPet', bodyRef: 'CreatePetRequest', responseRef: 'Pet' }),
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('createPet(body: CreatePetRequest): Promise<Pet>')
  })

  it('POST with body imports body type from models.js', () => {
    const spec = makeSpec({
      '/pets': {
        post: makePostOp({ operationId: 'createPet', bodyRef: 'CreatePetRequest', responseRef: 'Pet' }),
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain("import type { CreatePetRequest, Pet } from './models.js'")
  })

  it('DELETE with 204 response returns Promise<void>', () => {
    const spec = makeSpec({
      '/pets/{id}': {
        delete: makeDeleteOp('deletePet'),
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('deletePet(id: string): Promise<void>')
  })

  it('multiple operations produce multiple methods', () => {
    const spec = makeSpec({
      '/pets': {
        get: makeGetOp({ operationId: 'listPets' }),
        post: makePostOp({ operationId: 'createPet', bodyRef: 'CreatePetRequest' }),
      },
      '/pets/{id}': {
        get: makeGetOp({ operationId: 'getPet', pathParams: ['id'] }),
        delete: makeDeleteOp('deletePet'),
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('listPets()')
    expect(content).toContain('createPet(')
    expect(content).toContain('getPet(id: string)')
    expect(content).toContain('deletePet(id: string)')
  })

  it('includes JSDoc comment with HTTP method and path', () => {
    const spec = makeSpec({ '/pets': { get: makeGetOp({ operationId: 'listPets' }) } })
    const { content } = generateService(spec)
    expect(content).toContain('/** GET /pets */')
  })

  it('falls back to derived name when no operationId', () => {
    const spec = makeSpec({ '/pets': { get: makeGetOp({}) } })
    const { content } = generateService(spec)
    expect(content).toContain('getPets(')
  })

  it('path param comes before body arg', () => {
    const spec = makeSpec({
      '/pets/{id}': {
        put: {
          operationId: 'updatePet',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePetRequest' } } },
          },
          responses: { '200': { description: 'ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pet' } } } } },
        },
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('updatePet(id: string, body: UpdatePetRequest)')
  })

  it('deduplicates type imports and sorts alphabetically', () => {
    const spec = makeSpec({
      '/pets': {
        post: makePostOp({ operationId: 'createPet', bodyRef: 'Pet', responseRef: 'Pet' }),
      },
    })
    const { content } = generateService(spec)
    // Pet should appear only once in import
    const importMatch = content.match(/import type \{([^}]+)\}/)
    expect(importMatch).not.toBeNull()
    const importNames = importMatch![1]!.split(',').map((s) => s.trim())
    const petCount = importNames.filter((n) => n === 'Pet').length
    expect(petCount).toBe(1)
  })
})
