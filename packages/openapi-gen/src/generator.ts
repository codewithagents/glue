import { access, mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { loadConfig } from './config.js'
import { parseSpec } from './parser.js'
import { generateTypes } from './plugins/types.js'
import { generateClientConfig } from './plugins/client-config.js'
import { generateClient, hasCookieAuth } from './plugins/client.js'
import { generateZodSchemas } from './plugins/zod.js'
import { generateIndexBarrel } from './plugins/index-barrel.js'
import { generateServer } from './plugins/server.js'

export async function generate(cwd: string, configPath?: string): Promise<void> {
  console.log('Loading config...')
  const config = await loadConfig(cwd, configPath)

  const inputPath = resolve(cwd, config.input_openapi)
  const outputDir = resolve(cwd, config.output)

  console.log(`Parsing spec: ${inputPath}`)
  const spec = await parseSpec(inputPath)

  const generatedFiles = []

  // Phase 1: always generate types
  generatedFiles.push(generateTypes(spec))

  // Phase 2: always generate client config, fetch client, and barrel index
  const cookieAuth = hasCookieAuth(spec)
  generatedFiles.push(generateClientConfig(cookieAuth ? { defaultCredentials: 'include' } : undefined))
  generatedFiles.push(generateClient(spec))
  generatedFiles.push(generateIndexBarrel())

  console.log(`Writing output to: ${outputDir}`)
  await mkdir(outputDir, { recursive: true })

  for (const file of generatedFiles) {
    const filePath = join(outputDir, file.filename)
    await writeFile(filePath, file.content, 'utf-8')
    console.log(`  ✓ ${file.filename}`)
  }

  // Phase 3: optional server client factory
  if (config.server_client === true) {
    const serverFile = generateServer(spec)
    const serverFilePath = join(outputDir, serverFile.filename)
    await writeFile(serverFilePath, serverFile.content, 'utf-8')
    console.log(`  ✓ ${serverFile.filename}`)
  }

  // Phase 4: Zod schema bootstrap — write once, never overwrite
  if (config.input_schema !== undefined) {
    const schemaPath = resolve(cwd, config.input_schema)
    let schemaExists = false
    try {
      await access(schemaPath)
      schemaExists = true
    } catch {
      // file does not exist — bootstrap it
    }

    if (schemaExists) {
      console.log(`Skipping ${config.input_schema} — already exists (edit freely, it's yours).`)
    } else {
      const zodFile = generateZodSchemas(spec)
      await writeFile(schemaPath, zodFile.content, 'utf-8')
      console.log(`  ✓ ${config.input_schema} (bootstrapped — edit freely, won't be overwritten)`)
    }
  }

  console.log(`Done! Generated ${generatedFiles.length} file(s).`)
}
