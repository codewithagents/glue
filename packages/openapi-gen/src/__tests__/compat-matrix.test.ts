// fallow-ignore-file code-duplication
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs'
import { resolve, join, dirname, relative } from 'node:path'
import { tmpdir } from 'node:os'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { parseSpec } from '../parser.js'
import { generateTypes } from '../plugins/types.js'
import { generateClient, detectAuthSchemes, hasCookieAuth } from '../plugins/client.js'
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
const KNOWN_TYPECHECK_FAILURES = new Set<string>([
  // NOTE: until the docker enum + client-config harness fixes in this change,
  // docker's syntax error (TS1005) aborted tsc's parse phase and MASKED the
  // semantic errors below for every other spec, so the gate gave false
  // confidence. With the gate now functional, these are the real, pre-existing
  // generator type-correctness gaps, tracked as follow-up issues:
  //
  // Generated-helper / reserved-name collisions (#218):
  'airflow', // TS2440 'getConfig' import conflicts with a generated local
  'configcat', // TS2440 'getConfig' collision (+ cascade)
  'box', // TS2769/TS2304 - operation name collision + unresolved name
  'pinecone', // TS2345/TS2339 - spec redefines FetchRequest/FetchResponse names
  //
  // Unresolved / misnamed nested type references (#220):
  'brex', // TS2305 models.ts missing 'Company'/'Schema'
  'digitalocean', // TS2305 missing 'Items'/'Schema'/'_0'
  'clevercloud', // TS2304 cannot find 'WannabeEnvVar'
  'clicksend', // TS2304 cannot find 'convert'
  'codat_accounting', // TS2304 'accountId'/'Currency'
  'codat_banking', // TS2304 'AccountBalanceAmounts' etc.
  'dnd5e', // TS2304 cannot find 'Items'
  'jira', // TS2304 cannot find 'EntityPropertyDetails'
  'linode', // TS2304/TS2305 'Filesystem'/'AllowList'/'Rules'
  'medium', // TS2304 cannot find 'query'
  //
  // Typed header maps not assignable to Record<string, string> (#221):
  'aws_s3', // TS2322 literal/number header values vs Record<string,string>
  'here_tracking', // TS2322 numeric header value vs Record<string,string>
  'vercel', // TS2322 numeric/literal header values vs Record<string,string>
])

type SpecCase = { name: string; specPath: string }

async function generateSpecsToDir(outputDir: string, specCases: SpecCase[]): Promise<void> {
  for (const { name, specPath } of specCases) {
    const spec = await parseSpec(specPath)
    const specDir = join(outputDir, name)
    mkdirSync(specDir, { recursive: true })
    writeFileSync(join(specDir, 'models.ts'), generateTypes(spec).content, 'utf-8')
    // Mirror generator.ts: client-config must be generated with the spec's auth
    // schemes so its ClientConfig type matches the config fields client.ts uses.
    const authSchemes = detectAuthSchemes(spec)
    const configOptions = hasCookieAuth(spec)
      ? { defaultCredentials: 'include', authSchemes }
      : { authSchemes }
    writeFileSync(
      join(specDir, 'client-config.ts'),
      generateClientConfig(configOptions).content,
      'utf-8'
    )
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
