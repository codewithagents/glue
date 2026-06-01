// fallow-ignore-file code-duplication
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs'
import { resolve, join, dirname, relative } from 'node:path'
import { tmpdir } from 'node:os'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { parseSpec } from '../parser.js'
import { generateTypes } from '../plugins/types.js'
import { generateClient } from '../plugins/client.js'
import { generateClientConfig } from '../plugins/client-config.js'
import { generateZodSchemas } from '../plugins/zod.js'

const configsDir = resolve(import.meta.dirname, '../../../../examples/configs')

const cases = readdirSync(configsDir)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => {
    const config = JSON.parse(readFileSync(resolve(configsDir, f), 'utf-8')) as {
      input_openapi: string
    }
    const specPath = resolve(configsDir, config.input_openapi)
    return { name: f.replace('.json', ''), specPath }
  })

describe.each(cases)('compat — $name', ({ specPath }) => {
  it('generates without throwing', async () => {
    const spec = await parseSpec(specPath)
    generateTypes(spec)
    generateClient(spec)
    generateZodSchemas(spec)
  })
})

// ---------------------------------------------------------------------------
// Typecheck gate: compile the full generated output (models.ts + client-config.ts
// + client.ts) for every matrix spec with tsc --noEmit strict mode.
//
// Specs listed here are KNOWN failures tracked as follow-up issues.
// The test:
//   - FAILS if a spec NOT on this list fails to typecheck (regression guard)
//   - FAILS if a spec ON this list now passes (keeps the list honest, shrinking)
//
// To update: reproduce locally, adjust the set, add a one-line reason comment.
// ---------------------------------------------------------------------------
const KNOWN_TYPECHECK_FAILURES = new Set([
  // TS1005 "',' expected" -- generator emits `[object Object]` literal for
  // additionalProperties schemas whose value is an inline schema object rather
  // than a $ref, producing invalid TypeScript syntax in models.ts.
  'docker',
])

type SpecCase = { name: string; specPath: string }

async function generateSpecsToDir(outputDir: string, specCases: SpecCase[]): Promise<void> {
  for (const { name, specPath } of specCases) {
    const spec = await parseSpec(specPath)
    const specDir = join(outputDir, name)
    mkdirSync(specDir, { recursive: true })
    writeFileSync(join(specDir, 'models.ts'), generateTypes(spec).content, 'utf-8')
    writeFileSync(join(specDir, 'client-config.ts'), generateClientConfig().content, 'utf-8')
    writeFileSync(join(specDir, 'client.ts'), generateClient(spec).content, 'utf-8')
  }
}

function writeTsconfig(outputDir: string, zodDir: string): void {
  const tsconfig = {
    compilerOptions: {
      strict: true,
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      noEmit: true,
      skipLibCheck: true,
      paths: { zod: [join(zodDir, 'index.d.ts')] },
    },
    include: ['**/*.ts'],
  }
  writeFileSync(join(outputDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf-8')
}

function runTsc(tscBin: string, outputDir: string): string {
  try {
    execSync(`${tscBin} --noEmit --project tsconfig.json`, {
      encoding: 'utf-8',
      cwd: outputDir,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    return ''
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string }
    return (e.stdout ?? '') + (e.stderr ?? '')
  }
}

function parseTscErrors(tscOutput: string, outputDir: string): Map<string, string[]> {
  const errorsBySpec = new Map<string, string[]>()
  for (const line of tscOutput.split('\n')) {
    const match = line.match(/^(.*\.ts)\(\d+,\d+\): error (TS\d+): (.+)$/)
    if (!match) continue
    const filePath = match[1].trim()
    const rel = filePath.startsWith('/') ? relative(outputDir, filePath) : filePath
    const specName = rel.split('/')[0]
    if (!specName || specName === '..') continue
    const existing = errorsBySpec.get(specName) ?? []
    existing.push(line.replace(outputDir + '/', ''))
    errorsBySpec.set(specName, existing)
  }
  return errorsBySpec
}

function buildFailureMessage(
  unexpected: string[],
  unexpectedlyPassing: string[],
  errorsBySpec: Map<string, string[]>
): string {
  const parts: string[] = []
  if (unexpected.length > 0) {
    const details = unexpected
      .map((s) => {
        const errs = errorsBySpec.get(s) ?? []
        const sample = errs
          .slice(0, 3)
          .map((e) => `    ${e}`)
          .join('\n')
        return `  ${s}:\n${sample}`
      })
      .join('\n')
    parts.push(`NEW typecheck failures (not in KNOWN_TYPECHECK_FAILURES):\n${details}`)
  }
  if (unexpectedlyPassing.length > 0) {
    const names = unexpectedlyPassing.map((s) => `  ${s}`).join('\n')
    parts.push(`Specs in KNOWN_TYPECHECK_FAILURES now PASS tsc (remove from allowlist):\n${names}`)
  }
  return parts.join('\n\n')
}

describe('compat-matrix typecheck gate', () => {
  it('every matrix spec compiles with tsc --noEmit (strict)', async () => {
    const examplesPkg = resolve(import.meta.dirname, '../../../../examples/package.json')
    const zodMain = createRequire(examplesPkg).resolve('zod')
    const zodDir = realpathSync(dirname(zodMain))
    const tscBin = resolve(import.meta.dirname, '../../../../node_modules/.bin/tsc')

    const tmpRoot = realpathSync(tmpdir()) + `/compat-matrix-tsc-${Date.now()}`
    const outputDir = join(tmpRoot, 'output')
    mkdirSync(outputDir, { recursive: true })

    try {
      await generateSpecsToDir(outputDir, cases)
      writeTsconfig(outputDir, zodDir)

      const tscOutput = runTsc(tscBin, outputDir)
      const errorsBySpec = parseTscErrors(tscOutput, outputDir)
      const actuallyFailing = new Set(errorsBySpec.keys())

      const unexpected = [...actuallyFailing].filter((s) => !KNOWN_TYPECHECK_FAILURES.has(s))
      const unexpectedlyPassing = [...KNOWN_TYPECHECK_FAILURES].filter(
        (s) => !actuallyFailing.has(s)
      )

      if (unexpected.length > 0 || unexpectedlyPassing.length > 0) {
        throw new Error(buildFailureMessage(unexpected, unexpectedlyPassing, errorsBySpec))
      }

      expect(actuallyFailing.size).toBe(KNOWN_TYPECHECK_FAILURES.size)
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
    }
  }, 120_000)
})
