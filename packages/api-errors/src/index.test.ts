import { describe, expect, it, vi } from 'vitest'
import { extractFieldErrors, mapApiErrors } from './index.js'

// ---------------------------------------------------------------------------
// extractFieldErrors — RFC 7807 / Spring Boot 3+
// ---------------------------------------------------------------------------

describe('extractFieldErrors — RFC 7807 format', () => {
  it('maps a single field with one message', () => {
    expect(extractFieldErrors({ errors: { email: ['must not be blank'] } })).toEqual([
      { field: 'email', message: 'must not be blank' },
    ])
  })

  it('maps multiple fields', () => {
    const result = extractFieldErrors({
      errors: { email: ['must not be blank'], name: ['too short'] },
    })
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ field: 'email', message: 'must not be blank' })
    expect(result).toContainEqual({ field: 'name', message: 'too short' })
  })

  it('expands multiple messages per field into separate FieldErrors', () => {
    expect(extractFieldErrors({ errors: { email: ['must not be blank', 'invalid format'] } })).toEqual([
      { field: 'email', message: 'must not be blank' },
      { field: 'email', message: 'invalid format' },
    ])
  })

  it('handles a string value (not array) in errors map', () => {
    expect(extractFieldErrors({ errors: { email: 'must not be blank' } })).toEqual([
      { field: 'email', message: 'must not be blank' },
    ])
  })

  it('skips null values in errors map — no garbage errors', () => {
    // null value should be silently skipped, not stringified as "null"
    expect(extractFieldErrors({ errors: { email: null } })).toEqual([])
  })

  it('returns [] for empty errors object', () => {
    expect(extractFieldErrors({ errors: {} })).toEqual([])
  })

  it('returns [] when errors is null', () => {
    expect(extractFieldErrors({ errors: null })).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// extractFieldErrors — Spring Boot default validation format (array)
// ---------------------------------------------------------------------------

describe('extractFieldErrors — Spring Boot array format', () => {
  it('maps field + defaultMessage', () => {
    expect(
      extractFieldErrors({ errors: [{ field: 'email', defaultMessage: 'must not be blank' }] }),
    ).toEqual([{ field: 'email', message: 'must not be blank' }])
  })

  it('falls back to message when defaultMessage is absent', () => {
    expect(
      extractFieldErrors({ errors: [{ field: 'email', message: 'must not be blank' }] }),
    ).toEqual([{ field: 'email', message: 'must not be blank' }])
  })

  it('falls back to "Unknown error" when both defaultMessage and message are absent', () => {
    expect(extractFieldErrors({ errors: [{ field: 'email' }] })).toEqual([
      { field: 'email', message: 'Unknown error' },
    ])
  })

  it('uses fallbackField when item has no field key', () => {
    expect(
      extractFieldErrors(
        { errors: [{ defaultMessage: 'something went wrong' }] },
        { fallbackField: 'root' },
      ),
    ).toEqual([{ field: 'root', message: 'something went wrong' }])
  })

  it('maps multiple entries', () => {
    const result = extractFieldErrors({
      errors: [
        { field: 'email', defaultMessage: 'must not be blank' },
        { field: 'name', defaultMessage: 'too short' },
      ],
    })
    expect(result).toHaveLength(2)
  })

  it('skips non-object items in the array', () => {
    expect(extractFieldErrors({ errors: [null, { field: 'email', message: 'bad' }] })).toEqual([
      { field: 'email', message: 'bad' },
    ])
  })
})

// ---------------------------------------------------------------------------
// extractFieldErrors — flat object format
// ---------------------------------------------------------------------------

describe('extractFieldErrors — flat object format', () => {
  it('maps { field, message } directly', () => {
    expect(extractFieldErrors({ field: 'email', message: 'Invalid email' })).toEqual([
      { field: 'email', message: 'Invalid email' },
    ])
  })

  it('uses fallbackField when field is absent', () => {
    expect(extractFieldErrors({ message: 'Something went wrong' }, { fallbackField: 'root' })).toEqual([
      { field: 'root', message: 'Something went wrong' },
    ])
  })
})

// ---------------------------------------------------------------------------
// extractFieldErrors — flat array format
// ---------------------------------------------------------------------------

describe('extractFieldErrors — flat array format', () => {
  it('maps an array of { field, message } objects', () => {
    expect(
      extractFieldErrors([
        { field: 'email', message: 'Invalid' },
        { field: 'name', message: 'Required' },
      ]),
    ).toEqual([
      { field: 'email', message: 'Invalid' },
      { field: 'name', message: 'Required' },
    ])
  })

  it('produces multiple entries for the same field — last setError call wins in RHF', () => {
    // Documenting the behavior: callers should be aware that RHF setError
    // called twice for the same field means the second message wins
    const result = extractFieldErrors([
      { field: 'email', message: 'Too short' },
      { field: 'email', message: 'Invalid format' },
    ])
    expect(result).toEqual([
      { field: 'email', message: 'Too short' },
      { field: 'email', message: 'Invalid format' },
    ])
  })

  it('skips entries without a message', () => {
    expect(extractFieldErrors([{ field: 'email' }, { field: 'name', message: 'Required' }])).toEqual(
      [{ field: 'name', message: 'Required' }],
    )
  })

  it('returns [] when all items are missing a message', () => {
    expect(extractFieldErrors([{ field: 'email' }, { field: 'name' }])).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// extractFieldErrors — response wrappers
// ---------------------------------------------------------------------------

describe('extractFieldErrors — response wrappers', () => {
  it('unwraps Axios-style response.data before parsing', () => {
    expect(
      extractFieldErrors({ response: { data: { errors: { email: ['must not be blank'] } } } }),
    ).toEqual([{ field: 'email', message: 'must not be blank' }])
  })

  it('unwraps a top-level data wrapper before parsing', () => {
    expect(
      extractFieldErrors({ data: { errors: { email: ['must not be blank'] } } }),
    ).toEqual([{ field: 'email', message: 'must not be blank' }])
  })
})

// ---------------------------------------------------------------------------
// extractFieldErrors — unrecognized / unknown shapes
// ---------------------------------------------------------------------------

describe('extractFieldErrors — unrecognized shapes', () => {
  it('returns [] for an unrecognized object', () => {
    expect(extractFieldErrors({ foo: 'bar' })).toEqual([])
  })

  it('returns [] for null', () => {
    expect(extractFieldErrors(null)).toEqual([])
  })

  it('returns [] for undefined', () => {
    expect(extractFieldErrors(undefined)).toEqual([])
  })

  it('returns [] for a plain string', () => {
    expect(extractFieldErrors('something went wrong')).toEqual([])
  })

  it('returns [] for a number', () => {
    expect(extractFieldErrors(42)).toEqual([])
  })

  it('never throws', () => {
    expect(() => extractFieldErrors({ deeply: { nested: { evil: true } } })).not.toThrow()
  })
})

// ---------------------------------------------------------------------------
// extractFieldErrors — options
// ---------------------------------------------------------------------------

describe('extractFieldErrors — options', () => {
  it('uses fallbackField for errors without a field name', () => {
    expect(extractFieldErrors({ message: 'Unauthorised' }, { fallbackField: 'serverError' })).toEqual(
      [{ field: 'serverError', message: 'Unauthorised' }],
    )
  })

  it('applies transformField to every resolved field name', () => {
    expect(
      extractFieldErrors(
        { errors: { emailAddress: ['invalid'] } },
        { transformField: (f) => f.replace(/([A-Z])/g, '.$1').toLowerCase() },
      ),
    ).toEqual([{ field: 'email.address', message: 'invalid' }])
  })

  it('applies transformField to fallbackField too', () => {
    expect(
      extractFieldErrors(
        { message: 'error' },
        {
          fallbackField: 'serverError',
          transformField: (f) => f.replace(/([A-Z])/g, '_$1').toLowerCase(),
        },
      ),
    ).toEqual([{ field: 'server_error', message: 'error' }])
  })

  it('passes through array bracket notation field names unchanged by default', () => {
    expect(
      extractFieldErrors([{ field: 'items[0].name', message: 'Required' }]),
    ).toEqual([{ field: 'items[0].name', message: 'Required' }])
  })

  it('transformField and fallbackField work together on Spring Boot array format', () => {
    const result = extractFieldErrors(
      { errors: [{ defaultMessage: 'required' }] }, // no field key → fallback
      {
        fallbackField: 'serverError',
        transformField: (f) => f.replace(/([A-Z])/g, '_$1').toLowerCase(),
      },
    )
    expect(result).toEqual([{ field: 'server_error', message: 'required' }])
  })
})

// ---------------------------------------------------------------------------
// mapApiErrors
// ---------------------------------------------------------------------------

describe('mapApiErrors', () => {
  it('calls setError for each field error with type "server"', () => {
    const setError = vi.fn()
    mapApiErrors({ errors: { email: ['must not be blank'], name: ['too short'] } }, setError)
    expect(setError).toHaveBeenCalledTimes(2)
    expect(setError).toHaveBeenCalledWith('email', { type: 'server', message: 'must not be blank' })
    expect(setError).toHaveBeenCalledWith('name', { type: 'server', message: 'too short' })
  })

  it('never calls setError for unrecognized errors', () => {
    const setError = vi.fn()
    mapApiErrors({ foo: 'bar' }, setError)
    expect(setError).not.toHaveBeenCalled()
  })

  it('never calls setError for null', () => {
    const setError = vi.fn()
    mapApiErrors(null, setError)
    expect(setError).not.toHaveBeenCalled()
  })

  it('honours transformField option', () => {
    const setError = vi.fn()
    mapApiErrors(
      { errors: { emailAddress: ['invalid'] } },
      setError,
      { transformField: (f) => f.replace(/([A-Z])/g, '.$1').toLowerCase() },
    )
    expect(setError).toHaveBeenCalledWith('email.address', { type: 'server', message: 'invalid' })
  })

  it('honours fallbackField option', () => {
    const setError = vi.fn()
    mapApiErrors({ message: 'Unauthorised' }, setError, { fallbackField: 'root' })
    expect(setError).toHaveBeenCalledWith('root', { type: 'server', message: 'Unauthorised' })
  })
})

// ---------------------------------------------------------------------------
// statusCodes filtering
// ---------------------------------------------------------------------------

describe('extractFieldErrors — statusCodes filtering', () => {
  it('extracts errors when status matches', () => {
    const err = { status: 422, errors: { email: ['Invalid'] } }
    expect(extractFieldErrors(err, { statusCodes: [422] })).toEqual([
      { field: 'email', message: 'Invalid' },
    ])
  })

  it('returns [] when status does not match', () => {
    const err = { status: 404, errors: { email: ['Invalid'] } }
    expect(extractFieldErrors(err, { statusCodes: [422] })).toEqual([])
  })

  it('returns [] for 500 when only 422 allowed', () => {
    const err = { status: 500, message: 'Internal Server Error' }
    expect(extractFieldErrors(err, { statusCodes: [422] })).toEqual([])
  })

  it('allows multiple status codes', () => {
    const err = { status: 400, errors: { name: ['required'] } }
    expect(extractFieldErrors(err, { statusCodes: [400, 422] })).toEqual([
      { field: 'name', message: 'required' },
    ])
  })

  it('proceeds normally when no status on error', () => {
    const err = { errors: { email: ['Invalid'] } }
    expect(extractFieldErrors(err, { statusCodes: [422] })).toEqual([
      { field: 'email', message: 'Invalid' },
    ])
  })

  it('checks response.status for Axios-style errors', () => {
    const err = { response: { status: 500, data: { errors: { email: ['Invalid'] } } } }
    expect(extractFieldErrors(err, { statusCodes: [422] })).toEqual([])
  })

  it('extracts from Axios-style 422 error', () => {
    const err = { response: { status: 422, data: { errors: { email: ['Invalid'] } } } }
    expect(extractFieldErrors(err, { statusCodes: [422] })).toEqual([
      { field: 'email', message: 'Invalid' },
    ])
  })
})

// ---------------------------------------------------------------------------
// RFC 9457 top-level detail
// ---------------------------------------------------------------------------

describe('extractFieldErrors — RFC 9457 detail', () => {
  it('extracts top-level detail as root error', () => {
    expect(extractFieldErrors({ title: 'Bad Request', detail: 'Email already taken', status: 422 })).toEqual([
      { field: 'root', message: 'Email already taken' },
    ])
  })

  it('works with only detail, no title', () => {
    expect(extractFieldErrors({ detail: 'Something went wrong' })).toEqual([
      { field: 'root', message: 'Something went wrong' },
    ])
  })

  it('uses custom fallbackField', () => {
    expect(extractFieldErrors({ detail: 'Invalid input' }, { fallbackField: 'form' })).toEqual([
      { field: 'form', message: 'Invalid input' },
    ])
  })

  it('applies transformField to fallback field name', () => {
    expect(
      extractFieldErrors({ detail: 'Error' }, { fallbackField: 'rootError', transformField: (f) => f.toLowerCase() }),
    ).toEqual([{ field: 'rooterror', message: 'Error' }])
  })

  it('does not fire when only title, no detail', () => {
    expect(extractFieldErrors({ title: 'Not Found' })).toEqual([])
  })

  it('field-specific errors take precedence over top-level detail', () => {
    // RFC 7807 errors map should be returned, not the detail
    const err = { errors: { email: ['Invalid'] }, detail: 'Validation failed' }
    expect(extractFieldErrors(err)).toEqual([{ field: 'email', message: 'Invalid' }])
  })
})
