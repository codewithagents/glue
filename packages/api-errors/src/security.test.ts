/**
 * Security regression tests: untrusted API error bodies must not be able to
 * smuggle a prototype-pollution gadget key into a path-aware form setter.
 *
 * THREAT: this library extracts the field name verbatim from attacker-influenced
 * error JSON (object keys in RFC 7807, string values elsewhere) and forwards it to
 * `setError`. React Hook Form's `setError` treats that string as a PATH and walks /
 * creates nested objects, so a body like `{ "errors": { "__proto__.x": ["y"] } }`
 * could pollute `Object.prototype` in the consuming app. We reject `__proto__` /
 * `constructor` / `prototype` path segments at the boundary we own.
 *
 * See SECURITY.md ("Security regression tests"). Run only these with:
 *   pnpm -r test -t SECURITY
 */
import { describe, expect, it, vi } from 'vitest'
import { extractFieldErrors, mapApiErrors } from './index.js'

describe('SECURITY: prototype-pollution field names are rejected', () => {
  const pollutionKeys = [
    '__proto__',
    '__proto__.polluted',
    'constructor',
    'constructor.prototype.polluted',
    'prototype.polluted',
    'a[__proto__].b',
    'items[constructor].x',
  ]

  it('drops __proto__ / constructor / prototype field paths (RFC 7807 keys)', () => {
    for (const key of pollutionKeys) {
      const result = extractFieldErrors({ errors: { [key]: ['x'] } })
      expect(result.some((e) => e.field === key)).toBe(false)
    }
  })

  it('drops gadget keys from the flat-object and flat-array shapes (field values)', () => {
    expect(extractFieldErrors({ field: '__proto__.x', message: 'bad' })).toEqual([])
    expect(extractFieldErrors([{ field: 'constructor.prototype.x', message: 'bad' }])).toEqual([])
  })

  it('keeps legitimate nested/indexed field paths', () => {
    const result = extractFieldErrors({
      errors: { 'items[0].name': ['required'], 'user.address.zip': ['invalid'] },
    })
    expect(result).toContainEqual({ field: 'items[0].name', message: 'required' })
    expect(result).toContainEqual({ field: 'user.address.zip', message: 'invalid' })
  })

  it('mapApiErrors never calls setError with a gadget field, and Object.prototype stays clean', () => {
    const setError = vi.fn()
    mapApiErrors({ errors: { '__proto__.polluted': ['y'], email: ['required'] } }, setError)

    const calledFields = setError.mock.calls.map((c) => c[0] as string)
    expect(calledFields).not.toContain('__proto__.polluted')
    expect(calledFields).toContain('email')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(({} as any).polluted).toBeUndefined()
  })
})

describe('SECURITY: unbounded error bodies are capped', () => {
  it('caps the returned field-error count for a huge errors map', () => {
    const errors: Record<string, string[]> = {}
    for (let i = 0; i < 5000; i++) errors[`field${i}`] = ['x']
    const result = extractFieldErrors({ errors })
    expect(result.length).toBeLessThanOrEqual(1000)
  })
})
