import { describe, it, expect } from 'vitest'
import { parseCliArgs } from '../cli-args.js'
import { resolve, dirname } from 'node:path'

const fakeCwd = '/project'
// Simulate the first two argv entries (node binary + script path)
const baseArgv = ['/usr/bin/node', '/project/dist/cli.cjs']

describe('parseCliArgs', () => {
  describe('--help / -h', () => {
    it('returns help action for --help', () => {
      const result = parseCliArgs([...baseArgv, '--help'], fakeCwd)
      expect(result).toEqual({ action: 'help' })
    })

    it('returns help action for -h', () => {
      const result = parseCliArgs([...baseArgv, '-h'], fakeCwd)
      expect(result).toEqual({ action: 'help' })
    })

    it('short-circuits --help before --config', () => {
      const result = parseCliArgs([...baseArgv, '--help', '--config', 'foo.json'], fakeCwd)
      expect(result).toEqual({ action: 'help' })
    })
  })

  describe('--version / -v', () => {
    it('returns version action for --version', () => {
      const result = parseCliArgs([...baseArgv, '--version'], fakeCwd)
      expect(result).toEqual({ action: 'version' })
    })

    it('returns version action for -v', () => {
      const result = parseCliArgs([...baseArgv, '-v'], fakeCwd)
      expect(result).toEqual({ action: 'version' })
    })

    it('short-circuits --version before --config', () => {
      const result = parseCliArgs([...baseArgv, '--version', '--config', 'foo.json'], fakeCwd)
      expect(result).toEqual({ action: 'version' })
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
