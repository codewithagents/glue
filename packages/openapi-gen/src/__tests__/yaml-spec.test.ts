import { describe, it, expect } from 'vitest'
import { parseSpec } from '../parser.js'
import { generateTypes } from '../plugins/types.js'
import { generateClient } from '../plugins/client.js'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const simpleApiYaml = join(__dirname, '../__fixtures__/specs/simple-api.yaml')

describe('YAML spec support', () => {
  it('parses a YAML spec without throwing', async () => {
    await expect(parseSpec(simpleApiYaml)).resolves.toBeDefined()
  })

  it('generates models.ts from YAML spec', async () => {
    const spec = await parseSpec(simpleApiYaml)
    const { content, filename } = generateTypes(spec)
    expect(filename).toBe('models.ts')
    expect(content).toContain('interface Item')
  })

  it('generates client.ts from YAML spec', async () => {
    const spec = await parseSpec(simpleApiYaml)
    const { content, filename } = generateClient(spec)
    expect(filename).toBe('client.ts')
    expect(content).toContain('listItems')
    expect(content).toContain('getItem')
    expect(content).toContain('deleteItem')
  })

  it('YAML spec produces same operationIds as defined in the spec', async () => {
    const spec = await parseSpec(simpleApiYaml)
    const { content } = generateClient(spec)
    expect(content).toContain('export async function listItems(')
    expect(content).toContain('export async function getItem(')
    expect(content).toContain('export async function deleteItem(')
  })

  it('YAML spec generates correct TypeScript model properties', async () => {
    const spec = await parseSpec(simpleApiYaml)
    const { content } = generateTypes(spec)
    // Item has id (required string) and name (required string)
    expect(content).toContain('id: string')
    expect(content).toContain('name: string')
  })
})
