/**
 * Integration tests: @codewithagents/openapi-gen + @codewithagents/api-errors
 *
 * These tests prove that:
 *  1. The generated client (from openapi-gen) throws ApiError on non-2xx responses
 *  2. extractFieldErrors (from api-errors) can consume that ApiError directly
 *
 * They serve double duty as living sample code showing the recommended pattern
 * for handling validation errors from a generated TypeScript client.
 */

import * as hooks from '../../generated/hooks.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { extractFieldErrors, mapApiErrors } from '@codewithagents/api-errors'
import {
  ApiError,
  createTask,
  deleteTask,
  getTask,
  updateTask,
  uploadTaskAttachment,
} from '../../generated/client.js'
import { configureClient } from '../../generated/client-config.js'

// ---------------------------------------------------------------------------
// Setup: point the client at a fake base URL and mock global fetch
// ---------------------------------------------------------------------------

beforeEach(() => {
  configureClient({ baseUrl: 'https://api.example.com' })
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockFetch(status: number, body: unknown): void {
  vi.mocked(fetch).mockResolvedValue(
    new Response(body !== null ? JSON.stringify(body) : null, {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

// ---------------------------------------------------------------------------
// Happy-path sanity checks
// ---------------------------------------------------------------------------

describe('generated client — success responses', () => {
  it('createTask returns the created task on 200', async () => {
    const task = {
      id: '1',
      title: 'Write tests',
      status: 'pending',
      createdAt: '2026-01-01T00:00:00Z',
    }
    mockFetch(200, task)

    const result = await createTask({ title: 'Write tests' })
    expect(result).toEqual(task)
  })

  it('getTask returns the task on 200', async () => {
    const task = { id: '42', title: 'Ship it', status: 'done', createdAt: '2026-01-02T00:00:00Z' }
    mockFetch(200, task)

    const result = await getTask('42')
    expect(result).toEqual(task)
  })

  it('deleteTask resolves without a value on 204', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }))
    await expect(deleteTask('1')).resolves.toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Error path: ApiError thrown by generated client
// ---------------------------------------------------------------------------

describe('generated client — ApiError on non-2xx', () => {
  it('createTask throws ApiError with status 422 and parsed body', async () => {
    const errorBody = {
      title: 'Unprocessable Entity',
      status: 422,
      errors: { title: ['must not be blank'], assigneeEmail: ['invalid email format'] },
    }
    mockFetch(422, errorBody)

    await expect(createTask({ title: '' })).rejects.toMatchObject({
      status: 422,
      body: errorBody,
    })
  })

  it('getTask throws ApiError with status 404 and RFC 9457 detail', async () => {
    const errorBody = {
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Task not found',
    }
    mockFetch(404, errorBody)

    await expect(getTask('999')).rejects.toMatchObject({
      status: 404,
      body: errorBody,
    })
  })

  it('thrown error is instanceof ApiError', async () => {
    mockFetch(500, { title: 'Internal Server Error' })

    try {
      await createTask({ title: 'x' })
      expect.fail('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
    }
  })
})

// ---------------------------------------------------------------------------
// Integration: ApiError → extractFieldErrors (the key cross-package flow)
// ---------------------------------------------------------------------------

describe('ApiError → extractFieldErrors', () => {
  it('extracts RFC 7807 field errors from a 422 ApiError', async () => {
    mockFetch(422, {
      title: 'Unprocessable Entity',
      status: 422,
      errors: {
        title: ['must not be blank'],
        assigneeEmail: ['must be a valid email address'],
      },
    })

    try {
      await createTask({ title: '' })
    } catch (err) {
      const fieldErrors = extractFieldErrors(err, { statusCodes: [422] })
      expect(fieldErrors).toHaveLength(2)
      expect(fieldErrors).toContainEqual({ field: 'title', message: 'must not be blank' })
      expect(fieldErrors).toContainEqual({
        field: 'assigneeEmail',
        message: 'must be a valid email address',
      })
    }
  })

  it('extracts RFC 9457 detail from a 404 ApiError as root error', async () => {
    mockFetch(404, {
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Task with id 999 was not found',
    })

    try {
      await getTask('999')
    } catch (err) {
      const fieldErrors = extractFieldErrors(err, { statusCodes: [404] })
      expect(fieldErrors).toEqual([{ field: 'root', message: 'Task with id 999 was not found' }])
    }
  })

  it('statusCodes filter blocks 404 errors when only 422 is expected', async () => {
    mockFetch(404, { type: 'about:blank', title: 'Not Found', status: 404, detail: 'Not found' })

    try {
      await getTask('999')
    } catch (err) {
      const fieldErrors = extractFieldErrors(err, { statusCodes: [422] })
      expect(fieldErrors).toEqual([])
    }
  })

  it('statusCodes filter passes 422 and blocks 500', async () => {
    // 422 path
    mockFetch(422, { errors: { name: ['required'] } })
    try {
      await createTask({ title: '' })
    } catch (err422) {
      expect(extractFieldErrors(err422, { statusCodes: [422] })).toEqual([
        { field: 'name', message: 'required' },
      ])
    }

    // 500 path
    mockFetch(500, { title: 'Server Error' })
    try {
      await updateTask('1', { title: 'x' })
    } catch (err500) {
      expect(extractFieldErrors(err500, { statusCodes: [422] })).toEqual([])
    }
  })

  it('applies transformField to map camelCase backend fields to nested form paths', async () => {
    mockFetch(422, {
      errors: { assigneeEmail: ['invalid'] },
    })

    try {
      await createTask({ title: 'x' })
    } catch (err) {
      // "assigneeEmail" → "assignee.email" for React Hook Form nested field
      const fieldErrors = extractFieldErrors(err, {
        statusCodes: [422],
        transformField: (f) => f.replace(/([A-Z])/g, '.$1').toLowerCase(),
      })
      expect(fieldErrors).toEqual([{ field: 'assignee.email', message: 'invalid' }])
    }
  })
})

// ---------------------------------------------------------------------------
// Integration: ApiError → mapApiErrors (React Hook Form adapter)
// ---------------------------------------------------------------------------

describe('ApiError → mapApiErrors (React Hook Form adapter)', () => {
  it('calls setError for each field from a 422 ApiError', async () => {
    mockFetch(422, {
      errors: { title: ['must not be blank'], assigneeEmail: ['invalid email'] },
    })

    const setError = vi.fn()
    try {
      await createTask({ title: '' })
    } catch (err) {
      mapApiErrors(err, setError, { statusCodes: [422] })
    }

    expect(setError).toHaveBeenCalledTimes(2)
    expect(setError).toHaveBeenCalledWith('title', { type: 'server', message: 'must not be blank' })
    expect(setError).toHaveBeenCalledWith('assigneeEmail', {
      type: 'server',
      message: 'invalid email',
    })
  })

  it('does not call setError on 404 when statusCodes restricts to [422]', async () => {
    mockFetch(404, { title: 'Not Found', status: 404, detail: 'Task not found' })

    const setError = vi.fn()
    try {
      await getTask('999')
    } catch (err) {
      mapApiErrors(err, setError, { statusCodes: [422] })
    }

    expect(setError).not.toHaveBeenCalled()
  })

  it('calls onError hook and still lets caller catch ApiError', async () => {
    const onError = vi.fn()
    mockFetch(422, { errors: { title: ['required'] } })

    let caughtError: unknown
    try {
      await createTask({ title: '' }, { onError })
    } catch (err) {
      caughtError = err
    }

    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }))
    expect(caughtError).toBeInstanceOf(ApiError)
  })
})

// ---------------------------------------------------------------------------
// Multipart upload: generated client sends FormData body
// ---------------------------------------------------------------------------

describe('multipart upload — uploadTaskAttachment', () => {
  it('uploadTaskAttachment sends FormData body', async () => {
    mockFetch(200, { id: '1', title: 'x', status: 'pending', createdAt: '2026-01-01T00:00:00Z' })
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    await uploadTaskAttachment({ file, label: 'my attachment' })
    const [, init] = vi.mocked(fetch).mock.calls[0]!
    expect(init?.body).toBeInstanceOf(FormData)
  })

  it('uploadTaskAttachment returns the task on success', async () => {
    const task = {
      id: '1',
      title: 'Upload task',
      status: 'pending',
      createdAt: '2026-01-01T00:00:00Z',
    }
    mockFetch(200, task)
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const result = await uploadTaskAttachment({ file })
    expect(result).toEqual(task)
  })
})

// ---------------------------------------------------------------------------
// Generated hooks: module-level shape checks
// ---------------------------------------------------------------------------

describe('generated hooks', () => {
  it('exports useListTasks', () => expect(typeof hooks.useListTasks).toBe('function'))
  it('exports useCreateTask', () => expect(typeof hooks.useCreateTask).toBe('function'))
  it('exports taskKeys', () => {
    expect(Array.isArray(hooks.taskKeys.all())).toBe(true)
    expect(hooks.taskKeys.all()[0]).toBe('tasks')
  })
})
