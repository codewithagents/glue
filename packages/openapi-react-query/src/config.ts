import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

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

export async function loadConfig(cwd: string): Promise<ReactQueryConfig> {
  const configPath = join(cwd, 'openapi-react-query.config.json')
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
  if (config['stale_time'] !== undefined && typeof config['stale_time'] !== 'number') {
    throw new Error('"stale_time" must be a number (milliseconds)')
  }
  if (config['gc_time'] !== undefined && typeof config['gc_time'] !== 'number') {
    throw new Error('"gc_time" must be a number (milliseconds)')
  }

  return {
    input_openapi: config['input_openapi'] as string,
    output: config['output'] as string,
    stale_time: config['stale_time'] as number | undefined,
    gc_time: config['gc_time'] as number | undefined,
  }
}
