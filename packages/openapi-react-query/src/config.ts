import {
  loadConfigFile,
  validateConfigPath,
  validateInputPath,
  validateOutputPath,
} from '@codewithagents/openapi-gen/config-core'

export { validateConfigPath, validateInputPath, validateOutputPath }

export interface ReactQueryConfig {
  /** Path to OpenAPI 3.1 spec file (JSON or YAML) */
  input_openapi: string
  /** Directory to write generated files */
  output: string
  /** staleTime in ms for all useQuery hooks (default: 0) */
  stale_time?: number
  /** gcTime in ms for all useQuery hooks (default: 300000) */
  gc_time?: number
  /** When true, generates useSuspense* variants alongside each useQuery hook (default: false) */
  suspense?: boolean
  /** Per-resource cache timing overrides. Key is the resource name (e.g. "tasks", "platforms"). */
  overrides?: Record<string, { stale_time?: number; gc_time?: number }>
  /** When true, mutation hooks auto-invalidate related resource queries on success (default: false) */
  auto_invalidate?: boolean
}

function validateTiming(resource: string, timing: unknown): void {
  if (typeof timing !== 'object' || timing === null) {
    throw new Error(`"overrides.${resource}" must be an object`)
  }
  const t = timing as Record<string, unknown>
  if (t['stale_time'] !== undefined && typeof t['stale_time'] !== 'number') {
    throw new Error(`"overrides.${resource}.stale_time" must be a number`)
  }
  if (t['gc_time'] !== undefined && typeof t['gc_time'] !== 'number') {
    throw new Error(`"overrides.${resource}.gc_time" must be a number`)
  }
}

function validateOverrides(value: unknown): void {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('"overrides" must be an object')
  }
  for (const [resource, timing] of Object.entries(value as Record<string, unknown>)) {
    validateTiming(resource, timing)
  }
}

function expectNumber(raw: Record<string, unknown>, key: string, message: string): void {
  if (raw[key] !== undefined && typeof raw[key] !== 'number') throw new Error(message)
}

function expectBoolean(raw: Record<string, unknown>, key: string, message: string): void {
  if (raw[key] !== undefined && typeof raw[key] !== 'boolean') throw new Error(message)
}

function validateReactQueryFields(raw: Record<string, unknown>): void {
  expectNumber(raw, 'stale_time', '"stale_time" must be a number (milliseconds)')
  expectNumber(raw, 'gc_time', '"gc_time" must be a number (milliseconds)')
  expectBoolean(raw, 'suspense', '"suspense" must be a boolean')
  expectBoolean(raw, 'auto_invalidate', '"auto_invalidate" must be a boolean')
  if (raw['overrides'] !== undefined) validateOverrides(raw['overrides'])
}

export async function loadConfig(cwd: string, configPath?: string): Promise<ReactQueryConfig> {
  return loadConfigFile<ReactQueryConfig>({
    cwd,
    configPath,
    defaultFileName: 'openapi-react-query.config.json',
    parse: (raw, base) => {
      validateReactQueryFields(raw)
      return {
        ...base,
        stale_time: raw['stale_time'] as number | undefined,
        gc_time: raw['gc_time'] as number | undefined,
        suspense: raw['suspense'] as boolean | undefined,
        overrides: raw['overrides'] as
          | Record<string, { stale_time?: number; gc_time?: number }>
          | undefined,
        auto_invalidate: raw['auto_invalidate'] as boolean | undefined,
      }
    },
  })
}
