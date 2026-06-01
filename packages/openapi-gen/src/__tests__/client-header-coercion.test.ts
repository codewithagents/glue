/**
 * Tests for header param string coercion (issue #221).
 *
 * HTTP headers are strings on the wire. When a spec declares header params with
 * non-string types (number, boolean, string-literal unions), the generated
 * extraHeaders object must coerce the values with String() so the object remains
 * assignable to Record<string, string>.
 *
 * Previously the generator emitted bare `params.headerName` which, for a number
 * typed header, produced TS2322: Type 'number' is not assignable to type 'string'.
 *
 * All specs below are fictional and do not represent real or internal APIs.
 */
import { describe, it, expect } from 'vitest'
import { generateClient } from '../plugins/client.js'
import { generateClientConfig } from '../plugins/client-config.js'
import type { OpenAPIV3_1 } from 'openapi-types'
import ts from 'typescript'

// A fictional spec with header params of various non-string types.
const headerCoercionSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Fictional Header Coercion API', version: '1' },
  paths: {
    '/upload': {
      put: {
        operationId: 'uploadObject',
        parameters: [
          {
            name: 'content-length',
            in: 'header',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'x-object-lock-legal-hold',
            in: 'header',
            required: false,
            schema: { type: 'string', enum: ['OFF', 'ON'] },
          },
          {
            name: 'x-enabled',
            in: 'header',
            required: false,
            schema: { type: 'boolean' },
          },
          {
            name: 'x-name',
            in: 'header',
            required: false,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/octet-stream': {},
          },
        },
        responses: {
          '200': {
            description: 'OK',
          },
        },
      },
    },
  },
}

// Compile virtual files using the TypeScript compiler API (in-process, no disk I/O).
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

describe('header param coercion: generated code wraps values in String()', () => {
  it('emits String() for an integer header param', () => {
    const out = generateClient(headerCoercionSpec).content
    expect(out).toContain('String(params.contentLength)')
  })

  it('emits String() for a string-literal-union (enum) header param', () => {
    const out = generateClient(headerCoercionSpec).content
    expect(out).toContain('String(params.xObjectLockLegalHold)')
  })

  it('emits String() for a boolean header param', () => {
    const out = generateClient(headerCoercionSpec).content
    expect(out).toContain('String(params.xEnabled)')
  })

  it('emits String() for a plain string header param (consistent coercion)', () => {
    const out = generateClient(headerCoercionSpec).content
    expect(out).toContain('String(params.xName)')
  })

  it('generated client typechecks with tsc strict mode (no TS2322)', () => {
    const clientContent = generateClient(headerCoercionSpec).content
    const clientConfigContent = generateClientConfig().content

    const diagnostics = compileFiles({
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
      throw new Error(`TypeScript errors in generated header-coercion client:\n${messages}`)
    }

    expect(diagnostics.length).toBe(0)
  })
})
