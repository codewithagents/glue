import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadConfig, validateConfigPath, validateOutputPath, validateInputPath } from '../config.js'

describe('loadConfig', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'openapi-react-query-config-'))
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  function writeConfig(content: unknown) {
    writeFileSync(join(tmpDir, 'openapi-react-query.config.json'), JSON.stringify(content))
  }

  it('loads a valid minimal config', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/hooks' })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('openapi.json')
    expect(config.output).toBe('src/hooks')
    expect(config.stale_time).toBeUndefined()
    expect(config.gc_time).toBeUndefined()
  })

  it('loads a full config with all fields', async () => {
    writeConfig({
      input_openapi: 'api/openapi.json',
      output: 'src/generated',
      stale_time: 5000,
      gc_time: 600000,
    })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('api/openapi.json')
    expect(config.output).toBe('src/generated')
    expect(config.stale_time).toBe(5000)
    expect(config.gc_time).toBe(600000)
  })

  it('throws when config file is missing', async () => {
    await expect(loadConfig(tmpDir)).rejects.toThrow('Config file not found')
  })

  it('throws when config is not valid JSON', async () => {
    writeFileSync(join(tmpDir, 'openapi-react-query.config.json'), 'not json {{{')
    await expect(loadConfig(tmpDir)).rejects.toThrow('not valid JSON')
  })

  it('throws when config is not an object', async () => {
    writeFileSync(join(tmpDir, 'openapi-react-query.config.json'), '"just a string"')
    await expect(loadConfig(tmpDir)).rejects.toThrow('JSON object')
  })

  it('throws when input_openapi is missing', async () => {
    writeConfig({ output: 'src/hooks' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('input_openapi')
  })

  it('throws when output is missing', async () => {
    writeConfig({ input_openapi: 'openapi.json' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('output')
  })

  it('throws when stale_time is not a number', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/hooks', stale_time: 'fast' })
    await expect(loadConfig(tmpDir)).rejects.toThrow('stale_time')
  })

  it('throws when gc_time is not a number', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/hooks', gc_time: true })
    await expect(loadConfig(tmpDir)).rejects.toThrow('gc_time')
  })

  it('ignores unknown config fields', async () => {
    writeConfig({ input_openapi: 'openapi.json', output: 'src/hooks', unknown_field: 'ignored' })
    const config = await loadConfig(tmpDir)
    expect(config.input_openapi).toBe('openapi.json')
  })

  it('accepts a config loaded via explicit configPath', async () => {
    const configFile = join(tmpDir, 'custom.config.json')
    writeFileSync(configFile, JSON.stringify({ input_openapi: 'openapi.json', output: 'src/hooks' }))
    const config = await loadConfig(tmpDir, configFile)
    expect(config.input_openapi).toBe('openapi.json')
    expect(config.output).toBe('src/hooks')
  })

  it('rejects explicit configPath that is not .json', async () => {
    const configFile = join(tmpDir, 'config.ts')
    writeFileSync(configFile, JSON.stringify({ input_openapi: 'openapi.json', output: 'src/hooks' }))
    await expect(loadConfig(tmpDir, configFile)).rejects.toThrow('Config file must be a .json file')
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

    it('accepts normal project-relative resolved path', () => {
      expect(() => validateOutputPath('/Users/someone/project/generated')).not.toThrow()
    })

    it('accepts absolute path within home directory', () => {
      expect(() => validateOutputPath('/Users/someone/myproject/src/hooks')).not.toThrow()
    })

    it('accepts dist/api style path', () => {
      expect(() => validateOutputPath('/home/user/project/dist/hooks')).not.toThrow()
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
  })
})
