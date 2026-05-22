import { describe, expect, it, vi } from 'vitest'
import { extractFieldErrors, mapApiErrors } from './index.js'

// ---------------------------------------------------------------------------
// extractFieldErrors
// ---------------------------------------------------------------------------

describe('extractFieldErrors', () => {
  describe('RFC 7807 / Spring Boot 3+ format', () => {
    it('maps a single field with one message', () => {
      const error = { errors: { email: ['must not be blank'] } }
      expect(extractFieldErrors(error)).toEqual([
        { field: 'email', message: 'must not be blank' },
      ])
    })

    it('maps multiple fields', () => {
      const error = {
        errors: {
          email: ['must not be blank'],
          name: ['too short'],
        },
      }
      const result = extractFieldErrors(error)
      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ field: 'email', message: 'must not be blank' })
      expect(result).toContainEqual({ field: 'name', message: 'too short' })
    })

    it('expands multiple messages per field into separate FieldErrors', () => {
      const error = { errors: { email: ['must not be blank', 'invalid format'] } }
      expect(extractFieldErrors(error)).toEqual([
        { field: 'email', message: 'must not be blank' },
        { field: 'email', message: 'invalid format' },
      ])
    })
  })

  describe('Spring Boot default validation format (array)', () => {
    it('maps field + defaultMessage', () => {
      const error = {
        status: 400,
        errors: [{ field: 'email', defaultMessage: 'must not be blank' }],
      }
      expect(extractFieldErrors(error)).toEqual([
        { field: 'email', message: 'must not be blank' },
      ])
    })

    it('falls back to message when defaultMessage is absent', () => {
      const error = {
        errors: [{ field: 'email', message: 'must not be blank' }],
      }
      expect(extractFieldErrors(error)).toEqual([
        { field: 'email', message: 'must not be blank' },
      ])
    })

    it('maps multiple entries', () => {
      const error = {
        errors: [
          { field: 'email', defaultMessage: 'must not be blank' },
          { field: 'name', defaultMessage: 'too short' },
        ],
      }
      expect(extractFieldErrors(error)).toHaveLength(2)
    })
  })

  describe('flat object format', () => {
    it('maps { field, message } directly', () => {
      const error = { field: 'email', message: 'Invalid email' }
      expect(extractFieldErrors(error)).toEqual([
        { field: 'email', message: 'Invalid email' },
      ])
    })

    it('uses fallbackField when field is absent', () => {
      const error = { message: 'Something went wrong' }
      expect(extractFieldErrors(error, { fallbackField: 'root' })).toEqual([
        { field: 'root', message: 'Something went wrong' },
      ])
    })
  })

  describe('flat array format', () => {
    it('maps an array of { field, message } objects', () => {
      const error = [
        { field: 'email', message: 'Invalid' },
        { field: 'name', message: 'Required' },
      ]
      expect(extractFieldErrors(error)).toEqual([
        { field: 'email', message: 'Invalid' },
        { field: 'name', message: 'Required' },
      ])
    })

    it('skips entries without a message', () => {
      const error = [{ field: 'email' }, { field: 'name', message: 'Required' }]
      expect(extractFieldErrors(error)).toEqual([
        { field: 'name', message: 'Required' },
      ])
    })
  })

  describe('Axios-style response wrapper', () => {
    it('unwraps response.data before parsing', () => {
      const error = {
        response: {
          data: { errors: { email: ['must not be blank'] } },
        },
      }
      expect(extractFieldErrors(error)).toEqual([
        { field: 'email', message: 'must not be blank' },
      ])
    })
  })

  describe('unrecognized / unknown shapes', () => {
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

    it('never throws', () => {
      expect(() => extractFieldErrors({ deeply: { nested: { evil: true } } })).not.toThrow()
    })
  })

  describe('options', () => {
    it('uses fallbackField for errors without a field name', () => {
      const error = { message: 'Unauthorised' }
      const result = extractFieldErrors(error, { fallbackField: 'serverError' })
      expect(result).toEqual([{ field: 'serverError', message: 'Unauthorised' }])
    })

    it('applies transformField to every resolved field name', () => {
      const error = { errors: { emailAddress: ['invalid'] } }
      const result = extractFieldErrors(error, {
        transformField: (f) => f.replace(/([A-Z])/g, '.$1').toLowerCase(),
      })
      expect(result).toEqual([{ field: 'email.address', message: 'invalid' }])
    })
  })
})

// ---------------------------------------------------------------------------
// mapApiErrors
// ---------------------------------------------------------------------------

describe('mapApiErrors', () => {
  it('calls setError for each field error with type "server"', () => {
    const setError = vi.fn()
    const error = { errors: { email: ['must not be blank'], name: ['too short'] } }
    mapApiErrors(error, setError)
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
})
