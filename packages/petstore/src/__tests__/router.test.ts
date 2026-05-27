import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter } from '../../generated/router.js'
import { petService, resetPets } from '../server/petService.js'

beforeEach(() => {
  resetPets()
})

const app = createRouter(petService)

describe('GET /pets', () => {
  it('returns 200 with empty array initially', async () => {
    const res = await app.request('/pets', { method: 'GET' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([])
  })
})

describe('POST /pets', () => {
  it('returns 201 with created pet including id', async () => {
    const res = await app.request('/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Luna', species: 'cat' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBeTruthy()
    expect(body.name).toBe('Luna')
    expect(body.species).toBe('cat')
  })

  it('returns 422 with error and issues when name is missing', async () => {
    const res = await app.request('/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ species: 'dog' }),
    })
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.error).toBe('Invalid request body')
    expect(Array.isArray(body.issues)).toBe(true)
    expect(body.issues.length).toBeGreaterThan(0)
  })
})

describe('GET /pets/:id', () => {
  it('returns 200 with the pet after creating', async () => {
    const createRes = await app.request('/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max', species: 'dog' }),
    })
    const created = await createRes.json()

    const res = await app.request(`/pets/${created.id}`, { method: 'GET' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(created.id)
    expect(body.name).toBe('Max')
  })
})

describe('DELETE /pets/:id', () => {
  it('returns 204 after deleting a pet', async () => {
    const createRes = await app.request('/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Rocky', species: 'dog' }),
    })
    const created = await createRes.json()

    const res = await app.request(`/pets/${created.id}`, { method: 'DELETE' })
    expect(res.status).toBe(204)
  })
})
