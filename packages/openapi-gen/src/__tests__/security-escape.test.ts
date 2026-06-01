/**
 * Security regression tests: spec-derived strings must not inject executable code
 * into generated TypeScript output.
 *
 * ROOT CAUSE: raw `'${value}'` interpolation lets a single quote in an OpenAPI spec
 * value break out of the generated string literal and inject arbitrary statements.
 * These tests feed adversarial payloads and assert the output is properly escaped.
 *
 * IMPORTANT: assertions check that the raw unescaped single-quoted form is absent and
 * that the value appears only as a properly-encoded string (JSON.stringify output).
 */
import { describe, it, expect } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateClient } from '../plugins/client.js'
import { generateTypes } from '../plugins/types.js'

function makeSpec(
  paths: OpenAPIV3_1.PathsObject,
  schemas?: Record<string, OpenAPIV3_1.SchemaObject>
): OpenAPIV3_1.Document {
  return {
    openapi: '3.1.0',
    info: { title: 'Security Test', version: '1.0.0' },
    paths,
    components: schemas !== undefined ? { schemas } : undefined,
  }
}

// ── generateClient — plain path strings (no path params) ──────────────────────

describe('SECURITY: generateClient — plain path injection prevention', () => {
  it('single-quote payload path is JSON-encoded (double-quoted), not single-quoted', () => {
    const path = `/items'); console.log('injected'); ('`
    const spec = makeSpec({
      [path]: {
        get: {
          operationId: 'getItems',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)

    // Must NOT appear raw in a single-quoted string literal
    expect(content).not.toContain(`'${path}'`)

    // Must appear as JSON.stringify output (double-quoted, all chars safe inside)
    expect(content).toContain(JSON.stringify(path))
  })

  it('double-quote payload path is JSON-encoded and backslash-escaped', () => {
    const path = `/items"; throw new Error("injected"); const z = "`
    const spec = makeSpec({
      [path]: {
        get: {
          operationId: 'getItems2',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    expect(content).not.toContain(`'${path}'`)
    expect(content).toContain(JSON.stringify(path))
  })

  it('newline in path is JSON-encoded (produces \\n, no raw newline)', () => {
    const path = `/items\nmalicious`
    const spec = makeSpec({
      [path]: {
        get: {
          operationId: 'getItems3',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // JSON.stringify converts \n to \\n in the output string
    expect(content).toContain(JSON.stringify(path))
    // Raw newline must not appear between quote chars in this context
    expect(content).not.toContain(`'/items\nmalicious'`)
  })

  it('valid path still emits correctly as double-quoted string', () => {
    const spec = makeSpec({
      '/users': {
        get: {
          operationId: 'listUsers',
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // JSON.stringify('/users') = '"/users"'
    expect(content).toContain('"/users"')
  })
})

// ── generateClient — template-literal paths (with path params) ────────────────

describe('SECURITY: generateClient — template-literal path injection prevention', () => {
  it('backtick in static path segment is escaped in template literal', () => {
    // The backtick in the static segment would break out if not escaped
    const staticSegment = '/items`badcode'
    const path = `${staticSegment}/{id}`
    const spec = makeSpec({
      [path]: {
        get: {
          operationId: 'getItem',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // The backtick in the static segment must be escaped as \` in the output
    expect(content).toContain('\\`')
    // The raw path segment without escaping must not appear as two separate template literals
    expect(content).not.toContain('`/items`badcode/')
  })

  it('${ in static path segment is escaped in template literal', () => {
    // Construct a path where the static segment AFTER {id} contains an unclosed ${.
    // The split regex \{([^}]+)\} matches {id} and leaves /${process.exit(1) (no closing })
    // as a trailing static segment. escapeTemplateLiteralText then escapes ${ to \${ in it.
    // This models an adversarial spec trying to inject a template literal expression.
    const path = '/items/{id}/' + '$' + '{process.exit(1)'
    const spec = makeSpec({
      [path]: {
        get: {
          operationId: 'getItem2',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // The static segment /${process.exit(1) must have ${ escaped to \${ in the output
    expect(content).toContain('\\${process.exit(1)')
    // No UNESCAPED ${process.exit may appear (negative lookbehind ignores the escaped \${ form)
    expect(content).not.toMatch(/(?<!\\)\$\{process\.exit/)
  })

  it('backslash in static path segment is escaped in template literal', () => {
    const path = `/items\\malicious/{id}`
    const spec = makeSpec({
      [path]: {
        get: {
          operationId: 'getItem3',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // Backslash must be escaped as \\
    expect(content).toContain('\\\\')
  })

  it('valid path with path params still uses template literal correctly', () => {
    const spec = makeSpec({
      '/users/{id}': {
        get: {
          operationId: 'getUser',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    expect(content).toContain('`/users/${encodeURIComponent(id)}`')
  })
})

// ── generateClient — query param string enum injection ────────────────────────

describe('SECURITY: generateClient — query string enum injection prevention', () => {
  it('single-quote in enum value is JSON-encoded (double-quoted)', () => {
    const dangerousVal = `x'; throw new Error('injected'); const y = '`
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: 'listItems',
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: {
                type: 'string',
                enum: [dangerousVal, 'safe'],
              },
            },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // Must not appear raw in a single-quoted string
    expect(content).not.toContain(`'${dangerousVal}'`)
    // Must appear as JSON-encoded double-quoted string
    expect(content).toContain(JSON.stringify(dangerousVal))
  })

  it('valid enum values are double-quoted via JSON.stringify (regression guard)', () => {
    const spec = makeSpec({
      '/items': {
        get: {
          operationId: 'listItems2',
          parameters: [
            {
              name: 'category',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['books', 'electronics'],
              },
            },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // JSON.stringify produces double-quoted strings
    expect(content).toContain('"books" | "electronics"')
  })
})

// ── generateClient — header name injection ────────────────────────────────────

describe('SECURITY: generateClient — header name injection prevention', () => {
  it('single-quote in header name is JSON-encoded as object key', () => {
    const dangerousHeader = `X-Test'; throw new Error('hacked'); const z = 'X`
    const spec = makeSpec({
      '/secure': {
        get: {
          operationId: 'secureGet',
          parameters: [
            {
              name: dangerousHeader,
              in: 'header',
              required: false,
              schema: { type: 'string' },
            },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // The header key must not appear in a single-quoted string context
    expect(content).not.toContain(`'${dangerousHeader}'`)
    // Must be JSON-encoded
    expect(content).toContain(JSON.stringify(dangerousHeader))
  })

  it('header identifier strips apostrophes from generated property name', () => {
    // A header name with apostrophes must produce a valid JS identifier without apostrophes
    const headerName = `X-User's-Token`
    const spec = makeSpec({
      '/guarded': {
        get: {
          operationId: 'guardedGet',
          parameters: [
            {
              name: headerName,
              in: 'header',
              required: false,
              schema: { type: 'string' },
            },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // safeHeaderIdentifier strips apostrophes: xUser'sToken -> xUsersToken
    expect(content).toContain('xUsersToken')
    // Raw identifier with apostrophe must not appear
    expect(content).not.toContain("xUser'sToken")
  })

  it('standard X-Foo-Bar header still maps to xFooBar (API guardrail)', () => {
    const spec = makeSpec({
      '/check': {
        get: {
          operationId: 'checkHeader',
          parameters: [
            {
              name: 'X-Stripe-Signature',
              in: 'header',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: { '200': { description: 'ok' } },
        },
      },
    })
    const { content } = generateClient(spec)
    // Property name must be xStripeSignature (not changed by security fix)
    expect(content).toContain('xStripeSignature: string')
    // Key is now double-quoted (only quote style changed)
    expect(content).toContain('"X-Stripe-Signature": params.xStripeSignature')
  })
})

// ── generateTypes — string enum values array injection ────────────────────────

describe('SECURITY: generateTypes — string enum values array injection prevention', () => {
  it('single-quote in enum value is JSON-encoded in the values array', () => {
    const dangerousVal = `x'; throw new Error('injected'); const y = '`
    const content = generateTypes(
      makeSpec(
        {},
        {
          Status: {
            type: 'string',
            enum: [dangerousVal, 'active'],
          },
        }
      )
    ).content
    // Must not appear raw in a single-quoted array element
    expect(content).not.toContain(`'${dangerousVal}'`)
    // Must be JSON-encoded
    expect(content).toContain(JSON.stringify(dangerousVal))
  })

  it('backtick in enum value is JSON-encoded', () => {
    const val = 'val`ue'
    const content = generateTypes(
      makeSpec(
        {},
        {
          Kind: {
            type: 'string',
            enum: [val, 'normal'],
          },
        }
      )
    ).content
    expect(content).toContain(JSON.stringify(val))
  })

  it('valid enum values produce double-quoted output (regression guard)', () => {
    const content = generateTypes(
      makeSpec(
        {},
        {
          Color: {
            type: 'string',
            enum: ['red', 'green', 'blue'],
          },
        }
      )
    ).content
    // Normal values still appear correctly (double-quoted via JSON.stringify)
    expect(content).toContain('"red"')
    expect(content).toContain('"green"')
    expect(content).toContain('"blue"')
    expect(content).toContain('ColorValues = ["red", "green", "blue"] as const')
  })
})
