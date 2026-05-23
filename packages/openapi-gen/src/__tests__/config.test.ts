import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadConfig } from '../config.js'

describe('loadConfig', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'openapi-gen-config-'))
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  function writeConfig(content: unknown) {
    writeFileSync(join(tmpDir, 'openapi-gen.config.json'), JSON.stringify(content))
  }

  it('loads a valid minimal config', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/api' })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('openapi.json')
    expect(config.output).toBe('src/api')
    expect(config.input_schema).toBeUndefined()
    expect(config.baseUrl).toBeUndefined()
  })

  it('loads a full config with all fields', async () => {
    writeConfig({
      input_openapi: 'api/openapi.json',
      input_schema: 'schemas.ts',
      output: 'src/generated',
      baseUrl: 'https://api.example.com',
    })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('api/openapi.json')
    expect(config.input_schema).toBe('schemas.ts')
    expect(config.output).toBe('src/generated')
    expect(config.baseUrl).toBe('https://api.example.com')
  })

  it('throws when config file is missing', async () => {
    await expect(loadConfig(tmpDir)).rejects.toThrow('Config file not found')
  })

  it('throws when config is not valid JSON', async () => {
    writeFileSync(join(tmpDir, 'openapi-gen.config.json'), 'not json {{{')
    await expect(loadConfig(tmpDir)).rejects.toThrow('not valid JSON')
  })

  it('throws when config is not an object', async () => {
    writeFileSync(join(tmpDir, 'openapi-gen.config.json'), '"just a string"')
    await expect(loadConfig(tmpDir)).rejects.toThrow('JSON object')
  })

  it('throws when input_openapi is missing', async () => {
    writeConfig({ output: 'src/api' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('input_openapi')
  })

  it('throws when input_openapi is empty string', async () => {
    writeConfig({ input_openapi: '', output: 'src/api' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('input_openapi')
  })

  it('throws when output is missing', async () => {
    writeConfig({ input_openapi: 'openapi.json' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('output')
  })

  it('throws when input_schema is an empty string', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/api', input_schema: '' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('input_schema')
  })

  it('ignores unknown config fields', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/api', unknown_field: 'ignored' })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('openapi.json')
  })
})
