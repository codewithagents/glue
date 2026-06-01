import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { loadConfig, type Config } from './config.js'
import { parseSpec } from './parser.js'
import { generateTypes } from './plugins/types.js'
import { generateClientConfig } from './plugins/client-config.js'
import { generateClient, hasCookieAuth, detectAuthSchemes } from './plugins/client.js'
import { generateZodSchemas } from './plugins/zod.js'
import { generateIndexBarrel } from './plugins/index-barrel.js'
import { generateServer } from './plugins/server.js'

/** Options accepted by generate(). */
export interface GenerateOptions {
  /** Path to config file. */
  configPath?: string
  /** Overrides config.input_openapi. Resolved from shell CWD before this call. */
  inputOverride?: string
  /** Overrides config.output. Resolved from shell CWD before this call. */
  outputOverride?: string
}

async function formatTs(content: string, filePath: string): Promise<string> {
  const { format, resolveConfig } = await import('prettier')
  const config = await resolveConfig(filePath)
  return format(content, { ...config, parser: 'typescript' })
}

/** Apply --input/--output overrides to an already-loaded config. */
function applyOverrides(config: Config, opts: GenerateOptions): Config {
  const result = { ...config }
  if (opts.inputOverride !== undefined) {
    result.input_openapi = opts.inputOverride
  }
  if (opts.outputOverride !== undefined) {
    result.output = opts.outputOverride
  }
  return result
}

// fallow-ignore-next-line complexity
export async function generate(cwd: string, opts?: GenerateOptions | string): Promise<void> {
  // Back-compat: accept a plain configPath string as second arg (old call sites).
  const options: GenerateOptions = typeof opts === 'string' ? { configPath: opts } : (opts ?? {})

  console.log('Loading config...')

  // When --input AND --output are both provided we can skip loading a config file entirely.
  const skipConfig =
    options.inputOverride !== undefined &&
    options.outputOverride !== undefined &&
    options.configPath === undefined

  let config: Config
  if (skipConfig) {
    config = {
      input_openapi: options.inputOverride as string,
      output: options.outputOverride as string,
    }
  } else {
    config = applyOverrides(await loadConfig(cwd, options.configPath), options)
  }

  // When overrides supply absolute paths, resolve them directly; otherwise resolve from cwd.
  const inputPath =
    options.inputOverride !== undefined ? options.inputOverride : resolve(cwd, config.input_openapi)
  const outputDir =
    options.outputOverride !== undefined ? options.outputOverride : resolve(cwd, config.output)

  console.log(`Parsing spec: ${inputPath}`)
  const spec = await parseSpec(inputPath)

  const generatedFiles = []

  // Phase 1: always generate types
  generatedFiles.push(generateTypes(spec))

  // Phase 2: always generate client config, fetch client, and barrel index
  const cookieAuth = hasCookieAuth(spec)
  const authSchemes = detectAuthSchemes(spec)
  generatedFiles.push(
    generateClientConfig(
      cookieAuth ? { defaultCredentials: 'include', authSchemes } : { authSchemes }
    )
  )
  generatedFiles.push(generateClient(spec))
  generatedFiles.push(generateIndexBarrel())

  console.log(`Writing output to: ${outputDir}`)
  await mkdir(outputDir, { recursive: true })

  for (const file of generatedFiles) {
    const filePath = join(outputDir, file.filename)
    await writeFile(filePath, await formatTs(file.content, filePath), 'utf-8')
    console.log(`  ✓ ${file.filename}`)
  }

  // Phase 3: optional server client factory
  if (config.server_client === true) {
    const serverFile = generateServer(spec)
    const serverFilePath = join(outputDir, serverFile.filename)
    await writeFile(serverFilePath, await formatTs(serverFile.content, serverFilePath), 'utf-8')
    console.log(`  ✓ ${serverFile.filename}`)
  }

  // Phase 4: Zod schema bootstrap. Write once, never overwrite.
  if (config.input_schema !== undefined) {
    const schemaPath = resolve(cwd, config.input_schema)
    let schemaExists = false
    try {
      await access(schemaPath)
      schemaExists = true
    } catch {
      // file does not exist, bootstrap it
    }

    if (schemaExists) {
      console.log(`Skipping ${config.input_schema}: already exists (edit freely, it's yours).`)

      // Phase 5: Schema-enhanced generation. Re-generate models.ts and client.ts with Zod integration.
      const content = await readFile(schemaPath, 'utf-8')
      const exportedSchemas = new Set<string>()
      for (const match of content.matchAll(/^export\s+const\s+(\w+Schema)\b/gm)) {
        exportedSchemas.add(match[1]!)
      }

      // Drift detection: warn to stderr for missing schemas.
      const specSchemaNames = Object.keys(spec.components?.schemas ?? {})
      for (const name of specSchemaNames) {
        if (!exportedSchemas.has(`${name}Schema`)) {
          console.warn(
            `⚠  Drift: ${name}Schema is in the OpenAPI spec but not found in ${config.input_schema}. Run with --reset-schema to re-bootstrap.`
          )
        }
      }

      // Compute relative import path for use in generated imports
      const relPath = relative(outputDir, schemaPath)
      // 'schemas.ts' -> './schemas.js', '../schemas.ts' -> '../schemas.js'
      const schemaImportPath =
        (relPath.startsWith('.') ? '' : './') + relPath.replace(/\.ts$/, '.js')

      // Re-generate (overwrite) models.ts and client.ts with schema-enhanced versions
      const enhancedTypes = generateTypes(spec, { schemaNames: exportedSchemas, schemaImportPath })
      const enhancedClient = generateClient(spec, {
        schemaNames: exportedSchemas,
        schemaImportPath,
      })
      const enhancedTypesPath = join(outputDir, enhancedTypes.filename)
      const enhancedClientPath = join(outputDir, enhancedClient.filename)
      await writeFile(
        enhancedTypesPath,
        await formatTs(enhancedTypes.content, enhancedTypesPath),
        'utf-8'
      )
      await writeFile(
        enhancedClientPath,
        await formatTs(enhancedClient.content, enhancedClientPath),
        'utf-8'
      )
      console.log(`  ✓ models.ts (schema-enhanced, types from z.infer)`)
      console.log(`  ✓ client.ts (schema-enhanced, Zod validation added)`)
    } else {
      const zodFile = generateZodSchemas(spec)
      await writeFile(schemaPath, zodFile.content, 'utf-8')
      console.log(`  ✓ ${config.input_schema} (bootstrapped: edit freely, won't be overwritten)`)
    }
  }

  console.log(`Done! Generated ${generatedFiles.length} file(s).`)
}
