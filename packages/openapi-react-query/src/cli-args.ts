import { type CliAction, parseBaseCliArgs } from '@codewithagents/openapi-gen/cli-core'

export type { CliAction }

const USAGE = 'Usage: openapi-react-query [--config <path-to-config.json>]'

/**
 * Parse raw process.argv into a structured action.
 *
 * Pure function: no I/O, no process.exit. Testable in isolation.
 *
 * @param argv  process.argv (first two entries are node + script path)
 * @param cwd   the working directory to resolve paths against
 */
export function parseCliArgs(argv: string[], cwd: string): CliAction {
  return parseBaseCliArgs(argv, cwd, USAGE)
}
