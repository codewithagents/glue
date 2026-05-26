import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadConfig, validateConfigPath, validateOutputPath, validateInputPath } from '../config.js'

describe('loadConfig', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'openapi-server-config-'))
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  function writeConfig(content: unknown) {
    writeFileSync(join(tmpDir, 'openapi-server.config.json'), JSON.stringify(content))
  }

  it('loads a valid minimal config', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/generated' })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('openapi.json')
    expect(config.output).toBe('src/generated')
    expect(config.framework).toBeUndefined()
  })

  it('loads a full config with framework: hono', async () => {
    writeConfig({ input_openapi: 'api/openapi.json', output: 'src/generated', framework: 'hono' })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('api/openapi.json')
    expect(config.output).toBe('src/generated')
    expect(config.framework).toBe('hono')
  })

  it('loads input_schema when provided', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/generated', input_schema: 'generated/schemas.ts' })
    const config = await loadConfig(tmpDir)
    expect(config.input_schema).toBe('generated/schemas.ts')
  })

  it('input_schema is undefined when not provided', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/generated' })
    const config = await loadConfig(tmpDir)
    expect(config.input_schema).toBeUndefined()
  })

  it('throws when input_schema is an empty string', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/generated', input_schema: '' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('"input_schema" must be a non-empty string')
  })

  it('throws when input_schema is a non-string value', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/generated', input_schema: 42 })
    await expect(loadConfig(tmpDir)).rejects.toThrow('"input_schema" must be a non-empty string')
  })

  it('loads a full config with framework: none', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/server', framework: 'none' })
    const config = await loadConfig(tmpDir)
    expect(config.framework).toBe('none')
  })

  it('throws when config file is missing', async () => {
    await expect(loadConfig(tmpDir)).rejects.toThrow('Config file not found')
  })

  it('throws when config is not valid JSON', async () => {
    writeFileSync(join(tmpDir, 'openapi-server.config.json'), 'not json {{{')
    await expect(loadConfig(tmpDir)).rejects.toThrow('not valid JSON')
  })

  it('throws when config is not an object', async () => {
    writeFileSync(join(tmpDir, 'openapi-server.config.json'), '"just a string"')
    await expect(loadConfig(tmpDir)).rejects.toThrow('JSON object')
  })

  it('throws when input_openapi is missing', async () => {
    writeConfig({ output: 'src/generated' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('input_openapi')
  })

  it('throws when output is missing', async () => {
    writeConfig({ input_openapi: 'openapi.json' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('output')
  })

  it('throws when framework is an invalid value', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/generated', framework: 'express' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('"framework" must be either "hono" or "none"')
  })

  it('ignores unknown config fields', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/generated', unknown_field: 'ignored' })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('openapi.json')
  })

  it('accepts a config loaded via explicit configPath', async () => {
    const configFile = join(tmpDir, 'custom.config.json')
    writeFileSync(configFile, JSON.stringify({ input_openapi: 'openapi.json', output: 'src/generated' }))
    const config = await loadConfig(tmpDir, configFile)
    expect(config.input_openapi).toBe('openapi.json')
    expect(config.output).toBe('src/generated')
  })

  it('rejects explicit configPath that is not .json', async () => {
    const configFile = join(tmpDir, 'config.ts')
    writeFileSync(configFile, JSON.stringify({ input_openapi: 'openapi.json', output: 'src/generated' }))
    await expect(loadConfig(tmpDir, configFile)).rejects.toThrow('Config file must be a .json file')
  })

  it('throws when input_openapi resolves to a forbidden system path', async () => {
    writeConfig({ input_openapi: '/etc/passwd', output: 'src/generated' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('system directory')
  })

  it('throws when output resolves to a forbidden system path', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: '/etc/generated' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('system directory')
  })
})

describe('config security validation', () => {
  describe('validateConfigPath', () => {
    it('rejects non-.json config file extension', () => {
      expect(() => validateConfigPath('/project/config.ts')).toThrow('Config file must be a .json file')
    })

    it('rejects .yaml extension', () => {
      expect(() => validateConfigPath('/project/config.yaml')).toThrow('Config file must be a .json file')
    })

    it('accepts .json extension', () => {
      expect(() => validateConfigPath('/project/config.json')).not.toThrow()
    })

    it('accepts nested .json path', () => {
      expect(() => validateConfigPath('/Users/someone/project/my-tool.config.json')).not.toThrow()
    })
  })

  describe('validateOutputPath', () => {
    it('rejects output path in /etc', () => {
      expect(() => validateOutputPath('/etc/generated')).toThrow('system directory')
    })

    it('rejects output path in /usr', () => {
      expect(() => validateOutputPath('/usr/local/generated')).toThrow('system directory')
    })

    it('rejects output path in /bin', () => {
      expect(() => validateOutputPath('/bin/generated')).toThrow('system directory')
    })

    it('rejects output path in /sys', () => {
      expect(() => validateOutputPath('/sys/something')).toThrow('system directory')
    })

    it('rejects output path in /proc', () => {
      expect(() => validateOutputPath('/proc/1/generated')).toThrow('system directory')
    })

    it('rejects output path in /dev', () => {
      expect(() => validateOutputPath('/dev/null')).toThrow('system directory')
    })

    it('rejects output path in /boot', () => {
      expect(() => validateOutputPath('/boot/generated')).toThrow('system directory')
    })

    it('rejects output path that is exactly /run', () => {
      expect(() => validateOutputPath('/run')).toThrow('system directory')
    })

    it('rejects output path under /run/', () => {
      expect(() => validateOutputPath('/run/lock/something')).toThrow('system directory')
    })

    it('does NOT reject /runner/_work/... (CI runner path)', () => {
      expect(() => validateOutputPath('/runner/_work/project/src/generated')).not.toThrow()
    })

    it('accepts normal project-relative resolved path', () => {
      expect(() => validateOutputPath('/Users/someone/project/generated')).not.toThrow()
    })

    it('accepts absolute path within home directory', () => {
      expect(() => validateOutputPath('/Users/someone/myproject/src/server')).not.toThrow()
    })

    it('accepts dist/api style path', () => {
      expect(() => validateOutputPath('/home/user/project/dist/server')).not.toThrow()
    })

    it('accepts GitHub Actions home runner output path', () => {
      expect(() => validateOutputPath('/home/runner/work/my-repo/my-repo/src/generated')).not.toThrow()
    })

    it('accepts common CI workspace output path', () => {
      expect(() => validateOutputPath('/workspace/project/src/generated')).not.toThrow()
    })
  })

  describe('validateInputPath', () => {
    it('rejects input spec from /proc', () => {
      expect(() => validateInputPath('/proc/1/fd/0')).toThrow('system directory')
    })

    it('rejects input spec from /etc', () => {
      expect(() => validateInputPath('/etc/passwd')).toThrow('system directory')
    })

    it('rejects input spec from /dev', () => {
      expect(() => validateInputPath('/dev/random')).toThrow('system directory')
    })

    it('rejects input spec from /usr', () => {
      expect(() => validateInputPath('/usr/share/openapi.json')).toThrow('system directory')
    })

    it('accepts input spec in home directory', () => {
      expect(() => validateInputPath('/Users/someone/project/openapi.json')).not.toThrow()
    })

    it('accepts input spec in /tmp', () => {
      expect(() => validateInputPath('/tmp/openapi.json')).not.toThrow()
    })

    it('accepts GitHub Actions home runner input path', () => {
      expect(() => validateInputPath('/home/runner/work/my-repo/my-repo/spec/api.json')).not.toThrow()
    })

    it('accepts common CI workspace input path', () => {
      expect(() => validateInputPath('/workspace/project/spec/openapi.json')).not.toThrow()
    })
  })
})
