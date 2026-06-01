import { describe, it, expect } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { isDeepRef, resolveJsonPointer } from '../utils/ref-resolver.js'

describe('isDeepRef', () => {
  it('treats exact component schema refs as not deep', () => {
    expect(isDeepRef('#/components/schemas/Foo')).toBe(false)
    expect(isDeepRef('#/components/schemas/Foo_2')).toBe(false)
  })

  it('treats nested component refs as deep', () => {
    expect(isDeepRef('#/components/schemas/Foo/properties/bar')).toBe(true)
    expect(isDeepRef('#/components/schemas/Foo/items')).toBe(true)
  })

  it('treats path-based and other non-schema refs as deep', () => {
    expect(isDeepRef('#/paths/~1v2~1keys/get/responses/200/content/application~1json/schema')).toBe(
      true
    )
    expect(isDeepRef('#/components/parameters/Limit')).toBe(true)
  })

  it('treats external refs as not deep (left to last-segment handling)', () => {
    expect(isDeepRef('other.json#/components/schemas/Foo')).toBe(false)
    expect(isDeepRef('https://example.com/spec.json')).toBe(false)
  })
})

describe('resolveJsonPointer', () => {
  const spec = {
    openapi: '3.1.0',
    info: { title: 't', version: '1' },
    paths: {
      '/v2/account/keys/{ssh_key_identifier}': {
        get: {
          parameters: [{ name: 'ssh_key_identifier', in: 'path', required: true }],
        },
      },
    },
    components: {
      schemas: {
        Database: {
          type: 'object',
          properties: { allow_list: { type: 'array', items: { type: 'string' } } },
        },
      },
    },
  } as unknown as OpenAPIV3_1.Document

  it('resolves a nested component property pointer', () => {
    const resolved = resolveJsonPointer(spec, '#/components/schemas/Database/properties/allow_list')
    expect(resolved).toEqual({ type: 'array', items: { type: 'string' } })
  })

  it('resolves a path-based parameter pointer with escaped + percent-encoded segments', () => {
    const resolved = resolveJsonPointer(
      spec,
      '#/paths/~1v2~1account~1keys~1%7Bssh_key_identifier%7D/get/parameters/0'
    )
    expect(resolved).toMatchObject({ name: 'ssh_key_identifier', in: 'path' })
  })

  it('returns undefined for an unresolvable pointer', () => {
    expect(resolveJsonPointer(spec, '#/components/schemas/Missing/properties/x')).toBeUndefined()
  })

  it('returns undefined for external (non-#/) refs', () => {
    expect(resolveJsonPointer(spec, 'other.json#/foo')).toBeUndefined()
  })
})
