import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { parseSpec } from '@codewithagents/openapi-gen'
import { loadConfig } from './config.js'
import { generateHooks } from './plugins/hooks.js'
import { generateTestUtils } from './plugins/test-utils.js'

export async function generate(cwd: string, configPath?: string): Promise<void> {
  const config = await loadConfig(cwd, configPath)
  const inputPath = resolve(cwd, config.input_openapi)
  const outputDir = resolve(cwd, config.output)
  const spec = await parseSpec(inputPath)
  const globalStaleTime = config.stale_time ?? 0
  const globalGcTime = config.gc_time ?? 300_000

  // Convert snake_case config overrides to camelCase options
  const overrides: Record<string, { staleTime: number; gcTime: number }> = {}
  if (config.overrides) {
    for (const [resource, timing] of Object.entries(config.overrides)) {
      overrides[resource] = {
        staleTime: timing.stale_time ?? globalStaleTime,
        gcTime: timing.gc_time ?? globalGcTime,
      }
    }
  }

  const files = [
    generateHooks(spec, {
      staleTime: globalStaleTime,
      gcTime: globalGcTime,
      suspense: config.suspense,
      overrides: Object.keys(overrides).length > 0 ? overrides : undefined,
      autoInvalidate: config.auto_invalidate,
    }),
    generateTestUtils(spec),
  ]

  await mkdir(outputDir, { recursive: true })
  for (const file of files) {
    const filePath = join(outputDir, file.filename)
    await writeFile(filePath, file.content, 'utf-8')
    console.log(`✓ ${file.filename}`)
  }
}
