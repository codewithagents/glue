import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { check } from 'prettier'
import { describe, it, expect, afterEach } from 'vitest'
import { generate } from '../generator.js'

const taskHooksFixture = join(import.meta.dirname, '../../__fixtures__/specs/task-hooks.json')

let tmpDir: string | undefined

afterEach(async () => {
  if (tmpDir) {
    const { rm } = await import('node:fs/promises')
    await rm(tmpDir, { recursive: true, force: true })
    tmpDir = undefined
  }
})

async function runGenerator(): Promise<string> {
  tmpDir = await mkdtemp(join(tmpdir(), 'openapi-react-query-prettier-test-'))
  const configPath = join(tmpDir, 'openapi-react-query.config.json')
  const outDir = join(tmpDir, 'generated')
  await writeFile(
    configPath,
    JSON.stringify({ input_openapi: taskHooksFixture, output: outDir }),
    'utf-8',
  )
  await generate(tmpDir, configPath)
  return outDir
}

describe('generated output is Prettier-clean (task-hooks)', () => {
  it('hooks.ts is Prettier-clean', async () => {
    const outDir = await runGenerator()
    const content = await readFile(join(outDir, 'hooks.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })

  it('test-utils.ts is Prettier-clean', async () => {
    const outDir = await runGenerator()
    const content = await readFile(join(outDir, 'test-utils.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })
})
