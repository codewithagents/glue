import { describe, it, expect, beforeEach } from 'vitest'
import Fastify from 'fastify'
import { createRouter } from '../../generated/router.js'
import { petService, resetPets } from '../server/petService.js'

function buildApp() {
  const app = Fastify()
  app.register(async (instance) => {
    createRouter(instance, petService)
  }, { prefix: '/api' })
  return app
}

describe('petstore-fastify routes', () => {
  beforeEach(() => {
    resetPets()
  })

  it('POST /api/pets creates a pet and returns 201', async () => {
    const app = buildApp()
    const res = await app.inject({
      method: 'POST',
      url: '/api/pets',
      payload: { name: 'Fluffy', species: 'cat' },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json<{ id: string; name: string; species: string }>()
    expect(body).toMatchObject({ name: 'Fluffy', species: 'cat' })
    expect(typeof body.id).toBe('string')
  })

  it('GET /api/pets returns list of pets', async () => {
    const app = buildApp()
    await app.inject({
      method: 'POST',
      url: '/api/pets',
      payload: { name: 'Rex', species: 'dog' },
    })
    const res = await app.inject({ method: 'GET', url: '/api/pets' })
    expect(res.statusCode).toBe(200)
    const body = res.json<Array<{ name: string }>>()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(1)
    expect(body[0]).toMatchObject({ name: 'Rex' })
  })

  it('GET /api/pets/:id returns the pet', async () => {
    const app = buildApp()
    const created = await app.inject({
      method: 'POST',
      url: '/api/pets',
      payload: { name: 'Whiskers', species: 'cat' },
    })
    const { id } = created.json<{ id: string }>()
    const res = await app.inject({ method: 'GET', url: `/api/pets/${id}` })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ id, name: 'Whiskers' })
  })

  it('DELETE /api/pets/:id returns 204', async () => {
    const app = buildApp()
    const created = await app.inject({
      method: 'POST',
      url: '/api/pets',
      payload: { name: 'Buddy', species: 'dog' },
    })
    const { id } = created.json<{ id: string }>()
    const res = await app.inject({ method: 'DELETE', url: `/api/pets/${id}` })
    expect(res.statusCode).toBe(204)
  })

  it('GET /api/pets returns empty array initially', async () => {
    const app = buildApp()
    const res = await app.inject({ method: 'GET', url: '/api/pets' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual([])
  })
})
