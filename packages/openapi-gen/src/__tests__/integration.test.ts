/**
 * Integration tests — generate a real client and call a live API.
 * Requires network access. Open-Meteo is free, no auth, no rate-limiting for small usage.
 */
import { describe, it, expect } from 'vitest'
import { writeFile, rm, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { parseSpec } from '../parser.js'
import { generateTypes } from '../plugins/types.js'
import { generateClientConfig } from '../plugins/client-config.js'
import { generateClient } from '../plugins/client.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const openMeteoFixture = join(__dirname, '../__fixtures__/specs/open-meteo.json')

describe('integration: Open-Meteo (real HTTP, no auth)', () => {
  it('generated client fetches real current weather for Berlin', async () => {
    // 1. Generate all three files from the Open-Meteo spec
    const spec = await parseSpec(openMeteoFixture)
    const modelsContent = generateTypes(spec).content
    const clientConfigContent = generateClientConfig().content
    const clientContent = generateClient(spec).content

    // 2. Write to a temp directory
    const tmpDir = join(tmpdir(), `openapi-gen-integration-${Date.now()}`)
    await mkdir(tmpDir, { recursive: true })

    // ESM package.json needed so tsx treats top-level await as ESM
    await writeFile(join(tmpDir, 'package.json'), JSON.stringify({ type: 'module' }), 'utf-8')
    await writeFile(join(tmpDir, 'models.ts'), modelsContent, 'utf-8')
    await writeFile(join(tmpDir, 'client-config.ts'), clientConfigContent, 'utf-8')
    await writeFile(join(tmpDir, 'client.ts'), clientContent, 'utf-8')

    // 3. Write a runner that configures the client and calls getForecast (Berlin)
    const runner = `
import { configureClient } from './client-config.ts'
import { getForecast } from './client.ts'

configureClient({ baseUrl: 'https://api.open-meteo.com', credentials: 'omit' })

const result = await getForecast({
  latitude: 52.52,
  longitude: 13.41,
  current_weather: true,
})

// Output as JSON so the test can parse it
console.log(JSON.stringify(result))
`
    await writeFile(join(tmpDir, 'runner.ts'), runner, 'utf-8')

    // 4. Run via tsx (TypeScript runner — available as a dev dep of vitest ecosystem)
    let output: string
    try {
      output = execSync(`npx tsx ${join(tmpDir, 'runner.ts')}`, {
        encoding: 'utf-8',
        timeout: 15_000,
        env: { ...process.env, NODE_NO_WARNINGS: '1' },
      }).trim()
    } finally {
      await rm(tmpDir, { recursive: true, force: true })
    }

    // 5. Parse and assert on the real response
    const data = JSON.parse(output) as Record<string, unknown>

    expect(typeof data.latitude).toBe('number')
    expect(typeof data.longitude).toBe('number')
    expect(typeof data.timezone).toBe('string')
    expect(data).toHaveProperty('current_weather')

    const cw = data.current_weather as Record<string, unknown>
    expect(typeof cw.temperature).toBe('number')
    expect(typeof cw.windspeed).toBe('number')
    expect(typeof cw.weathercode).toBe('number')
  }, 20_000) // 20s timeout for network
})
