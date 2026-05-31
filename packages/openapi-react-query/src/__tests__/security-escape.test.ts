/**
 * Security regression tests: spec-derived resource names must not inject executable
 * code into generated React Query key factory arrays.
 *
 * ROOT CAUSE: raw `['${resource}']` interpolation lets a single quote in an OpenAPI
 * path segment break out of the generated string literal and inject arbitrary statements.
 */
import { describe, it, expect } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateHooks } from '../plugins/hooks.js'

// ── Adversarial payloads ───────────────────────────────────────────────────────

const SINGLE_QUOTE_PAYLOAD_RESOURCE = `items']; console.log(['x`
const BACKTICK_PAYLOAD_RESOURCE = 'items`]; console.log([`x'
const DOLLAR_BRACE_RESOURCE = 'items${process.exit(1)}'
const NEWLINE_RESOURCE = 'items\nmalicious'

const defaultOptions = { staleTime: 30_000, gcTime: 300_000 }

function makeSpec(paths: OpenAPIV3_1.PathsObject): OpenAPIV3_1.Document {
  return {
    openapi: '3.1.0',
    info: { title: 'Security Test', version: '1.0.0' },
    paths,
  }
}

// ── Key factory resource injection ────────────────────────────────────────────

describe('SECURITY: generateHooks — query key factory resource injection prevention', () => {
  it('escapes single-quote in resource name in all() factory', () => {
    const resource = SINGLE_QUOTE_PAYLOAD_RESOURCE
    const spec = makeSpec({
      [`/${resource}`]: {
        get: {
          operationId: 'listItems',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateHooks(spec, defaultOptions)
    // The raw unescaped resource must not appear in a single-quoted string context
    expect(content).not.toContain(`'${resource}'`)
    // Must be JSON-encoded with double quotes — no single-quote breakout possible
    expect(content).toContain(JSON.stringify(resource))
    // No single line in the output may contain the injection pattern ['...'];console.log
    const injectionPerLine = content
      .split('\n')
      .some((line) => /\['[^']*'\];\s*console\.log/.test(line))
    expect(injectionPerLine).toBe(false)
  })

  it('escapes single-quote in resource name in list() factory', () => {
    const resource = SINGLE_QUOTE_PAYLOAD_RESOURCE
    const spec = makeSpec({
      [`/${resource}`]: {
        get: {
          operationId: 'listItems',
          parameters: [{ name: 'page', in: 'query', schema: { type: 'number' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateHooks(spec, defaultOptions)
    expect(content).not.toContain(`'${resource}'`)
    expect(content).toContain(JSON.stringify(resource))
    // No single line may contain the injection breakout pattern
    const injectionPerLine = content
      .split('\n')
      .some((line) => /\['[^']*'\];\s*console\.log/.test(line))
    expect(injectionPerLine).toBe(false)
  })

  it('escapes single-quote in resource name in detail() factory', () => {
    const resource = SINGLE_QUOTE_PAYLOAD_RESOURCE
    const spec = makeSpec({
      [`/${resource}/{id}`]: {
        get: {
          operationId: 'getItem',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateHooks(spec, defaultOptions)
    expect(content).not.toContain(`'${resource}'`)
    expect(content).toContain(JSON.stringify(resource))
    // No single line may contain the injection breakout pattern
    const injectionPerLine = content
      .split('\n')
      .some((line) => /\['[^']*'\];\s*console\.log/.test(line))
    expect(injectionPerLine).toBe(false)
  })

  it('escapes backtick in resource name', () => {
    const resource = BACKTICK_PAYLOAD_RESOURCE
    const spec = makeSpec({
      [`/${resource}`]: {
        get: {
          operationId: 'listItems2',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateHooks(spec, defaultOptions)
    // Must be JSON-encoded (double-quoted) — backtick safely inside a JSON string
    expect(content).toContain(JSON.stringify(resource))
    // No single line may contain a backtick injection breakout pattern
    const injectionPerLine = content
      .split('\n')
      .some((line) => /`[^`]*`\];\s*console\.log/.test(line))
    expect(injectionPerLine).toBe(false)
  })

  it('escapes ${ in resource name', () => {
    const resource = DOLLAR_BRACE_RESOURCE
    const spec = makeSpec({
      [`/${resource}`]: {
        get: {
          operationId: 'listItems3',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateHooks(spec, defaultOptions)
    // primaryResource strips {} from the segment, so items${process.exit(1)} becomes
    // items$process.exit(1) — JSON.stringify then wraps it in double quotes.
    const sanitizedResource = resource.replace(/[{}]/g, '')
    expect(content).toContain(JSON.stringify(sanitizedResource))
    // The raw ${...} template interpolation syntax must not appear anywhere in output
    expect(content).not.toContain('${process.exit(1)}')
  })

  it('escapes newline in resource name', () => {
    const resource = NEWLINE_RESOURCE
    const spec = makeSpec({
      [`/${resource}`]: {
        get: {
          operationId: 'listItems4',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateHooks(spec, defaultOptions)
    expect(content).toContain(JSON.stringify(resource))
    // Raw newline must not appear inside a string literal
    expect(content).not.toMatch(/"items\nmalicious"/)
  })

  it('valid resource name produces correct double-quoted output (regression guard)', () => {
    const spec = makeSpec({
      '/tasks': {
        get: {
          operationId: 'listTasks',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateHooks(spec, defaultOptions)
    // Normal resource name must still be quoted correctly
    expect(content).toContain('["tasks"]')
  })
})
