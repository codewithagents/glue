// fallow-ignore-file code-duplication
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseSpec, generateClient, generateTypes } from '@codewithagents/openapi-gen'
import { generateHooks } from '../plugins/hooks.js'

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
    generateHooks(spec, { staleTime: 0, gcTime: 0 })
  })
})

// ---------------------------------------------------------------------------
// Hook-import gate: verify every function name the generated hooks.ts imports
// from ./client.js is actually exported by the generated client.ts.
//
// This catches the #241 bug class: divergence between the name a hook
// references and the name the client actually exports. The concrete case was
// path segments like "{Y}.pbf" — the old client.ts used toTypeName on the
// whole segment ("Ypbf", no "By" prefix) while the old hooks.ts extracted the
// {Y} brace and produced "ByY". The hook imported a function that did not
// exist in the client. Zero type-resolution overhead: pure string matching.
//
// KNOWN_IMPORT_MISMATCHES lists specs with a SEPARATE pre-existing mismatch
// unrelated to #241 (operationId uniquification collisions):
//
//   airflow    - operationId "getConfig" collides with the client file's own
//   configcat    getConfig() helper; client renames the operation to
//                getConfig_2 via uniquifyName, but the hook still imports the
//                un-uniquified name. Tracked as a separate follow-up.
//   pinecone   - operationId "fetch" collides with globalThis.fetch; client
//                renames to fetch_2, hook imports "fetch". Same issue.
//
// The test FAILS if a spec NOT on this list has a new hook-import mismatch.
// The test FAILS if a spec ON this list unexpectedly passes (list must shrink).
// ---------------------------------------------------------------------------
const KNOWN_IMPORT_MISMATCHES = new Set<string>([
  'airflow', // getConfig uniquified to getConfig_2 in client; hook imports getConfig
  'configcat', // same getConfig collision as airflow
  'pinecone', // fetch uniquified to fetch_2 in client; hook imports fetch
])

/** Collect names after `^export (async )?function` in the client output. */
function extractClientExports(content: string): Set<string> {
  const names = new Set<string>()
  for (const m of content.matchAll(/^export (async )?function (\w+)/gm)) {
    names.add(m[2]!)
  }
  return names
}

/** Collect value names (non-type, non-ApiError) from `import { ... } from './client.js'`. */
function extractHookClientImports(content: string): Set<string> {
  const importBlock = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]\.\/client\.js['"]/s)
  if (importBlock === null) return new Set()
  const names = new Set<string>()
  for (const part of importBlock[1]!.split(',')) {
    const cleaned = part.trim().replace(/^type\s+/, '')
    if (cleaned.length > 0 && cleaned !== 'ApiError') {
      names.add(cleaned)
    }
  }
  return names
}

describe('compat-matrix hook-import gate', () => {
  it('every hook client-import resolves to a real client export across all specs', async () => {
    const mismatched: Record<string, string[]> = {}

    for (const { name, specPath } of cases) {
      const spec = await parseSpec(specPath)
      const clientContent = generateClient(spec).content
      const hooksContent = generateHooks(spec, { staleTime: 0, gcTime: 0 }).content
      const clientExports = extractClientExports(clientContent)
      const hookImports = extractHookClientImports(hooksContent)
      const bad = [...hookImports].filter((n) => !clientExports.has(n))
      if (bad.length > 0) {
        mismatched[name] = bad
      }
    }

    const actuallyFailing = new Set(Object.keys(mismatched))
    const unexpected = [...actuallyFailing].filter((s) => !KNOWN_IMPORT_MISMATCHES.has(s))
    const unexpectedlyPassing = [...KNOWN_IMPORT_MISMATCHES].filter((s) => !actuallyFailing.has(s))

    const parts: string[] = []
    if (unexpected.length > 0) {
      const details = unexpected
        .map((s) => `  ${s}: ${(mismatched[s] ?? []).join(', ')}`)
        .join('\n')
      parts.push(`NEW hook-import mismatches (not in KNOWN_IMPORT_MISMATCHES):\n${details}`)
    }
    if (unexpectedlyPassing.length > 0) {
      const names = unexpectedlyPassing.map((s) => `  ${s}`).join('\n')
      parts.push(`Specs in KNOWN_IMPORT_MISMATCHES now pass (remove from allowlist):\n${names}`)
    }

    if (parts.length > 0) {
      throw new Error(parts.join('\n\n'))
    }

    expect(actuallyFailing.size).toBe(KNOWN_IMPORT_MISMATCHES.size)
  }, 120_000)
})
