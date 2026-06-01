import {
  loadConfigFile,
  validateConfigPath,
  validateInputPath,
  validateOutputPath,
} from '@codewithagents/openapi-gen/config-core'

export { validateConfigPath, validateInputPath, validateOutputPath }

export interface ServerConfig {
  /** Path to the OpenAPI 3.1 spec file (JSON or YAML) */
  input_openapi: string
  /** Directory to write generated files */
  output: string
  /** Framework to generate a router for. Default: 'none' */
  framework?: 'hono' | 'express' | 'fastify' | 'none'
  /** Path to user-owned Zod schema file (same file as openapi-gen's input_schema). Optional. */
  input_schema?: string
}

export async function loadConfig(cwd: string, configPath?: string): Promise<ServerConfig> {
  return loadConfigFile<ServerConfig>({
    cwd,
    configPath,
    defaultFileName: 'openapi-server.config.json',
    parse: (raw) => {
      const framework = raw['framework']
      if (
        framework !== undefined &&
        framework !== 'hono' &&
        framework !== 'express' &&
        framework !== 'fastify' &&
        framework !== 'none'
      ) {
        throw new Error('"framework" must be one of: "hono", "express", "fastify", or "none"')
      }
      if (
        raw['input_schema'] !== undefined &&
        (typeof raw['input_schema'] !== 'string' || !raw['input_schema'])
      ) {
        throw new Error('"input_schema" must be a non-empty string path to your Zod schema file')
      }
      return {
        input_openapi: raw['input_openapi'] as string,
        output: raw['output'] as string,
        framework: framework as 'hono' | 'express' | 'fastify' | 'none' | undefined,
        input_schema: raw['input_schema'] as string | undefined,
      }
    },
  })
}
