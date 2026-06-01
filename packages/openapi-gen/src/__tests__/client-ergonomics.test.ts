/**
 * Behavior tests for #186: signal/timeout, request interceptor + fetch override,
 * and generic ApiError.
 *
 * These tests verify:
 * - The generated client code emits the correct structural patterns
 * - TypeScript types compile correctly for all new API surface
 * - The existing "fetch is called exactly once" invariant is preserved
 */
import { describe, it, expect } from 'vitest'
import ts from 'typescript'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateClient } from '../plugins/client.js'
import { generateClientConfig } from '../plugins/client-config.js'

// ---------------------------------------------------------------------------
// Shared minimal spec used across tests
// ---------------------------------------------------------------------------

const minimalSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Minimal API', version: '1' },
  paths: {
    '/items': {
      get: {
        operationId: 'listItems',
        responses: {
          '200': {
            content: {
              'application/json': { schema: { type: 'array', items: { type: 'string' } } },
            },
          },
        },
      },
      post: {
        operationId: 'createItem',
        requestBody: {
          content: { 'application/json': { schema: { type: 'string' } } },
        },
        responses: {
          '201': { content: { 'application/json': { schema: { type: 'string' } } } },
        },
      },
    },
    '/items/{id}': {
      delete: {
        operationId: 'deleteItem',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'deleted' } },
      },
    },
  },
}

// ---------------------------------------------------------------------------
// TypeScript compilation helper (reused from client.test.ts pattern)
// ---------------------------------------------------------------------------

