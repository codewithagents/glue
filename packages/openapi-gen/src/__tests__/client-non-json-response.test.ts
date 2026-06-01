/**
 * Tests for non-JSON response parsing (issue #175).
 *
 * Generated clients must emit the correct body-parsing call based on the
 * success response media type:
 *   - application/json  -> res.json()         (return type: schema type)
 *   - text/*            -> res.text()          (return type: string)
 *   - binary / other    -> res.blob()          (return type: Blob)
 *   - text/event-stream -> res.body            (return type: ReadableStream<Uint8Array> | null)
 *
 * All specs below are fictional and do not represent real or internal APIs.
 */
import { describe, it, expect } from 'vitest'
import { generateClient } from '../plugins/client.js'
import { generateTypes } from '../plugins/types.js'
import { generateClientConfig } from '../plugins/client-config.js'
import type { OpenAPIV3_1 } from 'openapi-types'
import ts from 'typescript'

// ---------------------------------------------------------------------------
// Fictional multi-media-type spec used across the test suite
// ---------------------------------------------------------------------------
const mediaSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional Media API', version: '1' },
  paths: {
    '/report': {
      get: {
        operationId: 'getReport',
        responses: {
          '200': {
            description: 'CSV report',
            content: {
              'text/plain': { schema: { type: 'string' } },
            },
          },
        },
      },
    },
    '/download': {
      get: {
        operationId: 'downloadFile',
        responses: {
          '200': {
            description: 'Binary file',
            content: {
              'application/octet-stream': {},
            },
          },
        },
      },
    },
    '/image': {
      get: {
        operationId: 'getImage',
        responses: {
          '200': {
            description: 'PNG image',
            content: {
              'image/png': {},
            },
          },
        },
      },
    },
    '/events': {
      get: {
        operationId: 'streamEvents',
        responses: {
          '200': {
            description: 'Server-sent events stream',
            content: {
              'text/event-stream': {},
            },
          },
        },
      },
    },
    '/data': {
      get: {
        operationId: 'getData',
        responses: {
          '200': {
            description: 'JSON data',
            content: {
              'application/json': { schema: { type: 'string' } },
            },
          },
        },
      },
    },
    '/status': {
      delete: {
        operationId: 'clearStatus',
        responses: {
          '204': { description: 'No content' },
        },
      },
    },
  },
}

