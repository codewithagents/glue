// fallow-ignore-file code-duplication
import { describe, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseSpec } from '@codewithagents/openapi-gen'
import { generateService } from '../plugins/service.js'
import { generateRouter, generateExpressRouter, generateFastifyRouter } from '../plugins/router.js'

const configsDir = resolve(import.meta.dirname, '../../../../examples/configs')

const cases = readdirSync(configsDir)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => {
    const config = JSON.parse(readFileSync(resolve(configsDir, f), 'utf-8')) as { input_openapi: string }
    const specPath = resolve(configsDir, config.input_openapi)
    return { name: f.replace('.json', ''), specPath }
  })

describe.each(cases)('compat — $name', ({ specPath }) => {
  it('generates without throwing (hono)', async () => {
    const spec = await parseSpec(specPath)
    generateService(spec)
    generateRouter(spec)
  })

  it('generates without throwing (express)', async () => {
    const spec = await parseSpec(specPath)
    generateExpressRouter(spec)
  })

  it('generates without throwing (fastify)', async () => {
    const spec = await parseSpec(specPath)
    generateFastifyRouter(spec)
  })
})
