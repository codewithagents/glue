import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/** Minimal config fields required by every package. */
export interface BaseConfig {
  /** Path to the OpenAPI 3.1 spec file (JSON or YAML) */
  input_openapi: string
  /** Directory to write generated files */
  output: string
}

export const FORBIDDEN_OUTPUT_PREFIXES = [
  '/etc',
  '/usr',
  '/bin',
  '/sbin',
  '/lib',
  '/lib64',
  '/sys',
  '/proc',
  '/dev',
  '/boot',
  '/run',
  'C:\\Windows',
  'C:\\Program Files',
]

export const FORBIDDEN_INPUT_PREFIXES = [
  '/etc',
  '/usr',
  '/bin',
  '/sbin',
  '/lib',
  '/lib64',
  '/sys',
  '/proc',
  '/dev',
  'C:\\Windows',
  'C:\\Program Files',
]

const JS_CONFIG_EXTENSIONS = ['.js', '.mjs', '.cjs']

/** Returns true when the path ends in a JS/ESM config extension. */
export function isJsConfigPath(configPath: string): boolean {
  return JS_CONFIG_EXTENSIONS.some((ext) => configPath.endsWith(ext))
}

export function validateConfigPath(configPath: string): void {
  const isJson = configPath.endsWith('.json')
  const isJs = isJsConfigPath(configPath)
  if (!isJson && !isJs) {
    throw new Error(`Config file must be a .json, .js, .mjs, or .cjs file, got: ${configPath}`)
  }
}

export function validateOutputPath(resolvedOutput: string): void {
  const normalized = resolvedOutput.replace(/\\/g, '/')
  for (const forbidden of FORBIDDEN_OUTPUT_PREFIXES) {
    const normalizedForbidden = forbidden.replace(/\\/g, '/')
    if (normalized === normalizedForbidden || normalized.startsWith(normalizedForbidden + '/')) {
      throw new Error(
        `Output path resolves to a system directory: "${resolvedOutput}". ` +
          `This looks like a misconfiguration. Please check your config file.`
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
          `This looks like a misconfiguration. Please check your config file.`
      )
    }
  }
}

/** Options for loadConfigFile. */
export interface LoadConfigOptions<T> {
  /** Working directory used to resolve relative paths. */
  cwd: string
  /** Explicit config file path (optional). If omitted, defaultFileName is used. */
  configPath?: string
  /** Default config file name, resolved against cwd when configPath is not provided. */
  defaultFileName: string
  /**
   * Package-specific parse function. Receives the raw config record, the validated
   * base fields, and cwd. Must return the final typed config object.
   */
  parse: (raw: Record<string, unknown>, base: BaseConfig, cwd: string) => T
}

// fallow-ignore-next-line complexity
export async function loadConfigFile<T>(opts: LoadConfigOptions<T>): Promise<T> {
  const resolvedConfigPath = opts.configPath ?? join(opts.cwd, opts.defaultFileName)

  if (opts.configPath !== undefined) {
    validateConfigPath(opts.configPath)
  }

  let raw: Record<string, unknown>

  if (isJsConfigPath(resolvedConfigPath)) {
    let mod: unknown
    try {
      mod = await import(pathToFileURL(resolvedConfigPath).href)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      throw new Error(`Failed to load JS config file: ${resolvedConfigPath}\n${message}`)
    }
    const exported = (mod as Record<string, unknown>)['default'] ?? mod
    if (typeof exported !== 'object' || exported === null) {
      throw new Error('Config must be a JSON object')
    }
    raw = exported as Record<string, unknown>
  } else {
    let fileContents: string
    try {
      fileContents = await readFile(resolvedConfigPath, 'utf-8')
    } catch {
      throw new Error(`Config file not found: ${resolvedConfigPath}`)
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(fileContents)
    } catch {
      throw new Error(`Config file is not valid JSON: ${resolvedConfigPath}`)
    }
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Config must be a JSON object')
    }
    raw = parsed as Record<string, unknown>
  }

  if (typeof raw['input_openapi'] !== 'string' || !raw['input_openapi']) {
    throw new Error('Config missing required field: "input_openapi" (path to OpenAPI 3.1 spec)')
  }
  if (typeof raw['output'] !== 'string' || !raw['output']) {
    throw new Error('Config missing required field: "output" (output directory)')
  }

  const input_openapi = raw['input_openapi'] as string
  const output = raw['output'] as string

  validateInputPath(resolve(opts.cwd, input_openapi))
  validateOutputPath(resolve(opts.cwd, output))

  const base: BaseConfig = { input_openapi, output }
  return opts.parse(raw, base, opts.cwd)
}
