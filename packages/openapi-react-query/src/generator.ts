import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { parseSpec } from '@codewithagents/openapi-gen'
import { loadConfig } from './config.js'
import { generateHooks } from './plugins/hooks.js'

export async function generate(cwd: string): Promise<void> {
  const config = await loadConfig(cwd)
  const inputPath = resolve(cwd, config.input_openapi)
  const outputDir = resolve(cwd, config.output)
  const spec = await parseSpec(inputPath)
  const file = generateHooks(spec, {
    staleTime: config.stale_time ?? 0,
    gcTime: config.gc_time ?? 300_000,
  })
  await mkdir(outputDir, { recursive: true })
  const filePath = join(outputDir, file.filename)
  await writeFile(filePath, file.content, 'utf-8')
  console.log(`✓ ${file.filename}`)
}
