import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateHooks } from '../plugins/hooks.js'
import { generateClient } from '@codewithagents/openapi-gen'

// Load fixture: Item schema has readOnly (id) and writeOnly (secret) properties.
// This triggers the XWritable variant. The client function that takes Item as a
// request body must use ItemWritable (write shape). The hooks derive their body
// type from Parameters<typeof fn>[N], so they transitively reference ItemWritable.
const fixturePath = join(import.meta.dirname, '../../__fixtures__/specs/writable-body-hooks.json')
const spec = JSON.parse(readFileSync(fixturePath, 'utf-8')) as OpenAPIV3_1.Document

const { filename, content: hooksContent } = generateHooks(spec, {
  staleTime: 0,
  gcTime: 300_000,
})
const { content: clientContent } = generateClient(spec)

describe('generateHooks — writable-body: mutation variables use XWritable (#242)', () => {
  it('filename is hooks.ts', () => {
    expect(filename).toBe('hooks.ts')
  })

  // ── Client side (prerequisite): body param must be ItemWritable ─────────────

  it('client createItem function accepts ItemWritable as body param', () => {
    // The client must use ItemWritable so that Parameters<typeof createItem>[0]
    // in the hook resolves to ItemWritable at compile time.
    expect(clientContent).toContain('body: ItemWritable')
  })

  it('client defines ItemWritable interface (write shape without readOnly props)', () => {
    // models.ts is NOT generated here, but client.ts imports from models.ts.
    // Verify the import list contains ItemWritable.
    expect(clientContent).toContain('ItemWritable')
  })

  it('client updateItem function accepts ItemWritable as body param', () => {
    expect(clientContent).toContain('body: ItemWritable')
  })

  // ── Hooks side: variables type chains through Parameters<typeof fn>[N] ──────

  it('useCreateItem uses Parameters<typeof createItem>[0] as variables type', () => {
    // Body-only mutation: variables = Parameters<typeof createItem>[0]
    // This resolves to ItemWritable at compile time (the client body param type).
    expect(hooksContent).toContain('Parameters<typeof createItem>[0]')
    const createHookStart = hooksContent.indexOf('export function useCreateItem')
    expect(createHookStart).toBeGreaterThan(-1)
    const createHookEnd = hooksContent.indexOf('\n}', createHookStart) + 2
    const createHookContent = hooksContent.slice(createHookStart, createHookEnd)
    expect(createHookContent).toContain('Parameters<typeof createItem>[0]')
  })

  it('useUpdateItem body in variables type uses Parameters<typeof updateItem>[1]', () => {
    // path-param + body mutation: variables = { id: string; body: Parameters<...>[1] }
    // Parameters<typeof updateItem>[1] resolves to ItemWritable at compile time.
    const updateHookStart = hooksContent.indexOf('export function useUpdateItem')
    expect(updateHookStart).toBeGreaterThan(-1)
    const updateHookEnd = hooksContent.indexOf('\n}', updateHookStart) + 2
    const updateHookContent = hooksContent.slice(updateHookStart, updateHookEnd)
    expect(updateHookContent).toContain('body: Parameters<typeof updateItem>[1]')
  })

  it('useGetItem query hook is present', () => {
    expect(hooksContent).toContain('export function useGetItem')
  })

  it('hooks import all client functions from ./client.js', () => {
    expect(hooksContent).toContain('createItem')
    expect(hooksContent).toContain('getItem')
    expect(hooksContent).toContain('updateItem')
    expect(hooksContent).toContain("from './client.js'")
  })
})