function compileFiles(files: Record<string, string>): readonly ts.Diagnostic[] {
  const virtualFiles: Record<string, string> = {}
  for (const [name, content] of Object.entries(files)) {
    virtualFiles[`/virtual/${name}`] = content
  }

  const { options } = ts.convertCompilerOptionsFromJson(
    {
      strict: true,
      target: 'ES2025',
      moduleResolution: 'Bundler',
      noEmit: true,
      skipLibCheck: true,
      lib: ['ES2025', 'DOM'],
    },
    '.'
  )

  const fileNames = Object.keys(virtualFiles)
  const defaultHost = ts.createCompilerHost(options)

  const customHost: ts.CompilerHost = {
    ...defaultHost,
    getSourceFile: (name, lang) => {
      if (name in virtualFiles) return ts.createSourceFile(name, virtualFiles[name]!, lang, true)
      return defaultHost.getSourceFile(name, lang)
    },
    fileExists: (name) => name in virtualFiles || defaultHost.fileExists(name),
    readFile: (name) => virtualFiles[name] ?? defaultHost.readFile(name),
    getCurrentDirectory: () => '/virtual',
    resolveModuleNameLiterals: (
      moduleLiterals,
      containingFile,
      redirectedRef,
      compilerOpts,
      containingSf,
      reusedNames
    ) => {
      return moduleLiterals.map((lit) => {
        const specifier = lit.text
        if (specifier.startsWith('./') || specifier.startsWith('../')) {
          const dir = containingFile.replace(/\/[^/]*$/, '')
          const baseName = specifier.replace(/^\.\//, '').replace(/\.js$/, '')
          const candidates = [`${dir}/${baseName}.ts`, `${dir}/${baseName}/index.ts`]
          for (const cand of candidates) {
            if (cand in virtualFiles) {
              return {
                resolvedModule: {
                  resolvedFileName: cand,
                  isExternalLibraryImport: false,
                  extension: ts.Extension.Ts,
                },
              }
            }
          }
        }
        if (defaultHost.resolveModuleNameLiterals) {
          return defaultHost.resolveModuleNameLiterals(
            [lit],
            containingFile,
            redirectedRef,
            compilerOpts,
            containingSf,
            reusedNames
          )[0]!
        }
        return { resolvedModule: undefined }
      })
    },
  }

  const program = ts.createProgram(fileNames, options, customHost)
  return ts
    .getPreEmitDiagnostics(program)
    .filter((d) => d.file?.fileName !== undefined && d.file.fileName in virtualFiles)
}

function assertNoTsErrors(files: Record<string, string>): void {
  const diagnostics = compileFiles(files)
  if (diagnostics.length > 0) {
    const messages = diagnostics
      .map(
        (d) =>
          `${d.file?.fileName}:${d.start} — ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`
      )
      .join('\n')
    throw new Error(`TypeScript errors:\n${messages}`)
  }
}

// ---------------------------------------------------------------------------
// 1. ClientConfig interface — new fields emitted
// ---------------------------------------------------------------------------

describe('ClientConfig: new ergonomic fields', () => {
  const configContent = generateClientConfig().content

  it('emits signal? field for default per-client abort signal', () => {
    expect(configContent).toContain('signal?: AbortSignal')
  })

  it('emits timeout? field for default request timeout', () => {
    expect(configContent).toContain('timeout?: number')
  })

  it('emits onRequest? interceptor field', () => {
    expect(configContent).toContain('onRequest?')
    // Verify it accepts the { url, init } shape
    expect(configContent).toContain('url: string')
    expect(configContent).toContain('init: RequestInit')
  })

  it('onRequest? can return void, sync overrides, or a Promise', () => {
    expect(configContent).toContain('void |')
    expect(configContent).toContain('Promise<')
  })

  it('emits fetch? override field typed as typeof globalThis.fetch', () => {
    expect(configContent).toContain('fetch?: typeof globalThis.fetch')
  })

  it('generated ClientConfig compiles without TypeScript errors', () => {
    assertNoTsErrors({ 'client-config.ts': configContent })
  })
})

// ---------------------------------------------------------------------------
// 2. Generated _request helper — structural patterns
// ---------------------------------------------------------------------------

describe('generated _request: structural patterns for signal/timeout/onRequest/fetch', () => {
  const clientContent = generateClient(minimalSpec).content

  it('_request opts include signal?: AbortSignal', () => {
    // The signal field lives in opts so it can be passed per-call via config.signal
    expect(clientContent).toContain('signal?: AbortSignal')
  })

  it('_request destructures signal, timeout, onRequest, fetch from config', () => {
    expect(clientContent).toContain('signal: _cfgSignal')
    expect(clientContent).toContain('timeout')
    expect(clientContent).toContain('onRequest')
    expect(clientContent).toContain('fetch: _configFetch')
  })

  it('_request resolves fetch override at call time via globalThis.fetch fallback', () => {
    // Critical: resolved at call time so test mocks of globalThis.fetch are honored
    expect(clientContent).toContain('const fetch = _configFetch ?? globalThis.fetch')
  })

  it('_request calls onRequest interceptor before the fetch call', () => {
    expect(clientContent).toContain('if (onRequest) {')
    expect(clientContent).toContain('await onRequest({ url: _url, init: _init })')
  })

  it('onRequest result url override is applied', () => {
    expect(clientContent).toContain('if (_or.url !== undefined) _url = _or.url')
  })

  it('onRequest result init override is merged', () => {
    expect(clientContent).toContain('if (_or.init !== undefined) _init = { ..._init, ..._or.init }')
  })

  it('_request combines opts.signal and config signal via _rawSignal', () => {
    expect(clientContent).toContain('const _rawSignal = opts.signal ?? _cfgSignal')
  })

  it('_buildSignal helper is emitted in the generated client', () => {
    expect(clientContent).toContain('function _buildSignal(')
  })

  it('_buildSignal uses AbortSignal.timeout for the timeout signal', () => {
    expect(clientContent).toContain('AbortSignal.timeout(timeout)')
  })

  it('_buildSignal uses AbortSignal.any when available', () => {
    expect(clientContent).toContain('AbortSignal.any([signal, _ts])')
  })

  it('_buildSignal has a fallback for environments without AbortSignal.any', () => {
    expect(clientContent).toContain('new AbortController()')
  })

  it('_resolvedSignal is applied to _init before the fetch call', () => {
    expect(clientContent).toContain('_init = { ..._init, signal: _resolvedSignal }')
  })

  it('fetch is called exactly once (only inside _request) — invariant preserved', () => {
    const count = (clientContent.match(/await fetch\(/g) ?? []).length
    expect(count).toBe(1)
  })

  it('_url and _init are mutable variables (let) to allow onRequest mutation', () => {
    expect(clientContent).toContain('let _url = url')
    expect(clientContent).toContain('let _init: RequestInit = {')
  })
})

// ---------------------------------------------------------------------------
// 3. Generic ApiError
// ---------------------------------------------------------------------------

describe('ApiError generic type', () => {
  const clientContent = generateClient(minimalSpec).content

  it('ApiError is generic with Status and Body type parameters', () => {
    expect(clientContent).toContain(
      'export class ApiError<Status extends number = number, Body = unknown> extends Error'
    )
  })

  it('status field is typed as Status (the generic parameter)', () => {
    expect(clientContent).toContain('public readonly status: Status')
  })

  it('body field is typed as Body (the generic parameter)', () => {
    expect(clientContent).toContain('public readonly body: Body')
  })

  it('default type params keep ApiError<number, unknown> back-compat', () => {
    // When used without type args, status is number and body is unknown
    const usageContent = `
import { listItems, ApiError } from './client'

async function example() {
  try {
    await listItems()
  } catch (err) {
    if (err instanceof ApiError) {
      const status: number = err.status
      const body: unknown = err.body
      return { status, body }
    }
  }
}
`
    assertNoTsErrors({
      'client-config.ts': generateClientConfig().content,
      'client.ts': clientContent,
      'usage.ts': usageContent,
    })
  })

  it('ApiError can be narrowed with typed status and body parameters', () => {
    // Typed ApiError: status is literal 404, body is { message: string }
    const usageContent = `
import { ApiError } from './client'

function handleError(err: ApiError<404, { message: string }>) {
  const status: 404 = err.status
  const msg: string = err.body.message
  return { status, msg }
}

// Construction with typed params
const typed = new ApiError<404, { message: string }>(404, { message: 'Not found' })
const _s: 404 = typed.status
const _b: { message: string } = typed.body
`
    assertNoTsErrors({
      'client-config.ts': generateClientConfig().content,
      'client.ts': clientContent,
      'usage.ts': usageContent,
    })
  })
})

// ---------------------------------------------------------------------------
// 4. TypeScript: signal + timeout + onRequest + fetch override compile correctly
// ---------------------------------------------------------------------------

describe('TypeScript: new ClientConfig fields compile in usage', () => {
  const clientContent = generateClient(minimalSpec).content
  const configContent = generateClientConfig().content

  it('signal passed via per-call config compiles', () => {
    const usageContent = `
import { listItems } from './client'

async function example() {
  const ctrl = new AbortController()
  const items = await listItems({ signal: ctrl.signal })
  return items
}
`
    assertNoTsErrors({
      'client-config.ts': configContent,
      'client.ts': clientContent,
      'usage.ts': usageContent,
    })
  })

  it('timeout passed via per-call config compiles', () => {
    const usageContent = `
import { listItems } from './client'

async function example() {
  const items = await listItems({ timeout: 5000 })
  return items
}
`
    assertNoTsErrors({
      'client-config.ts': configContent,
      'client.ts': clientContent,
      'usage.ts': usageContent,
    })
  })

  it('onRequest interceptor returning void compiles', () => {
    const usageContent = `
import { configureClient } from './client-config'

configureClient({
  baseUrl: 'https://api.example.com',
  onRequest: ({ url, init }) => {
    console.log('request to', url, init.method)
    // returning void is valid
  },
})
`
    assertNoTsErrors({ 'client-config.ts': configContent, 'usage.ts': usageContent })
  })

  it('onRequest interceptor returning url override compiles', () => {
    const usageContent = `
import { configureClient } from './client-config'

configureClient({
  baseUrl: 'https://api.example.com',
  onRequest: ({ url }) => ({ url: url + '?trace=1' }),
})
`
    assertNoTsErrors({ 'client-config.ts': configContent, 'usage.ts': usageContent })
  })

  it('onRequest interceptor returning init override compiles', () => {
    const usageContent = `
import { configureClient } from './client-config'

configureClient({
  baseUrl: 'https://api.example.com',
  onRequest: ({ url, init }) => ({
    init: { ...init, headers: { ...init.headers, 'X-Request-Id': 'abc' } },
  }),
})
`
    assertNoTsErrors({ 'client-config.ts': configContent, 'usage.ts': usageContent })
  })

  it('async onRequest interceptor returning Promise compiles', () => {
    const usageContent = `
import { configureClient } from './client-config'

configureClient({
  baseUrl: 'https://api.example.com',
  onRequest: async ({ url, init }) => {
    const token = await Promise.resolve('refreshed-token')
    return { init: { ...init, headers: { ...init.headers, Authorization: \`Bearer \${token}\` } } }
  },
})
`
    assertNoTsErrors({ 'client-config.ts': configContent, 'usage.ts': usageContent })
  })

  it('custom fetch override compiles', () => {
    const usageContent = `
import { configureClient } from './client-config'

const myFetch: typeof globalThis.fetch = async (url, init) => {
  console.log('fetching', url)
  return globalThis.fetch(url, init)
}

configureClient({
  baseUrl: 'https://api.example.com',
  fetch: myFetch,
})
`
    assertNoTsErrors({ 'client-config.ts': configContent, 'usage.ts': usageContent })
  })

  it('fetch override passed per-call via config compiles', () => {
    const usageContent = `
import { listItems } from './client'

const mockFetch: typeof globalThis.fetch = () =>
  Promise.resolve(new Response(JSON.stringify([]), { status: 200 }))

async function example() {
  const items = await listItems({ fetch: mockFetch })
  return items
}
`
    assertNoTsErrors({
      'client-config.ts': configContent,
      'client.ts': clientContent,
      'usage.ts': usageContent,
    })
  })

  it('combining signal + timeout + onRequest + fetch in one config compiles', () => {
    const usageContent = `
import { listItems } from './client'

async function example() {
  const ctrl = new AbortController()
  const items = await listItems({
    signal: ctrl.signal,
    timeout: 3000,
    onRequest: ({ url }) => ({ url: url + '?v=2' }),
    fetch: globalThis.fetch,
  })
  return items
}
`
    assertNoTsErrors({
      'client-config.ts': configContent,
      'client.ts': clientContent,
      'usage.ts': usageContent,
    })
  })
})

// ---------------------------------------------------------------------------
// 5. _buildSignal emitted helper: structural correctness
// ---------------------------------------------------------------------------

describe('_buildSignal helper: emitted code structure', () => {
  const clientContent = generateClient(minimalSpec).content

  it('returns undefined when neither signal nor timeout is provided', () => {
    // The emitted code: if (timeout === undefined) return signal
    // When signal is also undefined, returns undefined
    expect(clientContent).toContain('if (timeout === undefined) return signal')
  })

  it('returns a timeout signal when only timeout is provided', () => {
    // When signal is undefined: return _ts (AbortSignal.timeout result)
    expect(clientContent).toContain('if (signal === undefined) return _ts')
  })

  it('combines signals with AbortSignal.any when available', () => {
    expect(clientContent).toContain(
      "if (typeof AbortSignal.any === 'function') return AbortSignal.any([signal, _ts])"
    )
  })

  it('falls back to AbortController for environments without AbortSignal.any', () => {
    expect(clientContent).toContain('const _ctrl = new AbortController()')
    expect(clientContent).toContain('return _ctrl.signal')
  })
})

// ---------------------------------------------------------------------------
// 6. _requestForm also gets signal/onRequest/fetch (multipart specs)
// ---------------------------------------------------------------------------

const multipartSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Upload API', version: '1' },
  paths: {
    '/upload': {
      post: {
        operationId: 'uploadFile',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: { file: { type: 'string', format: 'binary' } },
              },
            },
          },
        },
        responses: { '201': { description: 'uploaded' } },
      },
    },
  },
}

