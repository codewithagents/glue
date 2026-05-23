import { describe, it, expect } from 'vitest'
import ts from 'typescript'
import { parseSpec } from '../parser.js'
import { generateTypes } from '../plugins/types.js'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, '../__fixtures__/specs')

function compileTypeScript(filename: string, source: string): readonly ts.Diagnostic[] {
  const options: ts.CompilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: true,
  }

  const sourceFile = ts.createSourceFile(filename, source, ts.ScriptTarget.ES2022, true)
  const defaultHost = ts.createCompilerHost(options)

  const customHost: ts.CompilerHost = {
    ...defaultHost,
    getSourceFile: (name, lang) =>
      name === filename ? sourceFile : defaultHost.getSourceFile(name, lang),
    fileExists: (name) => name === filename || defaultHost.fileExists(name),
    readFile: (name) => (name === filename ? source : defaultHost.readFile(name)),
  }

  const program = ts.createProgram([filename], options, customHost)
  const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile)
  return diagnostics.filter((d) => d.file?.fileName === filename)
}

const fixtures = [
  ['task-manager', join(fixturesDir, 'task-manager.json')],
  ['edge-cases', join(fixturesDir, 'edge-cases.json')],
  ['petstore', join(fixturesDir, 'petstore.json')],
] as const

describe('generated models.ts compiles with TypeScript strict mode', () => {
  it.each(fixtures)('%s: no TypeScript errors', async (name, fixturePath) => {
    const spec = await parseSpec(fixturePath)
    const { content } = generateTypes(spec)

    const diagnostics = compileTypeScript('models.ts', content)

    if (diagnostics.length > 0) {
      const messages = diagnostics
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
        .join('\n')
      throw new Error(`TypeScript errors in generated output for "${name}":\n${messages}`)
    }

    expect(diagnostics.length).toBe(0)
  })
})
