import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { createRouter } from '../../generated/router.js'
import { petService, resetPets } from '../server/petService.js'

function buildApp() {
  const app = express()
  app.use(express.json())
  app.use('/api', createRouter(petService))
  return app
}

describe('petstore-express routes', () => {
  beforeEach(() => {
    resetPets()
  })

  it('POST /api/pets creates a pet and returns 201', async () => {
    const app = buildApp()
    const res = await request(app)
      .post('/api/pets')
      .send({ name: 'Fluffy', species: 'cat' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ name: 'Fluffy', species: 'cat' })
    expect(typeof res.body.id).toBe('string')
  })

  it('GET /api/pets returns list of pets', async () => {
    const app = buildApp()
    await request(app).post('/api/pets').send({ name: 'Rex', species: 'dog' })
    const res = await request(app).get('/api/pets')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toMatchObject({ name: 'Rex' })
  })

  it('GET /api/pets/:id returns the pet', async () => {
    const app = buildApp()
    const created = await request(app).post('/api/pets').send({ name: 'Whiskers', species: 'cat' })
    const { id } = created.body as { id: string }
    const res = await request(app).get(`/api/pets/${id}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id, name: 'Whiskers' })
  })

  it('DELETE /api/pets/:id returns 204', async () => {
    const app = buildApp()
    const created = await request(app).post('/api/pets').send({ name: 'Buddy', species: 'dog' })
    const { id } = created.body as { id: string }
    const res = await request(app).delete(`/api/pets/${id}`)
    expect(res.status).toBe(204)
  })

  it('GET /api/pets returns empty array initially', async () => {
    const app = buildApp()
    const res = await request(app).get('/api/pets')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})
