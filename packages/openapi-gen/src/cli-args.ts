import { resolve, dirname } from 'node:path'

/** The parsed result of CLI arguments. */
export type CliAction =
  | { action: 'help' }
  | { action: 'version' }
  | {
      action: 'run'
      configFile?: string
      cwd: string
      /** Overrides config input_openapi when provided via --input */
      inputOverride?: string
      /** Overrides config output when provided via --output */
      outputOverride?: string
      watch: boolean
    }
  | { action: 'error'; message: string }

/**
 * Parse raw process.argv into a structured action.
 *
 * Pure function: no I/O, no process.exit. Testable in isolation.
 *
 * @param argv  process.argv (first two entries are node + script path)
 * @param cwd   the working directory to resolve paths against
 */
// fallow-ignore-next-line complexity
export function parseCliArgs(argv: string[], cwd: string): CliAction {
  const args = argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    return { action: 'help' }
  }

  if (args.includes('--version') || args.includes('-v')) {
    return { action: 'version' }
  }

  const watch = args.includes('--watch')

  let configFile: string | undefined
  const configIdx = args.indexOf('--config')
  if (configIdx !== -1) {
    const next = args[configIdx + 1]
    if (next === undefined || next.startsWith('--')) {
      return {
        action: 'error',
        message: [
          'Error: --config requires a file path argument',
          'Usage: openapi-gen [--config <path-to-config.json>]',
        ].join('\n'),
      }
    }
    configFile = resolve(cwd, next)
  }

  let inputOverride: string | undefined
  const inputIdx = args.indexOf('--input')
  if (inputIdx !== -1) {
    const next = args[inputIdx + 1]
    if (next === undefined || next.startsWith('--')) {
      return {
        action: 'error',
        message: [
          'Error: --input requires a file path argument',
          'Usage: openapi-gen [--input <path-to-spec>]',
        ].join('\n'),
      }
    }
    inputOverride = resolve(cwd, next)
  }

  let outputOverride: string | undefined
  const outputIdx = args.indexOf('--output')
  if (outputIdx !== -1) {
    const next = args[outputIdx + 1]
    if (next === undefined || next.startsWith('--')) {
      return {
        action: 'error',
        message: [
          'Error: --output requires a directory path argument',
          'Usage: openapi-gen [--output <output-dir>]',
        ].join('\n'),
      }
    }
    outputOverride = resolve(cwd, next)
  }

  // When --config was provided, resolve cwd from the config file's directory (as before).
  // When only --input/--output are provided (no --config), keep cwd as-is.
  const resolvedCwd = configFile !== undefined ? dirname(configFile) : cwd

  return {
    action: 'run',
    configFile,
    cwd: resolvedCwd,
    ...(inputOverride !== undefined && { inputOverride }),
    ...(outputOverride !== undefined && { outputOverride }),
    watch,
  }
}
