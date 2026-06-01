import { resolve, dirname } from 'node:path'

/** The parsed result of CLI arguments. */
export type CliAction =
  | { action: 'help' }
  | { action: 'version' }
  | { action: 'run'; configFile?: string; cwd: string }
  | { action: 'error'; message: string }

/**
 * Parse raw process.argv into a structured action.
 *
 * Pure function: no I/O, no process.exit. Testable in isolation.
 *
 * @param argv  process.argv (first two entries are node + script path)
 * @param cwd   the working directory to resolve paths against
 */
export function parseCliArgs(argv: string[], cwd: string): CliAction {
  const args = argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    return { action: 'help' }
  }

  if (args.includes('--version') || args.includes('-v')) {
    return { action: 'version' }
  }

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
    const configFile = resolve(cwd, next)
    // Relative paths inside the config resolve from the config file's directory,
    // not from the shell's CWD. This matches how most tooling works.
    return { action: 'run', configFile, cwd: dirname(configFile) }
  }

  return { action: 'run', cwd }
}
