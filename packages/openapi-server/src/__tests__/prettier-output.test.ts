import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { check } from 'prettier'
import { describe, it, expect, afterEach } from 'vitest'
import { generate } from '../generator.js'

const petstoreFixture = join(import.meta.dirname, '../__fixtures__/petstore.json')

let tmpDir: string | undefined

afterEach(async () => {
  if (tmpDir) {
    const { rm } = await import('node:fs/promises')
    await rm(tmpDir, { recursive: true, force: true })
    tmpDir = undefined
  }
})

async function runGenerator(extra: Record<string, unknown> = {}): Promise<string> {
  tmpDir = await mkdtemp(join(tmpdir(), 'openapi-server-prettier-test-'))
  const configPath = join(tmpDir, 'openapi-server.config.json')
  const outDir = join(tmpDir, 'generated')
  await writeFile(
    configPath,
    JSON.stringify({ input_openapi: petstoreFixture, output: outDir, ...extra }),
    'utf-8'
  )
  await generate(tmpDir, configPath)
  return outDir
}

describe('generated output is Prettier-clean', () => {
  it('service.ts is Prettier-clean', async () => {
    const outDir = await runGenerator()
    const content = await readFile(join(outDir, 'service.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })

  it('router.ts is Prettier-clean (hono framework)', async () => {
    const outDir = await runGenerator({ framework: 'hono' })
    const content = await readFile(join(outDir, 'router.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })

  it('router.ts is Prettier-clean (express framework)', async () => {
    const outDir = await runGenerator({ framework: 'express' })
    const content = await readFile(join(outDir, 'router.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })

  it('router.ts is Prettier-clean (fastify framework)', async () => {
    const outDir = await runGenerator({ framework: 'fastify' })
    const content = await readFile(join(outDir, 'router.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })
})
