import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface Config {
  /** Path to the OpenAPI 3.1 spec file (JSON or YAML) */
  input_openapi: string
  /** Path to user-owned Zod schema file (.ts). Optional — bootstrapped on first run if absent. */
  input_schema?: string
  /** Directory to write generated files */
  output: string
  /** Base URL prefix for generated fetch client (default: '') */
  baseUrl?: string
}

export async function loadConfig(cwd: string): Promise<Config> {
  const configPath = join(cwd, 'openapi-gen.config.json')
  let raw: string
  try {
    raw = await readFile(configPath, 'utf-8')
  } catch {
    throw new Error(`Config file not found: ${configPath}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(`Config file is not valid JSON: ${configPath}`)
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

  return {
    input_openapi: config['input_openapi'] as string,
    input_schema: config['input_schema'] as string | undefined,
    output: config['output'] as string,
    baseUrl: typeof config['baseUrl'] === 'string' ? config['baseUrl'] : undefined,
  }
}
