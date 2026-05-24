import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export interface ReactQueryConfig {
  /** Path to OpenAPI 3.1 spec file (JSON or YAML) */
  input_openapi: string
  /** Directory to write generated files */
  output: string
  /** staleTime in ms for all useQuery hooks (default: 0) */
  stale_time?: number
  /** gcTime in ms for all useQuery hooks (default: 300000) */
  gc_time?: number
}

const FORBIDDEN_OUTPUT_PREFIXES = [
  '/etc', '/usr', '/bin', '/sbin', '/lib', '/lib64',
  '/sys', '/proc', '/dev', '/boot', '/run',
  'C:\\Windows', 'C:\\Program Files',
]

const FORBIDDEN_INPUT_PREFIXES = [
  '/etc', '/usr', '/bin', '/sbin', '/lib', '/lib64',
  '/sys', '/proc', '/dev',
  'C:\\Windows', 'C:\\Program Files',
]

export function validateConfigPath(configPath: string): void {
  // Must end in .json — prevents accidentally loading non-config files
  if (!configPath.endsWith('.json')) {
    throw new Error(`Config file must be a .json file, got: ${configPath}`)
  }
}

export function validateOutputPath(resolvedOutput: string): void {
  const normalized = resolvedOutput.replace(/\\/g, '/')
  for (const forbidden of FORBIDDEN_OUTPUT_PREFIXES) {
    if (normalized.startsWith(forbidden.replace(/\\/g, '/'))) {
      throw new Error(
        `Output path resolves to a system directory: "${resolvedOutput}". ` +
        `This looks like a misconfiguration — please check your config file.`
      )
    }
  }
}

export function validateInputPath(resolvedInput: string): void {
  const normalized = resolvedInput.replace(/\\/g, '/')
  for (const forbidden of FORBIDDEN_INPUT_PREFIXES) {
    if (normalized.startsWith(forbidden.replace(/\\/g, '/'))) {
      throw new Error(
        `Input spec path resolves to a system directory: "${resolvedInput}". ` +
        `This looks like a misconfiguration — please check your config file.`
      )
    }
  }
}

export async function loadConfig(cwd: string, configPath?: string): Promise<ReactQueryConfig> {
  const resolvedConfigPath = configPath ?? join(cwd, 'openapi-react-query.config.json')

  // Security: validate config path extension when explicitly provided
  if (configPath !== undefined) {
    validateConfigPath(configPath)
  }

  let raw: string
  try {
    raw = await readFile(resolvedConfigPath, 'utf-8')
  } catch {
    throw new Error(`Config file not found: ${resolvedConfigPath}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(`Config file is not valid JSON: ${resolvedConfigPath}`)
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Config must be a JSON object')
  }

  const config = parsed as Record<string, unknown>

  if (typeof config['input_openapi'] !== 'string' || !config['input_openapi']) {
    throw new Error('Config missing required field: "input_openapi" (path to OpenAPI 3.1 spec)')
  }
  if (typeof config['output'] !== 'string' || !config['output']) {
    throw new Error('Config missing required field: "output" (output directory)')
  }
  if (config['stale_time'] !== undefined && typeof config['stale_time'] !== 'number') {
    throw new Error('"stale_time" must be a number (milliseconds)')
  }
  if (config['gc_time'] !== undefined && typeof config['gc_time'] !== 'number') {
    throw new Error('"gc_time" must be a number (milliseconds)')
  }

  // Security: validate resolved input and output paths
  const resolvedInput = resolve(cwd, config['input_openapi'] as string)
  const resolvedOutput = resolve(cwd, config['output'] as string)
  validateInputPath(resolvedInput)
  validateOutputPath(resolvedOutput)

  return {
    input_openapi: config['input_openapi'] as string,
    output: config['output'] as string,
    stale_time: config['stale_time'] as number | undefined,
    gc_time: config['gc_time'] as number | undefined,
  }
}
