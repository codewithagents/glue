/**
 * Tests for structured auth scheme detection and correct credential placement (issue #183).
 *
 * The generated client must emit the correct header/query credential per the declared
 * securityScheme, instead of always emitting `Authorization: Bearer`:
 *   - http bearer         -> `Authorization: Bearer <token>`  (existing behavior)
 *   - http basic          -> `Authorization: Basic <base64(user:pass)>`
 *   - apiKey in: header   -> the declared header name (e.g. `X-API-Key: <key>`)
 *   - apiKey in: query    -> the declared query param appended to the URL
 *
 * All specs below are fictional and do not represent real or internal APIs.
 */
import { describe, it, expect } from 'vitest'
import { generateClient, detectAuthSchemes } from '../plugins/client.js'
import { generateClientConfig } from '../plugins/client-config.js'
import { generateTypes } from '../plugins/types.js'
import type { OpenAPIV3_1 } from 'openapi-types'
import ts from 'typescript'

// ---------------------------------------------------------------------------
// Shared TypeScript compilation helper
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

// ---------------------------------------------------------------------------
// Fictional spec fixtures
// ---------------------------------------------------------------------------

/** Fictional API secured with a custom apiKey in a header named 'X-API-Key'. */
const apiKeyHeaderSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional Key API', version: '1' },
  security: [{ ApiKeyAuth: [] }],
  components: {
    securitySchemes: {
      // @ts-expect-error — OpenAPI types lag on apiKey security scheme shape
      ApiKeyAuth: { type: 'apiKey', name: 'X-API-Key', in: 'header' },
    },
  },
  paths: {
    '/items': {
      get: {
        operationId: 'listItems',
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'string' } } } },
        },
      },
    },
  },
}

/** Fictional API secured with a custom apiKey in a query param named 'api_key'. */
const apiKeyQuerySpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional Query-Key API', version: '1' },
  security: [{ QueryKeyAuth: [] }],
  components: {
    securitySchemes: {
      // @ts-expect-error — OpenAPI types lag on apiKey security scheme shape
      QueryKeyAuth: { type: 'apiKey', name: 'api_key', in: 'query' },
    },
  },
  paths: {
    '/data': {
      get: {
        operationId: 'getData',
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'string' } } } },
        },
      },
    },
  },
}

/** Fictional API secured with HTTP Basic auth. */
const basicAuthSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional Basic API', version: '1' },
  security: [{ BasicAuth: [] }],
  components: {
    securitySchemes: {
      // @ts-expect-error — OpenAPI types lag on http security scheme shape
      BasicAuth: { type: 'http', scheme: 'basic' },
    },
  },
  paths: {
    '/profile': {
      get: {
        operationId: 'getProfile',
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'string' } } } },
        },
      },
    },
  },
}

/** Fictional API secured with both apiKey-header and basic auth (OR logic). */
const mixedAuthSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional Mixed Auth API', version: '1' },
  paths: {
    '/orders': {
      get: {
        operationId: 'listOrders',
        security: [{ ApiKeyAuth: [] }, { BasicAuth: [] }],
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'string' } } } },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      // @ts-expect-error — OpenAPI types lag on apiKey security scheme shape
      ApiKeyAuth: { type: 'apiKey', name: 'X-API-Key', in: 'header' },
      // @ts-expect-error — OpenAPI types lag on http security scheme shape
      BasicAuth: { type: 'http', scheme: 'basic' },
    },
  },
}

/** Fictional API with HTTP Bearer auth (existing behavior must not change). */
const bearerSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional Bearer API', version: '1' },
  security: [{ BearerAuth: [] }],
  components: {
    securitySchemes: {
      // @ts-expect-error — OpenAPI types lag on http security scheme shape
      BearerAuth: { type: 'http', scheme: 'bearer' },
    },
  },
  paths: {
    '/tasks': {
      get: {
        operationId: 'listTasks',
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'string' } } } },
        },
      },
    },
  },
}

// ---------------------------------------------------------------------------
// detectAuthSchemes: unit tests for scheme classification
// ---------------------------------------------------------------------------

