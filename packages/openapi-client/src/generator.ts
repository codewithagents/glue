import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { loadConfig } from './config.js'
import { parseSpec } from './parser.js'
import { generateTypes } from './plugins/types.js'

export async function generate(cwd: string): Promise<void> {
  console.log('Loading config...')
  const config = await loadConfig(cwd)

  const inputPath = resolve(cwd, config.input)
  const outputDir = resolve(cwd, config.output)

  console.log(`Parsing spec: ${inputPath}`)
  const spec = await parseSpec(inputPath)

  const generatedFiles = []

  for (const plugin of config.plugins) {
    if (plugin === 'types') {
      console.log('Running plugin: types')
      generatedFiles.push(generateTypes(spec))
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
