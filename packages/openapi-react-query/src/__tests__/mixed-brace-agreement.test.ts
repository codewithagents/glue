/**
 * Regression guard for #241: deriveOperationName diverged between openapi-gen
 * (client.ts) and openapi-react-query (hooks.ts), causing hooks to import
 * function names that did not exist in the generated client.
 *
 * The concrete failure case is a path segment that contains a {param} brace
 * followed by a static suffix, e.g. "{Y}.pbf". The segment starts with "{" but
 * does NOT end with "}", so it is NOT a pure path param:
 *
 *   Old client.ts: toTypeName("{Y}.pbf") = "Ypbf"  (no "By" prefix)
 *   Old hooks.ts:  extracts {Y} -> "ByY"             (with "By" prefix)
 *   -> the hook imported "...ByXByY" but the client exported "...ByXYpbf"
 *
 * After the fix both generators use the same deriveOperationName from
 * openapi-gen/src/utils/naming.ts, so the exported and imported names
 * are always identical.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateClient } from '@codewithagents/openapi-gen'
import { generateHooks } from '../plugins/hooks.js'

const fixturePath = join(import.meta.dirname, '../../__fixtures__/specs/mixed-brace-paths.json')
const spec = JSON.parse(readFileSync(fixturePath, 'utf-8')) as OpenAPIV3_1.Document

const clientContent = generateClient(spec).content
const hooksContent = generateHooks(spec, { staleTime: 0, gcTime: 0 }).content

/** Extract all `export async function <name>` names from client.ts output. */
function extractClientExports(content: string): Set<string> {
  const names = new Set<string>()
  for (const m of content.matchAll(/export async function (\w+)\(/g)) {
    names.add(m[1]!)
  }
  return names
}

/** Extract all value (non-type) function names imported from './client.js' in hooks.ts output. */
function extractHookClientImports(content: string): Set<string> {
  const importBlock = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]\.\/client\.js['"]/s)
  if (importBlock === null) return new Set()
  const names = new Set<string>()
  for (const part of importBlock[1]!.split(',')) {
    // Normalise whitespace, then strip a leading "type " keyword (type-only imports)
    const cleaned = part.trim().replace(/^type\s+/, '')
    if (cleaned.length > 0 && cleaned !== 'ApiError') {
      names.add(cleaned)
    }
  }
  return names
}

describe('mixed-brace path — client/hook name agreement (#241 regression)', () => {
  it('client exports the correct name for the {Y}.pbf segment (with "By" prefix)', () => {
    const exported = extractClientExports(clientContent)
    // Canonical name: mixed-brace branch extracts {Y} -> "ByY", discards ".pbf"
    expect(exported).toContain('getMapByVersionNumberTileByLayerByStyleByZoomByXByY')
    // Old (wrong) client.ts name: toTypeName on whole segment produced no "By" before Y
    expect(exported).not.toContain('getMapByVersionNumberTileByLayerByStyleByZoomByXYpbf')
  })

  it('hooks import exactly the same function names the client exports', () => {
    const clientExports = extractClientExports(clientContent)
    const hookImports = extractHookClientImports(hooksContent)

    // Every function the hook imports must be exported by the client.
    // This would have failed before the fix: the hook imported "...ByXByY"
    // but the old client exported "...ByXYpbf".
    for (const imported of hookImports) {
      expect(clientExports, `hook imports "${imported}" but client does not export it`).toContain(
        imported
      )
    }
  })

  it('no hook import references a function name absent from client exports', () => {
    const clientExports = extractClientExports(clientContent)
    const hookImports = extractHookClientImports(hooksContent)

    const mismatched = [...hookImports].filter((name) => !clientExports.has(name))
    expect(mismatched).toEqual([])
  })
})
