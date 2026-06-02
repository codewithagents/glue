import { resolve } from 'node:path'
import { type CliAction as BaseCliAction, parseBaseCliArgs } from './cli-core.js'

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

const CONFIG_USAGE = 'Usage: openapi-gen [--config <path-to-config.json>]'

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

  const base: BaseCliAction = parseBaseCliArgs(argv, cwd, CONFIG_USAGE)

  if (base.action === 'help' || base.action === 'version' || base.action === 'error') {
    return base
  }

  const watch = args.includes('--watch')

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

  return {
    action: 'run',
    configFile: base.configFile,
    cwd: base.cwd,
    ...(inputOverride !== undefined && { inputOverride }),
    ...(outputOverride !== undefined && { outputOverride }),
    watch,
  }
}
