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

  it('query param name with [] suffix is normalized to a valid TypeScript identifier', () => {
    const spec = makeSpec({
      '/events': {
        get: makeGetOp({
          operationId: 'listEvents',
          queryParams: [
            { name: 'project_ids[]', required: false },
            { name: 'event_types[]', required: false },
          ],
        }),
      },
    })
    const { content } = generateService(spec)
    // [] suffix must be stripped and separators camelCased
    expect(content).toContain('projectIds?:')
    expect(content).toContain('eventTypes?:')
    // Raw names with [] must not appear in generated TypeScript
    expect(content).not.toContain('project_ids[]')
    expect(content).not.toContain('event_types[]')
  })

  it('path param with hyphens like {job-id} is sanitized to a valid TS identifier', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/jobs/{job-id}': {
          get: {
            operationId: 'getJob',
            parameters: [{ name: 'job-id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    }
    const { content } = generateService(spec)
    // The sanitized param name jobId must appear in the method signature
    expect(content).toContain('jobId: string')
    // Raw hyphenated name must not appear as a TS identifier
    expect(content).not.toContain('job-id: string')
  })

  it('mixed path segment "{maxLat}.{format}" (no operationId) does not break method name derivation', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
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
      },
    }
    const { content } = generateService(spec)
    // The method name must be a valid identifier — no brace or dot chars in the method signature
    expect(content).not.toMatch(/  [a-zA-Z]*\}[^*]/)
    // A method must be generated
    expect(content).toContain('versionNumber: string')
    expect(content).toContain('maxLon: string')
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

describe('coverage: requestBody as $ref — body param is omitted from service method', () => {
  it('requestBody $ref produces a service method without a typed body param', () => {
    // Covers the `if (isRef(requestBody)) return { typeName: undefined }` branch in getBodyInfo
    const spec = makeSpec({
      '/items': {
        post: {
          operationId: 'createItem',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          requestBody: { $ref: '#/components/requestBodies/ItemBody' } as any,
          responses: { '201': { description: 'created' } },
        },
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('createItem(')
    // requestBody is a $ref (unresolvable) so body has no named model type — falls back to unknown
    expect(content).toContain('body: unknown')
  })
})

describe('coverage: 200/$ref response — getReturnInfo falls through to void', () => {
  it('$ref 200 response is skipped and return type falls back to Promise<void>', () => {
    // Covers the `if (isRef(response)) continue` branch in getReturnInfo
    const spec = makeSpec({
      '/items/{id}': {
        get: {
          operationId: 'getItem',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          responses: { '200': { $ref: '#/components/responses/ItemResponse' } as any },
        },
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('getItem(')
    expect(content).toContain('Promise<void>')
  })
})

describe('coverage: spec.info without title — service name falls back to ApiService', () => {
  it('spec with no title generates ApiService interface name', () => {
    // Covers the `spec.info?.title ?? ''` null-coalescing branch and `pascal.length === 0` fallback
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { version: '1.0.0' } as OpenAPIV3_1.InfoObject,
      paths: {},
    }
    const { content } = generateService(spec)
    expect(content).toContain('export interface ApiService')
  })
})

describe('coverage: sanitizeOperationId — all-punctuation operationId returns unknown', () => {
  it('operationId consisting entirely of non-alphanumeric characters → unknown method name', () => {
    // Covers `if (parts.length === 0) return 'unknown'` in sanitizeOperationId (service.ts line ~80)
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: '---',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('unknown(')
  })
})

describe('coverage: operationId starting with a digit — prefixed with underscore', () => {
  it('operationId that begins with a digit is prefixed with _ to be a valid JS identifier', () => {
    // Covers the `/^[0-9]/.test(camel) ? `_${camel}` : camel` true branch in sanitizeOperationId
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: '123getItems',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('_123getItems(')
  })
})

describe('coverage: requestBody with no content property in service — body is omitted', () => {
  it('requestBody without content generates a method without a typed body param', () => {
    // Covers `if (content === undefined) return { typeName: undefined }` in getBodyInfo (service.ts)
    const spec = makeSpec({
      '/items': {
        post: {
          operationId: 'createItem',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          requestBody: { required: true } as any, // no content property
          responses: { '201': { description: 'created' } },
        },
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('createItem(')
    expect(content).toContain('body: unknown')
  })
})

describe('coverage: operation with no responses in service — returns Promise<void>', () => {
  it('operation without a responses property generates Promise<void> return type', () => {
    // Covers `if (responses === undefined) return { typeName: undefined, isArray: false, isVoid: true }` in getReturnInfo
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: 'listItems',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any, // no responses property
      },
    })
    const { content } = generateService(spec)
    expect(content).toContain('listItems(')
    expect(content).toContain('Promise<void>')
  })
})

describe('coverage: spec with paths=undefined in service — generates empty interface', () => {
  it('spec without a paths property generates an empty service interface', () => {
    // Covers `if (paths === undefined) return []` in collectOperations (service.ts)
    const spec = {
      openapi: '3.1.0',
      info: { title: 'Empty', version: '1.0.0' },
      // no paths property
    } as OpenAPIV3_1.Document
    const { content } = generateService(spec)
    expect(content).toContain('export interface EmptyService')
    // No method signatures since there are no operations
    expect(content).not.toContain('(')
  })
})

describe('coverage: resolveParamRef — component parameter that is itself a $ref', () => {
  it('parameter component that is a $ref is treated as unresolvable (no expansion)', () => {
    // Covers the `isRef(resolved)` branch in resolveParamRef — double-indirection ref
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/items': {
          get: {
            operationId: 'listItems',
            parameters: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              { $ref: '#/components/parameters/FilterParam' } as any,
            ],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      components: {
        parameters: {
          // This parameter is itself a $ref — double indirection, treated as unresolvable
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          FilterParam: { $ref: '#/components/parameters/BaseFilter' } as any,
        },
      },
    }
    const { content } = generateService(spec)
    // The operation is still generated, just without the unresolvable query param
    expect(content).toContain('listItems(')
  })
})
