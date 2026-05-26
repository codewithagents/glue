import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export interface ServerConfig {
  /** Path to the OpenAPI 3.1 spec file (JSON or YAML) */
  input_openapi: string
  /** Directory to write generated files */
  output: string
  /** Framework to generate a router for. Default: 'none' */
  framework?: 'hono' | 'none'
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

export async function loadConfig(cwd: string, configPath?: string): Promise<ServerConfig> {
  const resolvedConfigPath = configPath ?? join(cwd, 'openapi-server.config.json')

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
    config['framework'] !== undefined &&
    config['framework'] !== 'hono' &&
    config['framework'] !== 'none'
  ) {
    throw new Error('"framework" must be either "hono" or "none"')
  }

  const resolvedInput = resolve(cwd, config['input_openapi'] as string)
  const resolvedOutput = resolve(cwd, config['output'] as string)
  validateInputPath(resolvedInput)
  validateOutputPath(resolvedOutput)

  return {
    input_openapi: config['input_openapi'] as string,
    output: config['output'] as string,
    framework: config['framework'] as 'hono' | 'none' | undefined,
  }
}