describe('detectAuthSchemes: apiKey in header', () => {
  it('returns the declared header name in apiKeyHeaderNames', () => {
    const result = detectAuthSchemes(apiKeyHeaderSpec)
    expect(result.apiKeyHeaderNames).toEqual(['X-API-Key'])
  })

  it('does not set hasBearerOrOAuth', () => {
    const result = detectAuthSchemes(apiKeyHeaderSpec)
    expect(result.hasBearerOrOAuth).toBe(false)
  })

  it('does not set hasBasicAuth', () => {
    const result = detectAuthSchemes(apiKeyHeaderSpec)
    expect(result.hasBasicAuth).toBe(false)
  })

  it('apiKeyQueryNames is empty', () => {
    const result = detectAuthSchemes(apiKeyHeaderSpec)
    expect(result.apiKeyQueryNames).toHaveLength(0)
  })
})

describe('detectAuthSchemes: apiKey in query', () => {
  it('returns the declared query param name in apiKeyQueryNames', () => {
    const result = detectAuthSchemes(apiKeyQuerySpec)
    expect(result.apiKeyQueryNames).toEqual(['api_key'])
  })

  it('does not set hasBearerOrOAuth', () => {
    const result = detectAuthSchemes(apiKeyQuerySpec)
    expect(result.hasBearerOrOAuth).toBe(false)
  })

  it('apiKeyHeaderNames is empty', () => {
    const result = detectAuthSchemes(apiKeyQuerySpec)
    expect(result.apiKeyHeaderNames).toHaveLength(0)
  })
})

describe('detectAuthSchemes: http basic', () => {
  it('sets hasBasicAuth to true', () => {
    const result = detectAuthSchemes(basicAuthSpec)
    expect(result.hasBasicAuth).toBe(true)
  })

  it('does not set hasBearerOrOAuth', () => {
    const result = detectAuthSchemes(basicAuthSpec)
    expect(result.hasBearerOrOAuth).toBe(false)
  })
})

describe('detectAuthSchemes: http bearer (must not regress)', () => {
  it('sets hasBearerOrOAuth to true', () => {
    const result = detectAuthSchemes(bearerSpec)
    expect(result.hasBearerOrOAuth).toBe(true)
  })

  it('does not set hasBasicAuth', () => {
    const result = detectAuthSchemes(bearerSpec)
    expect(result.hasBasicAuth).toBe(false)
  })

  it('apiKeyHeaderNames and apiKeyQueryNames are empty', () => {
    const result = detectAuthSchemes(bearerSpec)
    expect(result.apiKeyHeaderNames).toHaveLength(0)
    expect(result.apiKeyQueryNames).toHaveLength(0)
  })
})

