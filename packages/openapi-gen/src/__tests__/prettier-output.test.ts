import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { check } from 'prettier'
import { describe, it, expect, afterEach } from 'vitest'
import { generate } from '../generator.js'

const taskApiFixture = join(import.meta.dirname, '../__fixtures__/specs/task-api.json')
const featureShowcaseFixture = join(import.meta.dirname, '../__fixtures__/specs/feature-showcase.json')

let tmpDir: string | undefined

afterEach(async () => {
  if (tmpDir) {
    const { rm } = await import('node:fs/promises')
    await rm(tmpDir, { recursive: true, force: true })
    tmpDir = undefined
  }
})

async function runGenerator(specPath: string, extra: Record<string, unknown> = {}): Promise<string> {
  tmpDir = await mkdtemp(join(tmpdir(), 'openapi-gen-prettier-test-'))
  const configPath = join(tmpDir, 'openapi-gen.config.json')
  const outDir = join(tmpDir, 'generated')
  await writeFile(
    configPath,
    JSON.stringify({ input_openapi: specPath, output: outDir, ...extra }),
    'utf-8',
  )
  await generate(tmpDir, configPath)
  return outDir
}

describe('generated output is Prettier-clean (task-api)', () => {
  it('client.ts is Prettier-clean', async () => {
    const outDir = await runGenerator(taskApiFixture)
    const content = await readFile(join(outDir, 'client.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })

  it('models.ts is Prettier-clean', async () => {
    const outDir = await runGenerator(taskApiFixture)
    const content = await readFile(join(outDir, 'models.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })

  it('client-config.ts is Prettier-clean', async () => {
    const outDir = await runGenerator(taskApiFixture)
    const content = await readFile(join(outDir, 'client-config.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })

  it('index.ts is Prettier-clean', async () => {
    const outDir = await runGenerator(taskApiFixture)
    const content = await readFile(join(outDir, 'index.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })
})

describe('generated output is Prettier-clean (feature-showcase with multipart)', () => {
  it('client.ts is Prettier-clean', async () => {
    const outDir = await runGenerator(featureShowcaseFixture)
    const content = await readFile(join(outDir, 'client.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })
})