describe('_requestForm: signal/onRequest/fetch also applied to multipart helper', () => {
  const clientContent = generateClient(multipartSpec).content

  it('_requestForm opts include signal?: AbortSignal', () => {
    expect(clientContent).toContain('async function _requestForm(')
    // signal should appear in the _requestForm body (opts or config destructure)
    expect(clientContent).toContain('signal: _cfgSignal')
  })

  it('_requestForm also resolves fetch via globalThis fallback', () => {
    // Only one `await fetch(` should exist (inside _requestForm, _request is absent for multipart-only spec)
    expect(clientContent).toContain('const fetch = _configFetch ?? globalThis.fetch')
  })

  it('_requestForm also calls onRequest interceptor', () => {
    expect(clientContent).toContain('if (onRequest) {')
    expect(clientContent).toContain('await onRequest({ url: _url, init: _init })')
  })

  it('fetch appears exactly once per helper in multipart spec (_request + _requestForm = 2)', () => {
    // Both _request and _requestForm are emitted — each calls fetch exactly once.
    // The important invariant: no endpoint function duplicates the fetch call.
    const count = (clientContent.match(/await fetch\(/g) ?? []).length
    expect(count).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// 7. Full TypeScript compilation: generated client with all new fields
// ---------------------------------------------------------------------------

describe('full TypeScript compilation with new ergonomic features', () => {
  it('minimal spec client compiles without errors', () => {
    assertNoTsErrors({
      'client-config.ts': generateClientConfig().content,
      'client.ts': generateClient(minimalSpec).content,
    })
  })

  it('multipart spec client compiles without errors', () => {
    assertNoTsErrors({
      'client-config.ts': generateClientConfig().content,
      'client.ts': generateClient(multipartSpec).content,
    })
  })

  it('bearer auth spec client compiles without errors', () => {
    const bearerSpec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Bearer API', version: '1' },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          // @ts-expect-error — OpenAPI types lag on http security scheme shape
          bearerAuth: { type: 'http', scheme: 'bearer' },
        },
      },
      paths: {
        '/me': {
          get: {
            operationId: 'getMe',
            responses: {
              '200': { content: { 'application/json': { schema: { type: 'string' } } } },
            },
          },
        },
      },
    }
    assertNoTsErrors({
      'client-config.ts': generateClientConfig().content,
      'client.ts': generateClient(bearerSpec).content,
    })
  })
})