describe('detectAuthSchemes: mixed auth (apiKey header + basic)', () => {
  it('includes both apiKey header name and hasBasicAuth', () => {
    const result = detectAuthSchemes(mixedAuthSpec)
    expect(result.apiKeyHeaderNames).toContain('X-API-Key')
    expect(result.hasBasicAuth).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Generated _request helper: apiKey in header
// ---------------------------------------------------------------------------

describe('generated client: apiKey-in-header emits correct header injection', () => {
  it('emits the declared header name (X-API-Key), not Authorization: Bearer', () => {
    const out = generateClient(apiKeyHeaderSpec).content
    // JSON.stringify produces double-quoted key in the generated source
    expect(out).toContain('"X-API-Key": resolvedApiKey')
    expect(out).not.toContain('Authorization: `Bearer')
  })

  it('resolves apiKey from config (async-capable)', () => {
    const out = generateClient(apiKeyHeaderSpec).content
    expect(out).toContain("resolvedApiKey = typeof apiKey === 'function' ? await apiKey() : apiKey")
  })

  it('does not emit resolvedToken', () => {
    const out = generateClient(apiKeyHeaderSpec).content
    expect(out).not.toContain('resolvedToken')
  })

  it('does not emit resolvedBasic', () => {
    const out = generateClient(apiKeyHeaderSpec).content
    expect(out).not.toContain('resolvedBasic')
  })

  it('compiles without TypeScript errors', () => {
    const diagnostics = compileFiles({
      'models.ts': generateTypes(apiKeyHeaderSpec).content,
      'client-config.ts': generateClientConfig({ authSchemes: detectAuthSchemes(apiKeyHeaderSpec) })
        .content,
      'client.ts': generateClient(apiKeyHeaderSpec).content,
    })

    if (diagnostics.length > 0) {
      const msgs = diagnostics
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
        .join('\n')
      throw new Error(`TS errors in apiKey-header client:\n${msgs}`)
    }
    expect(diagnostics.length).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Generated _request helper: apiKey in query
// ---------------------------------------------------------------------------

describe('generated client: apiKey-in-query appends query param to URL', () => {
  it('creates URLSearchParams copy (_sp) and sets the declared param name', () => {
    const out = generateClient(apiKeyQuerySpec).content
    expect(out).toContain('_sp')
    // JSON.stringify produces double-quoted param name in the generated source
    expect(out).toContain('_sp.set("api_key", resolvedApiKey)')
  })

  it('does not emit Authorization: Bearer', () => {
    const out = generateClient(apiKeyQuerySpec).content
    expect(out).not.toContain('Authorization: `Bearer')
  })

  it('does not emit resolvedToken', () => {
    const out = generateClient(apiKeyQuerySpec).content
    expect(out).not.toContain('resolvedToken')
  })

  it('compiles without TypeScript errors', () => {
    const diagnostics = compileFiles({
      'models.ts': generateTypes(apiKeyQuerySpec).content,
      'client-config.ts': generateClientConfig({ authSchemes: detectAuthSchemes(apiKeyQuerySpec) })
        .content,
      'client.ts': generateClient(apiKeyQuerySpec).content,
    })

    if (diagnostics.length > 0) {
      const msgs = diagnostics
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
        .join('\n')
      throw new Error(`TS errors in apiKey-query client:\n${msgs}`)
    }
    expect(diagnostics.length).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Generated _request helper: http basic
// ---------------------------------------------------------------------------

describe('generated client: http basic emits Authorization: Basic', () => {
  it('emits Authorization: Basic with btoa encoding', () => {
    const out = generateClient(basicAuthSpec).content
    expect(out).toContain(
      'Authorization: `Basic ${btoa(`${resolvedBasic.username}:${resolvedBasic.password}`)}`'
    )
  })

  it('resolves basicAuth from config (async-capable)', () => {
    const out = generateClient(basicAuthSpec).content
    expect(out).toContain(
      "resolvedBasic = typeof basicAuth === 'function' ? await basicAuth() : basicAuth"
    )
  })

  it('does not emit Authorization: Bearer', () => {
    const out = generateClient(basicAuthSpec).content
    expect(out).not.toContain('Authorization: `Bearer')
  })

  it('does not emit resolvedToken', () => {
    const out = generateClient(basicAuthSpec).content
    expect(out).not.toContain('resolvedToken')
  })

  it('compiles without TypeScript errors', () => {
    const diagnostics = compileFiles({
      'models.ts': generateTypes(basicAuthSpec).content,
      'client-config.ts': generateClientConfig({ authSchemes: detectAuthSchemes(basicAuthSpec) })
        .content,
      'client.ts': generateClient(basicAuthSpec).content,
    })

    if (diagnostics.length > 0) {
      const msgs = diagnostics
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
        .join('\n')
      throw new Error(`TS errors in basic-auth client:\n${msgs}`)
    }
    expect(diagnostics.length).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Generated _request helper: bearer (must not regress)
// ---------------------------------------------------------------------------

describe('generated client: http bearer still emits Authorization: Bearer (no regression)', () => {
  it('emits Authorization: Bearer ${resolvedToken}', () => {
    const out = generateClient(bearerSpec).content
    expect(out).toContain('Authorization: `Bearer ${resolvedToken}`')
  })

  it('resolves token from config', () => {
    const out = generateClient(bearerSpec).content
    expect(out).toContain("resolvedToken = typeof token === 'function' ? await token() : token")
  })

  it('does not emit resolvedBasic or resolvedApiKey', () => {
    const out = generateClient(bearerSpec).content
    expect(out).not.toContain('resolvedBasic')
    expect(out).not.toContain('resolvedApiKey')
  })

  it('compiles without TypeScript errors', () => {
    const diagnostics = compileFiles({
      'models.ts': generateTypes(bearerSpec).content,
      'client-config.ts': generateClientConfig({ authSchemes: detectAuthSchemes(bearerSpec) })
        .content,
      'client.ts': generateClient(bearerSpec).content,
    })

    if (diagnostics.length > 0) {
      const msgs = diagnostics
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
        .join('\n')
      throw new Error(`TS errors in bearer client:\n${msgs}`)
    }
    expect(diagnostics.length).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Generated _request helper: mixed auth (apiKey header + basic)
// ---------------------------------------------------------------------------

describe('generated client: mixed auth emits both credential paths', () => {
  it('emits both X-API-Key header and Authorization: Basic', () => {
    const out = generateClient(mixedAuthSpec).content
    // JSON.stringify produces double-quoted key in the generated source
    expect(out).toContain('"X-API-Key": resolvedApiKey')
    expect(out).toContain(
      'Authorization: `Basic ${btoa(`${resolvedBasic.username}:${resolvedBasic.password}`)}`'
    )
  })

  it('does not emit Authorization: Bearer', () => {
    const out = generateClient(mixedAuthSpec).content
    expect(out).not.toContain('Authorization: `Bearer')
  })

  it('compiles without TypeScript errors', () => {
    const diagnostics = compileFiles({
      'models.ts': generateTypes(mixedAuthSpec).content,
      'client-config.ts': generateClientConfig({ authSchemes: detectAuthSchemes(mixedAuthSpec) })
        .content,
      'client.ts': generateClient(mixedAuthSpec).content,
    })

    if (diagnostics.length > 0) {
      const msgs = diagnostics
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
        .join('\n')
      throw new Error(`TS errors in mixed-auth client:\n${msgs}`)
    }
    expect(diagnostics.length).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// ClientConfig: token always present; basicAuth/apiKey only when spec declares them
// ---------------------------------------------------------------------------

describe('ClientConfig: token always present (back-compat)', () => {
  it('token? present with no-auth spec (no args)', () => {
    expect(generateClientConfig().content).toContain('token?')
  })

  it('token? present for apiKey spec', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(apiKeyHeaderSpec) }).content
    ).toContain('token?')
  })

  it('token? present for basic auth spec', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(basicAuthSpec) }).content
    ).toContain('token?')
  })
})

describe('ClientConfig: basicAuth? only emitted for http basic specs', () => {
  it('basicAuth? present when spec has http basic', () => {
    const content = generateClientConfig({ authSchemes: detectAuthSchemes(basicAuthSpec) }).content
    expect(content).toContain('basicAuth?')
    expect(content).toContain('username: string')
    expect(content).toContain('password: string')
  })

  it('basicAuth? absent for no-auth spec (no dead fields)', () => {
    expect(generateClientConfig().content).not.toContain('basicAuth?')
  })

  it('basicAuth? absent for bearer-only spec', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(bearerSpec) }).content
    ).not.toContain('basicAuth?')
  })

  it('basicAuth? absent for apiKey-only spec', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(apiKeyHeaderSpec) }).content
    ).not.toContain('basicAuth?')
  })
})

describe('ClientConfig: apiKey? only emitted for apiKey specs', () => {
  it('apiKey? present when spec has apiKey-in-header', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(apiKeyHeaderSpec) }).content
    ).toContain('apiKey?')
  })

  it('apiKey? present when spec has apiKey-in-query', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(apiKeyQuerySpec) }).content
    ).toContain('apiKey?')
  })

  it('apiKey? absent for no-auth spec (no dead fields)', () => {
    expect(generateClientConfig().content).not.toContain('apiKey?')
  })

  it('apiKey? absent for bearer-only spec', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(bearerSpec) }).content
    ).not.toContain('apiKey?')
  })

  it('apiKey? absent for basic-only spec', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(basicAuthSpec) }).content
    ).not.toContain('apiKey?')
  })

  it('apiKey comment describes header placement', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(apiKeyHeaderSpec) }).content
    ).toContain("'X-API-Key'")
  })

  it('apiKey comment describes query placement', () => {
    expect(
      generateClientConfig({ authSchemes: detectAuthSchemes(apiKeyQuerySpec) }).content
    ).toContain("'api_key'")
  })
})

describe('ClientConfig compiles without TypeScript errors', () => {
  it('generated config for apiKey spec compiles cleanly', () => {
    const content = generateClientConfig({
      authSchemes: detectAuthSchemes(apiKeyHeaderSpec),
    }).content
    const { options } = ts.convertCompilerOptionsFromJson(
      {
        strict: true,
        target: 'ES2022',
        moduleResolution: 'Bundler',
        noEmit: true,
        skipLibCheck: true,
        lib: ['ES2022', 'DOM'],
      },
      '.'
    )
    const filename = 'client-config.ts'
    const sf = ts.createSourceFile(filename, content, ts.ScriptTarget.ES2022, true)
    const host = ts.createCompilerHost(options)
    const customHost: ts.CompilerHost = {
      ...host,
      getSourceFile: (n, l) => (n === filename ? sf : host.getSourceFile(n, l)),
      fileExists: (n) => n === filename || host.fileExists(n),
      readFile: (n) => (n === filename ? content : host.readFile(n)),
    }
    const prog = ts.createProgram([filename], options, customHost)
    const diags = ts.getPreEmitDiagnostics(prog, sf).filter((d) => d.file?.fileName === filename)
    expect(diags.length).toBe(0)
  })
})
