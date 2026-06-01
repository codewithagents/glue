/**
 * Security regression tests: spec-derived path strings must not inject executable
 * code into generated router output for Hono, Express, and Fastify.
 *
 * ROOT CAUSE: raw `'${op.honoPath}'` interpolation lets a single quote in an OpenAPI
 * path break out of the generated string literal and inject arbitrary statements.
 */
import { describe, it, expect } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { generateRouter, generateExpressRouter, generateFastifyRouter } from '../plugins/router.js'

// ── Adversarial payloads ───────────────────────────────────────────────────────

const SINGLE_QUOTE_PAYLOAD_PATH = `/items'); console.log('injected'); ('`
const BACKTICK_PAYLOAD_PATH = `/items\`); console.log(\`injected\`); (\``
const DOLLAR_BRACE_PATH = `/items\${process.exit(1)}/data`
const PARAM_PATH_INJECTION = `/items'); throw new Error('p'); const z = '/{id}`

function makeSpec(paths: OpenAPIV3_1.PathsObject): OpenAPIV3_1.Document {
  return {
    openapi: '3.1.0',
    info: { title: 'Security Test', version: '1.0.0' },
    paths,
  }
}

function makePathSpec(path: string, hasParam = false): OpenAPIV3_1.PathsObject {
  const parameters: OpenAPIV3_1.ParameterObject[] = hasParam
    ? [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }]
    : []
  return {
    [path]: {
      get: {
        operationId: 'doIt',
        parameters,
        responses: { '200': { description: 'ok' } },
      },
    },
  }
}

// ── Hono router ───────────────────────────────────────────────────────────────

describe('SECURITY: generateRouter (Hono) — path injection prevention', () => {
  it('escapes single-quote in plain path string', () => {
    const { content } = generateRouter(makeSpec(makePathSpec(SINGLE_QUOTE_PAYLOAD_PATH)))
    expect(content).not.toMatch(/'[^']*';\s*console\.log/)
    expect(content).not.toContain(`'${SINGLE_QUOTE_PAYLOAD_PATH}'`)
    // Must be JSON-encoded
    expect(content).toContain(JSON.stringify(SINGLE_QUOTE_PAYLOAD_PATH))
  })

  it('escapes single-quote in path with path params', () => {
    const { content } = generateRouter(makeSpec(makePathSpec(PARAM_PATH_INJECTION, true)))
    expect(content).not.toMatch(/'[^']*';\s*throw new Error/)
    // The Hono version of the path is also JSON-encoded
    // Hono path conversion: {id} -> :id, so dangerous part of path still present
    expect(content).not.toContain(`'${PARAM_PATH_INJECTION}'`)
  })

  it('escapes single-quote in c.req.param() lookup string', () => {
    // Path param name derived from spec path — ensure the lookup key is JSON-encoded
    const pathWithDangerousParam = `/items/{param'; throw new Error('x')}`
    const { content } = generateRouter(
      makeSpec({
        [pathWithDangerousParam]: {
          get: {
            operationId: 'getItem',
            parameters: [
              {
                name: `param'; throw new Error('x')`,
                in: 'path',
                required: true,
                schema: { type: 'string' },
              },
            ],
            responses: { '200': { description: 'ok' } },
          },
        },
      })
    )
    expect(content).not.toMatch(/c\.req\.param\('[^']*';\s*throw new Error/)
    // The param lookup must use JSON.stringify encoding
    const escapedParam = JSON.stringify(`param'; throw new Error('x')`)
    expect(content).toContain(`c.req.param(${escapedParam})`)
  })
})

// ── Express router ────────────────────────────────────────────────────────────

describe('SECURITY: generateExpressRouter — path injection prevention', () => {
  it('escapes single-quote in plain path string', () => {
    const { content } = generateExpressRouter(makeSpec(makePathSpec(SINGLE_QUOTE_PAYLOAD_PATH)))
    expect(content).not.toMatch(/'[^']*';\s*console\.log/)
    expect(content).not.toContain(`'${SINGLE_QUOTE_PAYLOAD_PATH}'`)
    expect(content).toContain(JSON.stringify(SINGLE_QUOTE_PAYLOAD_PATH))
  })

  it('escapes backtick in path string', () => {
    const { content } = generateExpressRouter(makeSpec(makePathSpec(BACKTICK_PAYLOAD_PATH)))
    // The JSON-encoded version should be present
    expect(content).toContain(JSON.stringify(BACKTICK_PAYLOAD_PATH))
    // No unescaped executable backtick injection
    expect(content).not.toMatch(/`[^`]*`;\s*console\.log/)
  })

  it('valid path produces correct output (regression guard)', () => {
    const { content } = generateExpressRouter(makeSpec(makePathSpec('/users')))
    expect(content).toContain('router.get("/users",')
  })
})

// ── Fastify router ────────────────────────────────────────────────────────────

describe('SECURITY: generateFastifyRouter — path injection prevention', () => {
  it('escapes single-quote in plain path string', () => {
    const { content } = generateFastifyRouter(makeSpec(makePathSpec(SINGLE_QUOTE_PAYLOAD_PATH)))
    expect(content).not.toMatch(/'[^']*';\s*console\.log/)
    expect(content).not.toContain(`'${SINGLE_QUOTE_PAYLOAD_PATH}'`)
    expect(content).toContain(JSON.stringify(SINGLE_QUOTE_PAYLOAD_PATH))
  })

  it('escapes ${ in path string', () => {
    const { content } = generateFastifyRouter(makeSpec(makePathSpec(DOLLAR_BRACE_PATH)))
    // JSON.stringify encodes this safely in a double-quoted string.
    // The router converts {process.exit(1)} to :process.exit(1) (honoPath), so assert on that.
    const honoPath = DOLLAR_BRACE_PATH.replace(/\{([^}]+)\}/g, ':$1')
    expect(content).toContain(JSON.stringify(honoPath))
    // The raw ${ must not appear as an unquoted template interpolation in the output
    expect(content).not.toMatch(/app\.get\(`[^`]*\$\{/)
  })

  it('valid path produces correct output (regression guard)', () => {
    const { content } = generateFastifyRouter(makeSpec(makePathSpec('/widgets')))
    expect(content).toContain('app.get("/widgets",')
  })
})
