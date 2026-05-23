import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface Config {
  input: string
  output: string
  plugins: ('types')[]
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

  if (typeof config['input'] !== 'string' || !config['input']) {
    throw new Error('Config missing required field: "input" (must be a non-empty string)')
  }
  if (typeof config['output'] !== 'string' || !config['output']) {
    throw new Error('Config missing required field: "output" (must be a non-empty string)')
  }
  if (!Array.isArray(config['plugins'])) {
    throw new Error('Config missing required field: "plugins" (must be an array)')
  }

  const validPlugins = ['types']
  for (const plugin of config['plugins'] as unknown[]) {
    if (!validPlugins.includes(plugin as string)) {
      throw new Error(`Unknown plugin: "${plugin}". Valid plugins: ${validPlugins.join(', ')}`)
    }
  }

  return {
    input: config['input'] as string,
    output: config['output'] as string,
    plugins: config['plugins'] as ('types')[],
    baseUrl: typeof config['baseUrl'] === 'string' ? config['baseUrl'] : undefined,
  }
}