// ---------------------------------------------------------------------------
// TypeScript compilation helper (shared pattern from client.test.ts)
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
// Tests: text/* -> res.text() returning Promise<string>
// ---------------------------------------------------------------------------
describe('non-JSON response: text/plain emits res.text()', () => {
  it('getReport returns Promise<string>', () => {
    const out = generateClient(mediaSpec).content
    expect(out).toContain('Promise<string>')
    const match = out.match(/export async function getReport[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('res.text()')
  })

  it('getReport does NOT call res.json()', () => {
    const out = generateClient(mediaSpec).content
    const match = out.match(/export async function getReport[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).not.toContain('res.json()')
  })
})

// ---------------------------------------------------------------------------
// Tests: application/octet-stream -> res.blob() returning Promise<Blob>
// ---------------------------------------------------------------------------
describe('non-JSON response: application/octet-stream emits res.blob()', () => {
  it('downloadFile returns Promise<Blob>', () => {
    const out = generateClient(mediaSpec).content
    const match = out.match(/export async function downloadFile[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('Promise<Blob>')
    expect(match![0]).toContain('res.blob()')
  })

  it('downloadFile does NOT call res.json()', () => {
    const out = generateClient(mediaSpec).content
    const match = out.match(/export async function downloadFile[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).not.toContain('res.json()')
  })
})

// ---------------------------------------------------------------------------
// Tests: image/* -> res.blob() returning Promise<Blob>
// ---------------------------------------------------------------------------
describe('non-JSON response: image/png emits res.blob()', () => {
  it('getImage returns Promise<Blob>', () => {
    const out = generateClient(mediaSpec).content
    const match = out.match(/export async function getImage[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('Promise<Blob>')
    expect(match![0]).toContain('res.blob()')
  })
})

// ---------------------------------------------------------------------------
// Tests: text/event-stream -> res.body returning Promise<ReadableStream<Uint8Array> | null>
// ---------------------------------------------------------------------------
describe('non-JSON response: text/event-stream emits res.body', () => {
  it('streamEvents returns Promise<ReadableStream<Uint8Array> | null>', () => {
    const out = generateClient(mediaSpec).content
    const match = out.match(/export async function streamEvents[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('Promise<ReadableStream<Uint8Array> | null>')
    expect(match![0]).toContain('res.body')
  })

  it('streamEvents does NOT call res.json() or res.text() or res.blob()', () => {
    const out = generateClient(mediaSpec).content
    const match = out.match(/export async function streamEvents[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).not.toContain('res.json()')
    expect(match![0]).not.toContain('res.text()')
    expect(match![0]).not.toContain('res.blob()')
  })
})

// ---------------------------------------------------------------------------
// Tests: application/json -> res.json() (unchanged behavior)
// ---------------------------------------------------------------------------
describe('JSON response: application/json still emits res.json()', () => {
  it('getData returns res.json()', () => {
    const out = generateClient(mediaSpec).content
    const match = out.match(/export async function getData[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('res.json()')
  })
})

// ---------------------------------------------------------------------------
// Tests: void (204) unchanged
// ---------------------------------------------------------------------------
describe('void response: 204 still returns Promise<void>', () => {
  it('clearStatus returns Promise<void>', () => {
    const out = generateClient(mediaSpec).content
    const match = out.match(/export async function clearStatus[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('Promise<void>')
    expect(match![0]).not.toContain('res.json()')
    expect(match![0]).not.toContain('res.text()')
    expect(match![0]).not.toContain('res.blob()')
  })
})

// ---------------------------------------------------------------------------
// Tests: media type preference (json wins when multiple types present)
// ---------------------------------------------------------------------------
describe('media type preference: json wins over text and binary', () => {
  it('response with both application/json and text/plain prefers json', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/mixed': {
          get: {
            operationId: 'getMixed',
            responses: {
              '200': {
                content: {
                  'text/plain': { schema: { type: 'string' } },
                  'application/json': { schema: { $ref: '#/components/schemas/Item' } },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          Item: { type: 'object', properties: { id: { type: 'string' } } },
        },
      },
    }
    const out = generateClient(spec).content
    const match = out.match(/export async function getMixed[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('res.json()')
    expect(match![0]).not.toContain('res.text()')
  })

  it('response with both text/plain and image/png prefers text', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/mixed': {
          get: {
            operationId: 'getMixed',
            responses: {
              '200': {
                content: {
                  'image/png': {},
                  'text/plain': { schema: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    }
    const out = generateClient(spec).content
    const match = out.match(/export async function getMixed[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('res.text()')
    expect(match![0]).not.toContain('res.blob()')
  })
})

// ---------------------------------------------------------------------------
// Tests: application/sdp is classified as binary (not text)
// ---------------------------------------------------------------------------
describe('non-JSON response: application/sdp emits res.blob()', () => {
  it('createCall with application/sdp response returns Promise<Blob>', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Fictional SDP API', version: '1' },
      paths: {
        '/calls': {
          post: {
            operationId: 'createCall',
            responses: {
              '200': {
                description: 'SDP answer',
                content: {
                  'application/sdp': {},
                },
              },
            },
          },
        },
      },
    }
    const out = generateClient(spec).content
    const match = out.match(/export async function createCall[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('Promise<Blob>')
    expect(match![0]).toContain('res.blob()')
    expect(match![0]).not.toContain('res.json()')
    expect(match![0]).not.toContain('res.text()')
  })
})

// ---------------------------------------------------------------------------
// Tests: application/*+json (vendor JSON) is classified as json
// ---------------------------------------------------------------------------
describe('non-JSON response: application/problem+json emits res.json()', () => {
  it('getProblem with application/problem+json response returns res.json()', () => {
    const spec: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: { title: 'Fictional Problem API', version: '1' },
      paths: {
        '/problem': {
          get: {
            operationId: 'getProblem',
            responses: {
              '200': {
                content: {
                  'application/problem+json': { schema: { type: 'object' } },
                },
              },
            },
          },
        },
      },
    }
    const out = generateClient(spec).content
    const match = out.match(/export async function getProblem[\s\S]*?^\}/m)
    expect(match).toBeTruthy()
    expect(match![0]).toContain('res.json()')
    expect(match![0]).not.toContain('res.text()')
    expect(match![0]).not.toContain('res.blob()')
  })
})

// ---------------------------------------------------------------------------
// Tests: Blob and ReadableStream are NOT imported from ./models
// ---------------------------------------------------------------------------
describe('type-import safety: Blob, ReadableStream, Uint8Array never imported from ./models', () => {
  it('generated client for binary/text/stream endpoints has no import { Blob } from ./models', () => {
    const out = generateClient(mediaSpec).content
    expect(out).not.toMatch(/import\s+type\s*\{[^}]*\bBlob\b[^}]*\}\s+from\s+['"]\.\/models/)
    expect(out).not.toMatch(/import\s*\{[^}]*\bBlob\b[^}]*\}\s+from\s+['"]\.\/models/)
  })

  it('generated client has no import { ReadableStream } from ./models', () => {
    const out = generateClient(mediaSpec).content
    expect(out).not.toMatch(
      /import\s+type\s*\{[^}]*\bReadableStream\b[^}]*\}\s+from\s+['"]\.\/models/
    )
    expect(out).not.toMatch(/import\s*\{[^}]*\bReadableStream\b[^}]*\}\s+from\s+['"]\.\/models/)
  })

  it('generated client has no import { Uint8Array } from ./models', () => {
    const out = generateClient(mediaSpec).content
    expect(out).not.toMatch(/import\s+type\s*\{[^}]*\bUint8Array\b[^}]*\}\s+from\s+['"]\.\/models/)
  })
})

// ---------------------------------------------------------------------------
// Tests: TypeScript compilation of generated code with non-JSON responses
// ---------------------------------------------------------------------------
describe('TypeScript compilation: non-JSON response client compiles cleanly', () => {
  it('media spec client compiles without TypeScript errors', () => {
    const modelsContent = generateTypes(mediaSpec).content
    const clientConfigContent = generateClientConfig().content
    const clientContent = generateClient(mediaSpec).content

    const diagnostics = compileFiles({
      'models.ts': modelsContent,
      'client-config.ts': clientConfigContent,
      'client.ts': clientContent,
    })

    if (diagnostics.length > 0) {
      const messages = diagnostics
        .map(
          (d) =>
            `${d.file?.fileName}:${d.start} - ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`
        )
        .join('\n')
      throw new Error(`TypeScript errors in generated non-JSON client:\n${messages}`)
    }

    expect(diagnostics.length).toBe(0)
  })

  it('consumer code using non-JSON return types compiles cleanly', () => {
    const clientContent = generateClient(mediaSpec).content
    const clientConfigContent = generateClientConfig().content

    const usageContent = `
import { getReport, downloadFile, getImage, streamEvents, getData } from './client'

async function examples() {
  const csvText: string = await getReport()
  const blob1: Blob = await downloadFile()
  const blob2: Blob = await getImage()
  const stream: ReadableStream<Uint8Array> | null = await streamEvents()
  const jsonStr: string = await getData()
  return { csvText, blob1, blob2, stream, jsonStr }
}
`

    const diagnostics = compileFiles({
      'client-config.ts': clientConfigContent,
      'client.ts': clientContent,
      'usage.ts': usageContent,
    })

    if (diagnostics.length > 0) {
      const messages = diagnostics
        .map(
          (d) =>
            `${d.file?.fileName}:${d.start} - ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`
        )
        .join('\n')
      throw new Error(`TypeScript errors in non-JSON consumer code:\n${messages}`)
    }

    expect(diagnostics.length).toBe(0)
  })
})
