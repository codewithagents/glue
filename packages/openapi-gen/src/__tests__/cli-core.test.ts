import { describe, it, expect } from 'vitest'
import { parseBaseCliArgs } from '../cli-core.js'
import { resolve, dirname } from 'node:path'

const fakeCwd = '/project'
const fakeUsage = 'Usage: my-tool [--config <path>]'
// Simulate the first two argv entries (node binary + script path)
const baseArgv = ['/usr/bin/node', '/project/dist/cli.js']

describe('parseBaseCliArgs', () => {
  describe.each([
    { flag: '--help', short: '-h', action: 'help' as const },
    { flag: '--version', short: '-v', action: 'version' as const },
  ])('$flag / $short', ({ flag, short, action }) => {
    it(`returns ${action} action for ${flag}`, () => {
      const result = parseBaseCliArgs([...baseArgv, flag], fakeCwd, fakeUsage)
      expect(result).toEqual({ action })
    })

    it(`returns ${action} action for ${short}`, () => {
      const result = parseBaseCliArgs([...baseArgv, short], fakeCwd, fakeUsage)
      expect(result).toEqual({ action })
    })

    it(`short-circuits ${flag} before --config`, () => {
      const result = parseBaseCliArgs(
        [...baseArgv, flag, '--config', 'foo.json'],
        fakeCwd,
        fakeUsage
      )
      expect(result).toEqual({ action })
    })
  })

  describe('--config', () => {
    it('returns run action with resolved configFile and cwd from config dir', () => {
      const result = parseBaseCliArgs([...baseArgv, '--config', 'config.json'], fakeCwd, fakeUsage)
      expect(result).toEqual({
        action: 'run',
        configFile: resolve(fakeCwd, 'config.json'),
        cwd: dirname(resolve(fakeCwd, 'config.json')),
      })
    })

    it('resolves absolute config path correctly', () => {
      const result = parseBaseCliArgs(
        [...baseArgv, '--config', '/abs/path/config.json'],
        fakeCwd,
        fakeUsage
      )
      expect(result).toEqual({
        action: 'run',
        configFile: '/abs/path/config.json',
        cwd: '/abs/path',
      })
    })

    it('returns error when --config has no value', () => {
      const result = parseBaseCliArgs([...baseArgv, '--config'], fakeCwd, fakeUsage)
      expect(result.action).toBe('error')
    })

    it('returns error when --config is followed by another flag', () => {
      const result = parseBaseCliArgs([...baseArgv, '--config', '--other'], fakeCwd, fakeUsage)
      expect(result.action).toBe('error')
    })

    it('error message contains --config requirement text', () => {
      const result = parseBaseCliArgs([...baseArgv, '--config'], fakeCwd, fakeUsage)
      expect(result.action).toBe('error')
      if (result.action === 'error') {
        expect(result.message).toContain('--config requires a file path argument')
      }
    })

    it('error message includes the provided usage string', () => {
      const result = parseBaseCliArgs([...baseArgv, '--config'], fakeCwd, fakeUsage)
      expect(result.action).toBe('error')
      if (result.action === 'error') {
        expect(result.message).toContain(fakeUsage)
      }
    })
  })

  describe('bare invocation (no flags)', () => {
    it('returns run action with cwd and no configFile when no args given', () => {
      const result = parseBaseCliArgs([...baseArgv], fakeCwd, fakeUsage)
      expect(result).toEqual({ action: 'run', cwd: fakeCwd })
    })

    it('configFile is undefined when no --config flag', () => {
      const result = parseBaseCliArgs([...baseArgv], fakeCwd, fakeUsage)
      expect(result.action).toBe('run')
      if (result.action === 'run') {
        expect(result.configFile).toBeUndefined()
      }
    })
  })
})
