import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export interface Config {
  /** Path to the OpenAPI 3.1 spec file (JSON or YAML) */
  input_openapi: string
  /** Path to user-owned Zod schema file (.ts). Optional — bootstrapped on first run if absent. */
  input_schema?: string
  /** Directory to write generated files */
  output: string
  /** Base URL prefix for generated fetch client (default: '') */
  baseUrl?: string
  /** When true, generates server.ts with a createServerClient() factory for Next.js RSC (default: false) */
  server_client?: boolean
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
    const normalizedForbidden = forbidden.replace(/\\/g, '/')
    if (normalized === normalizedForbidden || normalized.startsWith(normalizedForbidden + '/')) {
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
    const normalizedForbidden = forbidden.replace(/\\/g, '/')
    if (normalized === normalizedForbidden || normalized.startsWith(normalizedForbidden + '/')) {
      throw new Error(
        `Input spec path resolves to a system directory: "${resolvedInput}". ` +
        `This looks like a misconfiguration — please check your config file.`
      )
    }
  }
}

export async function loadConfig(cwd: string, configPath?: string): Promise<Config> {
  const resolvedConfigPath = configPath ?? join(cwd, 'openapi-gen.config.json')

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
  if (
    config['input_schema'] !== undefined &&
    (typeof config['input_schema'] !== 'string' || !config['input_schema'])
  ) {
    throw new Error('"input_schema" must be a non-empty string path to your Zod schema file')
  }
  if (config['server_client'] !== undefined && typeof config['server_client'] !== 'boolean') {
    throw new Error('"server_client" must be a boolean')
  }

  // Security: validate resolved input and output paths
  const resolvedInput = resolve(cwd, config['input_openapi'] as string)
  const resolvedOutput = resolve(cwd, config['output'] as string)
  validateInputPath(resolvedInput)
  validateOutputPath(resolvedOutput)

  return {
    input_openapi: config['input_openapi'] as string,
    input_schema: config['input_schema'] as string | undefined,
    output: config['output'] as string,
    baseUrl: typeof config['baseUrl'] === 'string' ? config['baseUrl'] : undefined,
    server_client: config['server_client'] as boolean | undefined,
  }
}
