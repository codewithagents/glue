import { resolve, dirname } from 'node:path'

/** The parsed result of CLI arguments (base flags common to all packages). */
export type CliAction =
  | { action: 'help' }
  | { action: 'version' }
  | { action: 'run'; configFile?: string; cwd: string }
  | { action: 'error'; message: string }

/**
 * Parse the common CLI flags shared across all packages.
 *
 * Handles: --help / -h, --version / -v, --config <path>.
 * Returns a CliAction discriminated union. Pure function: no I/O, no process.exit.
 *
 * @param argv   process.argv (first two entries are node + script path)
 * @param cwd    the working directory to resolve paths against
 * @param usage  full usage line shown in --config error messages, e.g.
 *               "Usage: openapi-react-query [--config <path-to-config.json>]"
 */
export function parseBaseCliArgs(argv: string[], cwd: string, usage: string): CliAction {
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
        message: ['Error: --config requires a file path argument', usage].join('\n'),
      }
    }
    const configFile = resolve(cwd, next)
    // Relative paths inside the config resolve from the config file's directory,
    // not from the shell's CWD. This matches how most tooling works.
    return { action: 'run', configFile, cwd: dirname(configFile) }
  }

  return { action: 'run', cwd }
}
