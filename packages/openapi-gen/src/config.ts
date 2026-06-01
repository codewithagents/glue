import {
  loadConfigFile,
  validateConfigPath,
  validateInputPath,
  validateOutputPath,
} from './config-core.js'

export { validateConfigPath, validateInputPath, validateOutputPath }

export interface Config {
  /** Path to the OpenAPI 3.1 spec file (JSON or YAML) */
  input_openapi: string
  /** Path to user-owned Zod schema file (.ts). Optional. Bootstrapped on first run if absent. */
  input_schema?: string
  /** Directory to write generated files */
  output: string
  /** Base URL prefix for generated fetch client (default: '') */
  baseUrl?: string
  /** When true, generates server.ts with a createServerClient() factory for Next.js RSC (default: false) */
  server_client?: boolean
}

/**
 * Typed identity helper for config files. Provides autocomplete in JS/TS config files.
 *
 * Example (openapi-gen.config.mjs):
 *   import { defineConfig } from '@codewithagents/openapi-gen'
 *   export default defineConfig({ input_openapi: './openapi.json', output: './src/api' })
 */
export function defineConfig(config: Config): Config {
  return config
}

export async function loadConfig(cwd: string, configPath?: string): Promise<Config> {
  return loadConfigFile<Config>({
    cwd,
    configPath,
    defaultFileName: 'openapi-gen.config.json',
    parse: (raw, base) => {
      if (
        raw['input_schema'] !== undefined &&
        (typeof raw['input_schema'] !== 'string' || !raw['input_schema'])
      ) {
        throw new Error('"input_schema" must be a non-empty string path to your Zod schema file')
      }
      if (raw['server_client'] !== undefined && typeof raw['server_client'] !== 'boolean') {
        throw new Error('"server_client" must be a boolean')
      }
      return {
        ...base,
        input_schema: raw['input_schema'] as string | undefined,
        baseUrl: typeof raw['baseUrl'] === 'string' ? raw['baseUrl'] : undefined,
        server_client: raw['server_client'] as boolean | undefined,
      }
    },
  })
}
