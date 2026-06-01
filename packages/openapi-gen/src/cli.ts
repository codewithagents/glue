#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { watch } from 'node:fs'
import { join } from 'node:path'
import { generate } from './generator.js'
import { parseCliArgs } from './cli-args.js'

// esbuild bundles this file to CJS where __dirname is provided by Node.js.
// TypeScript does not know about __dirname in ESM source, so we declare it here.
// This file is excluded from tsc (tsconfig.build.json) and processed only by esbuild.
declare const __dirname: string

const parsed = parseCliArgs(process.argv, process.cwd())

if (parsed.action === 'help') {
  console.log(
    [
      'Usage: openapi-gen [options]',
      '',
      'Generate TypeScript models, a native fetch client, and Zod schemas from an OpenAPI 3.1 spec.',
      '',
      'Options:',
      '  --config <path>   Path to config file (default: openapi-gen.config.json in cwd)',
      '                    Supports .json, .js, .mjs, and .cjs config files',
      '  --input <path>    Path to OpenAPI spec file (overrides config input_openapi)',
      '  --output <dir>    Output directory (overrides config output)',
      '  --watch           Re-run generation on spec file changes (Ctrl-C to exit)',
      '  --help, -h        Show this help message',
      '  --version, -v     Show version number',
    ].join('\n')
  )
  process.exit(0)
}

if (parsed.action === 'version') {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, '../package.json'), 'utf-8')
  ) as { version: string }
  console.log(pkg.version)
  process.exit(0)
}

if (parsed.action === 'error') {
  console.error(parsed.message)
  process.exit(1)
}

const { cwd, configFile, inputOverride, outputOverride, watch: watchMode } = parsed

async function runGenerate(): Promise<void> {
  await generate(cwd, { configPath: configFile, inputOverride, outputOverride })
}

if (!watchMode) {
  runGenerate().catch((err: Error) => {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  })
} else {
  // Run immediately, then watch the spec file for changes.
  runGenerate().catch((err: Error) => {
    console.error(`Error: ${err.message}`)
  })

  // Resolve the spec path to watch. We need at least --input or a config to know the spec path.
  // For watch mode, we watch the resolved input path. If no input override, we derive it from config.
  // Use a small debounce to avoid triggering multiple re-runs on rapid file-save events.
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function resolveWatchPath(): Promise<string> {
    const { loadConfig } = await import('./config.js')
    const { resolve } = await import('node:path')
    if (inputOverride !== undefined) {
      return inputOverride
    }
    const config = await loadConfig(cwd, configFile)
    return resolve(cwd, config.input_openapi)
  }

  resolveWatchPath()
    .then((watchPath) => {
      console.log(`Watching for changes: ${watchPath}`)
      console.log('Press Ctrl-C to exit.')

      const watcher = watch(watchPath, () => {
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer)
        }
        debounceTimer = setTimeout(() => {
          console.log(`\n[watch] Change detected in ${watchPath} — regenerating...`)
          runGenerate().catch((err: Error) => {
            console.error(`Error: ${err.message}`)
          })
        }, 100)
      })

      process.on('SIGINT', () => {
        watcher.close()
        console.log('\nWatch mode stopped.')
        process.exit(0)
      })

      process.on('SIGTERM', () => {
        watcher.close()
        process.exit(0)
      })
    })
    .catch((err: Error) => {
      console.error(`Error setting up watch: ${err.message}`)
      process.exit(1)
    })
}
