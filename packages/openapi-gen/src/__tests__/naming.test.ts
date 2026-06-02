import { describe, it, expect } from 'vitest'
import {
  toTypeName,
  toPropertyKey,
  deriveOperationName,
  sanitizeOperationId,
} from '../utils/naming.js'

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
      expect(result).toContain(input.replace(/\\/g, '\\\\').replace(/'/g, "\\'"))
    }
  )

  it('quotes keys starting with a digit', () => {
    const result = toPropertyKey('123abc')
    expect(result.startsWith("'") || result.startsWith('"')).toBe(true)
  })
})

describe('sanitizeOperationId', () => {
  it.each([
    ['post-applePay-sessions', 'postApplePaySessions'],
    ['calendar.calendars.insert', 'calendarCalendarsInsert'],
    ['Get User Profile', 'getUserProfile'],
    ['forgotPassword(oneTimeCode)', 'forgotPasswordOneTimeCode'],
    ['delete-storedPaymentMethods-id', 'deleteStoredPaymentMethodsId'],
    ['actions/add-custom-labels', 'actionsAddCustomLabels'],
  ])('converts %s to camelCase identifier', (input, expected) => {
    expect(sanitizeOperationId(input)).toBe(expected)
  })

  it('prefixes with underscore when result starts with a digit', () => {
    expect(sanitizeOperationId('123foo')).toBe('_123foo')
  })

  it('prefixes with underscore when result is a reserved keyword', () => {
    expect(sanitizeOperationId('delete')).toBe('_delete')
    expect(sanitizeOperationId('return')).toBe('_return')
    expect(sanitizeOperationId('import')).toBe('_import')
  })

  it('returns "unknown" for empty or all-separator input', () => {
    expect(sanitizeOperationId('')).toBe('unknown')
    expect(sanitizeOperationId('---')).toBe('unknown')
  })
})

describe('deriveOperationName', () => {
  it.each([
    ['get', '/tasks', 'getTasks'],
    ['post', '/tasks', 'createTasks'],
    ['put', '/tasks/{id}', 'updateTasksById'],
    ['delete', '/tasks/{id}', 'deleteTasksById'],
    ['patch', '/tasks/{id}', 'patchTasksById'],
    ['get', '/api/v1/tasks', 'getTasks'],
    ['get', '/api/v2/tasks/{id}', 'getTasksById'],
  ])('%s %s -> %s', (method, path, expected) => {
    expect(deriveOperationName(method, path)).toBe(expected)
  })

  it('handles hyphenated path segments', () => {
    expect(deriveOperationName('get', '/api-keys/{id}')).toBe('getApiKeysById')
  })

  // Regression guard for #241: deriveOperationName diverged between the old
  // client.ts and hooks.ts for segments containing path params mixed with
  // static text. Specifically:
  //
  //   Segment "{Y}.pbf" (brace + static suffix):
  //     Old client.ts: toTypeName("{Y}.pbf") = "Ypbf"  (no "By" prefix!)
  //     Old hooks.ts:  extracts {Y}, produces "ByY"    (discards ".pbf")
  //     -> hooks imported a function the client never exported
  //
  //   Segment "{Y}.{format}" (brace + brace, starts AND ends with braces):
  //     Both old versions: treated as single brace, slice(1,-1) = "Y}.{format"
  //     sanitize/toTypeName -> "ByYFormat"   (happened to agree)
  //
  // Now both generators use the same deriveOperationName from naming.ts.
  it('segment ending in static suffix (e.g. {Y}.pbf) gets "By" prefix — regression guard for #241', () => {
    // ".pbf" is a static suffix, so the segment is not a pure brace.
    // The mixed-brace branch extracts {Y} and returns "ByY", discarding ".pbf".
    // Old client.ts would have produced "Ypbf" (no "By"), causing a name mismatch.
    const path = '/map/{versionNumber}/tile/{layer}/{style}/{zoom}/{X}/{Y}.pbf'
    const name = deriveOperationName('get', path)
    expect(name).toBe('getMapByVersionNumberTileByLayerByStyleByZoomByXByY')
    // Old (wrong) client.ts behaviour: toTypeName on whole segment -> no "By" before Y
    expect(name).not.toBe('getMapByVersionNumberTileByLayerByStyleByZoomByXYpbf')
  })

  it('segment with two braces and no static interior ({Y}.{format}) is treated as single-brace', () => {
    // "{Y}.{format}" starts and ends with a brace, so it falls into the
    // single-brace path: slice(1,-1) = "Y}.{format", sanitize -> "yFormat".
    // Both old and new agree on this: "ByYFormat".
    const path = '/map/{versionNumber}/tile/{zoom}/{X}/{Y}.{format}'
    const name = deriveOperationName('get', path)
    expect(name).toBe('getMapByVersionNumberTileByZoomByXByYFormat')
  })
})
