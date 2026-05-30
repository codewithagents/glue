import { mkdtemp, readFile, writeFile, access } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { check } from 'prettier'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { generate } from '../generator.js'

const taskApiFixture = join(import.meta.dirname, '../__fixtures__/specs/task-api.json')

let tmpDir: string | undefined

afterEach(async () => {
  if (tmpDir) {
    const { rm } = await import('node:fs/promises')
    await rm(tmpDir, { recursive: true, force: true })
    tmpDir = undefined
  }
  vi.restoreAllMocks()
})

async function makeConfig(
  specPath: string,
  extra: Record<string, unknown> = {}
): Promise<{ tmpDir: string; configPath: string; outDir: string; schemaPath: string }> {
  const dir = await mkdtemp(join(tmpdir(), 'openapi-gen-schema-test-'))
  tmpDir = dir
  const outDir = join(dir, 'generated')
  const schemaPath = join(dir, 'schemas.ts')
  const configPath = join(dir, 'openapi-gen.config.json')
  await writeFile(
    configPath,
    JSON.stringify({ input_openapi: specPath, output: outDir, input_schema: schemaPath, ...extra }),
    'utf-8'
  )
  return { tmpDir: dir, configPath, outDir, schemaPath }
}

// ── First-run: bootstrap ───────────────────────────────────────────────────────

describe('schema-enhanced mode — first run (bootstrap)', () => {
  it('bootstraps schemas.ts when input_schema does not exist yet', async () => {
    const { configPath, tmpDir: dir, schemaPath } = await makeConfig(taskApiFixture)
    await generate(dir, configPath)
    const content = await readFile(schemaPath, 'utf-8')
    expect(content).toContain('z.object(')
  })

  it('bootstrapped schemas.ts contains a schema for each OpenAPI component schema', async () => {
    const { configPath, tmpDir: dir, schemaPath } = await makeConfig(taskApiFixture)
    await generate(dir, configPath)
    const content = await readFile(schemaPath, 'utf-8')
    // task-api.json has Task, TaskPage, CreateTaskRequest, UpdateTaskRequest schemas
    expect(content).toContain('TaskSchema')
    expect(content).toContain('CreateTaskRequestSchema')
  })

  it('also generates models.ts, client.ts, index.ts on first run', async () => {
    const { configPath, tmpDir: dir, outDir } = await makeConfig(taskApiFixture)
    await generate(dir, configPath)
    await expect(access(join(outDir, 'models.ts'))).resolves.toBeUndefined()
    await expect(access(join(outDir, 'client.ts'))).resolves.toBeUndefined()
    await expect(access(join(outDir, 'index.ts'))).resolves.toBeUndefined()
  })
})

// ── Second-run: schema-enhanced re-generation ─────────────────────────────────

describe('schema-enhanced mode — second run (re-generate with z.infer)', () => {
  it('models.ts uses z.infer types on second run', async () => {
    const { configPath, tmpDir: dir } = await makeConfig(taskApiFixture)
    await generate(dir, configPath) // first: bootstrap
    await generate(dir, configPath) // second: schema-enhanced
    const models = await readFile(join(dir, 'generated', 'models.ts'), 'utf-8')
    expect(models).toContain('z.infer')
  })

  it('client.ts includes Zod parse calls on second run', async () => {
    const { configPath, tmpDir: dir } = await makeConfig(taskApiFixture)
    await generate(dir, configPath)
    await generate(dir, configPath)
    const client = await readFile(join(dir, 'generated', 'client.ts'), 'utf-8')
    expect(client).toContain('.parse(')
  })

  it('does NOT overwrite schemas.ts on second run', async () => {
    const { configPath, tmpDir: dir, schemaPath } = await makeConfig(taskApiFixture)
    await generate(dir, configPath)
    const original = await readFile(schemaPath, 'utf-8')
    await writeFile(schemaPath, original + '\n// user customisation', 'utf-8')
    await generate(dir, configPath)
    const after = await readFile(schemaPath, 'utf-8')
    expect(after).toContain('// user customisation')
  })

  it('schema-enhanced models.ts is Prettier-clean', async () => {
    const { configPath, tmpDir: dir } = await makeConfig(taskApiFixture)
    await generate(dir, configPath)
    await generate(dir, configPath)
    const content = await readFile(join(dir, 'generated', 'models.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })

  it('schema-enhanced client.ts is Prettier-clean', async () => {
    const { configPath, tmpDir: dir } = await makeConfig(taskApiFixture)
    await generate(dir, configPath)
    await generate(dir, configPath)
    const content = await readFile(join(dir, 'generated', 'client.ts'), 'utf-8')
    expect(await check(content, { parser: 'typescript' })).toBe(true)
  })
})

// ── Drift detection ────────────────────────────────────────────────────────────

describe('schema-enhanced mode — drift detection', () => {
  it('warns to stderr when a spec schema has no matching schema in input_schema', async () => {
    const { configPath, tmpDir: dir, schemaPath } = await makeConfig(taskApiFixture)

    // Pre-write a schema file that only covers some spec schemas (omits Tag and CreateTaskRequest)
    // so the generator will warn about the missing ones
    await writeFile(
      schemaPath,
      [
        "import { z } from 'zod'",
        'export const TaskStatusSchema = z.enum(["pending", "in_progress", "done"])',
        'export const TaskSchema = z.object({ id: z.string(), title: z.string() })',
        // TagSchema and CreateTaskRequestSchema intentionally omitted → drift
      ].join('\n'),
      'utf-8'
    )

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await generate(dir, configPath)
    const warned = warnSpy.mock.calls.map((c) => c.join(' ')).join('\n')
    // Generator should warn about Tag and CreateTaskRequest being missing
    expect(warned).toContain('Tag')
    expect(warned.toLowerCase()).toContain('drift')
  })

  it('does NOT warn when all spec schemas are present in input_schema', async () => {
    const { configPath, tmpDir: dir } = await makeConfig(taskApiFixture)
    await generate(dir, configPath) // bootstrap

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await generate(dir, configPath) // re-generate with full schema file
    expect(warnSpy).not.toHaveBeenCalled()
  })
})
