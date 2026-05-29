/**
 * Smoke tests — real HTTP calls to public, no-auth APIs.
 *
 * Purpose: prove the generated clients actually produce working HTTP requests,
 * not just that they compile. Each test makes one real network call and asserts
 * the response has a plausible shape.
 *
 * Run by the smoke.yml GitHub workflow (weekly + manual + every push to main).
 *
 * Rate limiting: tests run sequentially (vitest concurrency=1) and each call is
 * followed by a 500ms pause to be polite to free-tier APIs.
 */
import { describe, it, expect } from 'vitest'
import { configureClient as configureOpenMeteo } from '../generated/open-meteo/client-config.js'
import { getV1Forecast } from '../generated/open-meteo/client.js'
import { configureClient as configureCanada } from '../generated/canada_holidays/client-config.js'
import { holidays } from '../generated/canada_holidays/client.js'
import { configureClient as configureExchangeRate } from '../generated/exchangerate/client-config.js'
import { getLatestByBaseCurrency } from '../generated/exchangerate/client.js'
import { configureClient as configureDnd5e } from '../generated/dnd5e/client-config.js'
import {
  getApi,
  getApiByEndpoint,
  getApiAbilityScoresByIndex,
  getApiMonsters,
  getApiMonstersByIndex,
} from '../generated/dnd5e/client.js'

/** Pause between API calls — be polite to free-tier services */
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

/** Assert a paginated list response has a positive count and non-empty results array */
function assertPaginatedList(result: unknown): void {
  expect(result).toBeDefined()
  const list = result as { count?: number; results?: unknown[] }
  expect(typeof list.count).toBe('number')
  expect(list.count as number).toBeGreaterThan(0)
  expect(Array.isArray(list.results)).toBe(true)
  expect((list.results as unknown[]).length).toBeGreaterThan(0)
}

// ─── Open-Meteo ──────────────────────────────────────────────────────────────

describe('Open-Meteo (weather, no auth)', () => {
  it('returns current weather for Berlin', async () => {
    configureOpenMeteo({
      baseUrl: 'https://api.open-meteo.com',
      credentials: 'omit',  // required for cross-origin requests in Node.js
    })

    const result = await getV1Forecast({
      latitude: 52.52,
      longitude: 13.41,
      currentWeather: true,  // generated param name is camelCase
    })

    expect(result).toBeDefined()
    expect(typeof (result as Record<string, unknown>).latitude).toBe('number')
    expect(typeof (result as Record<string, unknown>).longitude).toBe('number')

    await sleep()
  })

  it('returns hourly temperature data when requested', async () => {
    configureOpenMeteo({
      baseUrl: 'https://api.open-meteo.com',
      credentials: 'omit',
    })

    const result = await getV1Forecast({
      latitude: 48.85,
      longitude: 2.35,
      hourly: ['temperature_2m'],  // array, not string
    })

    expect(result).toBeDefined()
    expect((result as Record<string, unknown>).hourly).toBeDefined()

    await sleep()
  })
})

// ─── Canada Holidays ─────────────────────────────────────────────────────────

describe('Canada Holidays (public holiday data, no auth)', () => {
  it('returns a list of Canadian holidays', async () => {
    configureCanada({
      baseUrl: 'https://canada-holidays.ca',
      credentials: 'omit',
    })

    const result = await holidays()

    expect(result).toBeDefined()
    const list = (result as { holidays?: unknown[] }).holidays
    expect(Array.isArray(list)).toBe(true)
    expect((list as unknown[]).length).toBeGreaterThan(0)

    await sleep()
  })
})

// ─── Exchange Rate ────────────────────────────────────────────────────────────

describe('Exchange Rate API (currency rates, no auth)', () => {
  it('returns EUR exchange rates with USD included', async () => {
    configureExchangeRate({
      baseUrl: 'https://api.exchangerate-api.com/v4',
      credentials: 'omit',
    })

    const result = await getLatestByBaseCurrency('EUR')

    expect(result).toBeDefined()
    const data = result as { base?: string; rates?: Record<string, number> }
    expect(data.base).toBe('EUR')
    expect(typeof data.rates).toBe('object')
    expect(typeof data.rates!['USD']).toBe('number')

    await sleep()
  })
})

// ─── D&D 5e ──────────────────────────────────────────────────────────────────

describe('D&D 5e API (game data, no auth)', () => {
  it('returns the root resource index with known keys', async () => {
    configureDnd5e({
      baseUrl: 'https://www.dnd5eapi.co',
      credentials: 'omit',
    })

    const result = await getApi()

    expect(result).toBeDefined()
    const index = result as Record<string, unknown>
    expect(typeof index['ability-scores']).toBe('string')
    expect(typeof index['monsters']).toBe('string')

    await sleep()
  })

  it('returns the ability-scores list with count and results', async () => {
    configureDnd5e({
      baseUrl: 'https://www.dnd5eapi.co',
      credentials: 'omit',
    })

    const result = await getApiByEndpoint('ability-scores')
    assertPaginatedList(result)
    await sleep()
  })

  it('returns full detail for the STR ability score', async () => {
    configureDnd5e({
      baseUrl: 'https://www.dnd5eapi.co',
      credentials: 'omit',
    })

    const result = await getApiAbilityScoresByIndex('str')

    expect(result).toBeDefined()
    const score = result as { index?: string; full_name?: string }
    expect(score.index).toBe('str')
    expect(typeof score.full_name).toBe('string')
    expect((score.full_name as string).length).toBeGreaterThan(0)

    await sleep()
  })

  it('returns the monsters list with count and results', async () => {
    configureDnd5e({
      baseUrl: 'https://www.dnd5eapi.co',
      credentials: 'omit',
    })

    const result = await getApiMonsters()
    assertPaginatedList(result)
    await sleep()
  })

  it('returns full detail for the aboleth monster', async () => {
    configureDnd5e({
      baseUrl: 'https://www.dnd5eapi.co',
      credentials: 'omit',
    })

    const result = await getApiMonstersByIndex('aboleth')

    expect(result).toBeDefined()
    const monster = result as { index?: string; name?: string; hit_points?: number }
    expect(monster.index).toBe('aboleth')
    expect(typeof monster.name).toBe('string')
    expect(typeof monster.hit_points).toBe('number')

    await sleep()
  })
})
