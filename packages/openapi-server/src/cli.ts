#!/usr/bin/env node
import { resolve, dirname } from 'node:path'
import { generate } from './generator.js'

const args = process.argv.slice(2)
const configIdx = args.indexOf('--config')

let cwd = process.cwd()
let configFile: string | undefined

if (configIdx !== -1) {
  const next = args[configIdx + 1]
  if (next === undefined || next.startsWith('--')) {
    console.error('Error: --config requires a file path argument')
    console.error('Usage: openapi-server [--config <path-to-config.json>]')
    process.exit(1)
  }
  configFile = resolve(cwd, next)
  // Relative paths inside the config resolve from the config file's directory,
  // not from the shell's CWD. This matches how most tooling works.
  cwd = dirname(configFile)
}

generate(cwd, configFile).catch((err: Error) => {
  console.error(`Error: ${err.message}`)
  process.exit(1)
})
