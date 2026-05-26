import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { loadConfig } from './config.js'
import { parseSpec } from '@codewithagents/openapi-gen'
import { generateService } from './plugins/service.js'
import { generateRouter } from './plugins/router.js'

export async function generate(cwd: string, configPath?: string): Promise<void> {
  console.log('Loading config...')
  const config = await loadConfig(cwd, configPath)

  const inputPath = resolve(cwd, config.input_openapi)
  const outputDir = resolve(cwd, config.output)
  const framework = config.framework ?? 'none'

  console.log(`Parsing spec: ${inputPath}`)
  const spec = await parseSpec(inputPath)

  const generatedFiles = []

  generatedFiles.push(generateService(spec))

  if (framework === 'hono') {
    const routerFile = generateRouter(spec, framework)
    if (routerFile !== undefined) {
      generatedFiles.push(routerFile)
    }
  }

  console.log(`Writing output to: ${outputDir}`)
  await mkdir(outputDir, { recursive: true })

  for (const file of generatedFiles) {
    const filePath = join(outputDir, file.filename)
    await writeFile(filePath, file.content, 'utf-8')
    console.log(`  ✓ ${file.filename}`)
  }

  console.log(`Done! Generated ${generatedFiles.length} file(s).`)
}
