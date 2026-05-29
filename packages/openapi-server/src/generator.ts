import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { loadConfig } from './config.js'

async function formatTs(content: string, filePath: string): Promise<string> {
  const { format, resolveConfig } = await import('prettier')
  const config = await resolveConfig(filePath)
  return format(content, { ...config, parser: 'typescript' })
}
import { parseSpec } from '@codewithagents/openapi-gen'
import { generateService } from './plugins/service.js'
import { generateRouter, generateExpressRouter, generateFastifyRouter } from './plugins/router.js'

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
    // First pass: generate router without schema validation
    generatedFiles.push(generateRouter(spec))
  } else if (framework === 'express') {
    // TODO: add Zod validation support for Express (currently Hono-only)
    generatedFiles.push(generateExpressRouter(spec))
  } else if (framework === 'fastify') {
    // TODO: add Zod validation support for Fastify (currently Hono-only)
    generatedFiles.push(generateFastifyRouter(spec))
  }

  console.log(`Writing output to: ${outputDir}`)
  await mkdir(outputDir, { recursive: true })

  for (const file of generatedFiles) {
    const filePath = join(outputDir, file.filename)
    await writeFile(filePath, await formatTs(file.content, filePath), 'utf-8')
    console.log(`  ✓ ${file.filename}`)
  }

  // Second pass: if input_schema is configured and file exists, re-generate router with Zod validation
  if (framework === 'hono' && config.input_schema !== undefined) {
    const schemaPath = resolve(cwd, config.input_schema)
    let schemaContent: string
    try {
      schemaContent = await readFile(schemaPath, 'utf-8')
    } catch {
      console.log(`  ℹ input_schema not found at ${schemaPath}, skipping Zod validation`)
      console.log(`Done! Generated ${generatedFiles.length} file(s).`)
      return
    }

    // Extract exported schema names from the schema file
    const exportedSchemas = new Set<string>()
    for (const match of schemaContent.matchAll(/^export\s+const\s+(\w+Schema)\b/gm)) {
      exportedSchemas.add(match[1]!)
    }

    if (exportedSchemas.size > 0) {
      // Compute relative import path from outputDir to schemaPath
      const relPath = relative(outputDir, schemaPath).replace(/\\/g, '/')
      // Ensure it starts with ./ or ../
      const schemaImportPath = relPath.startsWith('.') ? relPath : `./${relPath}`
      // Strip .ts extension for import (use .js for NodeNext compatibility)
      const schemaImportPathJs = schemaImportPath.replace(/\.ts$/, '.js')

      const routerFile = generateRouter(spec, {
        schemaNames: exportedSchemas,
        schemaImportPath: schemaImportPathJs,
      })
      const routerPath = join(outputDir, routerFile.filename)
      await writeFile(routerPath, await formatTs(routerFile.content, routerPath), 'utf-8')
      console.log(`  ✓ router.ts (with Zod validation for ${exportedSchemas.size} schema(s))`)
    }
  }

  console.log(`Done! Generated ${generatedFiles.length} file(s).`)
}
