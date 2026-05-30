import { describe, it, expect } from 'vitest'
import { toTypeName, toPropertyKey } from '../utils/naming.js'

describe('toTypeName', () => {
  it.each([
    ['Campaign', 'Campaign'],
    ['campaign', 'Campaign'],
    ['createCampaign', 'CreateCampaign'],
    ['create-campaign-request', 'CreateCampaignRequest'],
    ['create_campaign_request', 'CreateCampaignRequest'],
    ['CREATE_CAMPAIGN', 'CREATECAMPAIGN'],
    ['HTTPSUrl', 'HTTPSUrl'],
  ])('converts %s → %s', (input, expected) => {
    expect(toTypeName(input)).toBe(expected)
  })

  it('prepends underscore when name starts with a digit', () => {
    const result = toTypeName('123foo')
    expect(result).toMatch(/^_/)
  })

  it('produces a non-empty string for any input', () => {
    expect(toTypeName('').length).toBeGreaterThanOrEqual(1)
    expect(toTypeName('---').length).toBeGreaterThanOrEqual(1)
  })
})

describe('toPropertyKey', () => {
  it.each([
    ['id', 'id'],
    ['createdAt', 'createdAt'],
    ['_private', '_private'],
    ['$special', '$special'],
  ])('returns plain identifier for valid key %s', (input, expected) => {
    expect(toPropertyKey(input)).toBe(expected)
  })

  it.each([['Content-Type'], ['x-request-id'], ['x-custom-header'], ['has space']])(
    'quotes invalid identifier %s',
    (input) => {
      const result = toPropertyKey(input)
      expect(result.startsWith("'") || result.startsWith('"')).toBe(true)
      expect(result).toContain(input.replace(/'/g, "\\'"))
    }
  )

  it('quotes keys starting with a digit', () => {
    const result = toPropertyKey('123abc')
    expect(result.startsWith("'") || result.startsWith('"')).toBe(true)
  })
})
