/**
 * Smoke tests — real HTTP calls to public, no-auth APIs.
 *
 * Purpose: prove the generated clients actually produce working HTTP requests,
 * not just that they compile. Each test makes one real network call and asserts
 * the response has a plausible shape.
 *
 * Run by the smoke.yml GitHub workflow (weekly + manual). Never runs on every PR.
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

/** Pause between API calls — be polite to free-tier services */
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

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
