import { describe, it, expect } from 'vitest'
import { parseCliArgs } from '../cli-args.js'
import { resolve, dirname } from 'node:path'

const fakeCwd = '/project'
// Simulate the first two argv entries (node binary + script path)
const baseArgv = ['/usr/bin/node', '/project/dist/cli.cjs']

describe('parseCliArgs', () => {
  describe.each([
    { flag: '--help', short: '-h', action: 'help' as const },
    { flag: '--version', short: '-v', action: 'version' as const },
  ])('$flag / $short', ({ flag, short, action }) => {
    it(`returns ${action} action for ${flag}`, () => {
      const result = parseCliArgs([...baseArgv, flag], fakeCwd)
      expect(result).toEqual({ action })
    })

    it(`returns ${action} action for ${short}`, () => {
      const result = parseCliArgs([...baseArgv, short], fakeCwd)
      expect(result).toEqual({ action })
    })

    it(`short-circuits ${flag} before --config`, () => {
      const result = parseCliArgs([...baseArgv, flag, '--config', 'foo.json'], fakeCwd)
      expect(result).toEqual({ action })
    })
  })

  describe('--config', () => {
    it('returns run action with resolved configFile and cwd from config dir', () => {
      const result = parseCliArgs([...baseArgv, '--config', 'config.json'], fakeCwd)
      expect(result).toEqual({
        action: 'run',
        configFile: resolve(fakeCwd, 'config.json'),
        cwd: dirname(resolve(fakeCwd, 'config.json')),
        watch: false,
      })
    })

    it('resolves absolute config path correctly', () => {
      const result = parseCliArgs([...baseArgv, '--config', '/abs/path/config.json'], fakeCwd)
      expect(result).toEqual({
        action: 'run',
        configFile: '/abs/path/config.json',
        cwd: '/abs/path',
        watch: false,
      })
    })

    it('returns error when --config has no value', () => {
      const result = parseCliArgs([...baseArgv, '--config'], fakeCwd)
      expect(result.action).toBe('error')
    })

    it('returns error when --config is followed by another flag', () => {
      const result = parseCliArgs([...baseArgv, '--config', '--other'], fakeCwd)
      expect(result.action).toBe('error')
    })

    it('error message mentions --config requirement', () => {
      const result = parseCliArgs([...baseArgv, '--config'], fakeCwd)
      expect(result.action).toBe('error')
      if (result.action === 'error') {
        expect(result.message).toContain('--config requires a file path argument')
      }
    })
  })

  describe('bare invocation (no flags)', () => {
    it('returns run action with cwd and no configFile when no args given', () => {
      const result = parseCliArgs([...baseArgv], fakeCwd)
      expect(result).toEqual({ action: 'run', cwd: fakeCwd, watch: false })
    })

    it('configFile is undefined when no --config flag', () => {
      const result = parseCliArgs([...baseArgv], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.configFile).toBeUndefined()
      }
    })
  })

  describe('--input', () => {
    it('resolves --input path relative to cwd', () => {
      const result = parseCliArgs([...baseArgv, '--input', 'openapi.json'], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.inputOverride).toBe(resolve(fakeCwd, 'openapi.json'))
      }
    })

    it('resolves absolute --input path unchanged', () => {
      const result = parseCliArgs([...baseArgv, '--input', '/abs/openapi.json'], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.inputOverride).toBe('/abs/openapi.json')
      }
    })

    it('returns error when --input has no value', () => {
      const result = parseCliArgs([...baseArgv, '--input'], fakeCwd)
      expect(result.action).toBe('error')
    })

    it('returns error when --input is followed by another flag', () => {
      const result = parseCliArgs([...baseArgv, '--input', '--output'], fakeCwd)
      expect(result.action).toBe('error')
    })

    it('error message mentions --input requirement', () => {
      const result = parseCliArgs([...baseArgv, '--input'], fakeCwd)
      if (result.action === 'error') {
        expect(result.message).toContain('--input requires a file path argument')
      }
    })

    it('inputOverride is undefined when --input not given', () => {
      const result = parseCliArgs([...baseArgv], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.inputOverride).toBeUndefined()
      }
    })
  })

  describe('--output', () => {
    it('resolves --output path relative to cwd', () => {
      const result = parseCliArgs([...baseArgv, '--output', 'src/api'], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.outputOverride).toBe(resolve(fakeCwd, 'src/api'))
      }
    })

    it('resolves absolute --output path unchanged', () => {
      const result = parseCliArgs([...baseArgv, '--output', '/abs/output'], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.outputOverride).toBe('/abs/output')
      }
    })

    it('returns error when --output has no value', () => {
      const result = parseCliArgs([...baseArgv, '--output'], fakeCwd)
      expect(result.action).toBe('error')
    })

    it('returns error when --output is followed by another flag', () => {
      const result = parseCliArgs([...baseArgv, '--output', '--watch'], fakeCwd)
      expect(result.action).toBe('error')
    })

    it('error message mentions --output requirement', () => {
      const result = parseCliArgs([...baseArgv, '--output'], fakeCwd)
      if (result.action === 'error') {
        expect(result.message).toContain('--output requires a directory path argument')
      }
    })

    it('outputOverride is undefined when --output not given', () => {
      const result = parseCliArgs([...baseArgv], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.outputOverride).toBeUndefined()
      }
    })
  })

  describe('--input and --output combined', () => {
    it('resolves both overrides when given together', () => {
      const result = parseCliArgs(
        [...baseArgv, '--input', 'spec.json', '--output', 'out/'],
        fakeCwd
      )
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.inputOverride).toBe(resolve(fakeCwd, 'spec.json'))
        expect(result.outputOverride).toBe(resolve(fakeCwd, 'out/'))
        expect(result.configFile).toBeUndefined()
      }
    })

    it('can combine --input/--output with --config', () => {
      const result = parseCliArgs(
        [...baseArgv, '--config', 'openapi-gen.config.json', '--input', 'alt.yaml'],
        fakeCwd
      )
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.configFile).toBeDefined()
        expect(result.inputOverride).toBe(resolve(fakeCwd, 'alt.yaml'))
      }
    })
  })

  describe('--watch', () => {
    it('sets watch to true when --watch is given', () => {
      const result = parseCliArgs([...baseArgv, '--watch'], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.watch).toBe(true)
      }
    })

    it('sets watch to false when --watch is not given', () => {
      const result = parseCliArgs([...baseArgv], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.watch).toBe(false)
      }
    })

    it('combines --watch with --input and --output', () => {
      const result = parseCliArgs(
        [...baseArgv, '--watch', '--input', 'spec.json', '--output', 'out/'],
        fakeCwd
      )
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.watch).toBe(true)
        expect(result.inputOverride).toBe(resolve(fakeCwd, 'spec.json'))
        expect(result.outputOverride).toBe(resolve(fakeCwd, 'out/'))
      }
    })

    it('short-circuits --help before --watch', () => {
      const result = parseCliArgs([...baseArgv, '--help', '--watch'], fakeCwd)
      expect(result).toEqual({ action: 'help' })
    })
  })
})
