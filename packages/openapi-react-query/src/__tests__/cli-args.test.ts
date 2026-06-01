import { describe, it, expect } from 'vitest'
import { parseCliArgs } from '../cli-args.js'
import { resolve, dirname } from 'node:path'

const fakeCwd = '/project'
// Simulate the first two argv entries (node binary + script path)
const baseArgv = ['/usr/bin/node', '/project/dist/cli.js']

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
      })
    })

    it('resolves absolute config path correctly', () => {
      const result = parseCliArgs([...baseArgv, '--config', '/abs/path/config.json'], fakeCwd)
      expect(result).toEqual({
        action: 'run',
        configFile: '/abs/path/config.json',
        cwd: '/abs/path',
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
      expect(result).toEqual({ action: 'run', cwd: fakeCwd })
    })

    it('configFile is undefined when no --config flag', () => {
      const result = parseCliArgs([...baseArgv], fakeCwd)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.configFile).toBeUndefined()
      }
    })
  })
})
