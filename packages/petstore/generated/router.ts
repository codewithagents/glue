// This file is auto-generated. Do not edit manually.

import { Hono } from 'hono'
import type { CreatePetRequest } from './models.js'
import type { PetstoreService } from './service.js'

export function createRouter(service: PetstoreService): Hono {
  const app = new Hono()

  app.get('/pets', async (c) => {
    const params = {
    species: c.req.query('species') ?? undefined
    }
    return c.json(await service.listPets(params))
  })

  app.post('/pets', async (c) => {
    const body = await c.req.json<CreatePetRequest>()
    return c.json(await service.createPet(body), 201)
  })

  app.get('/pets/:id', async (c) => {
    return c.json(await service.getPet(c.req.param('id')))
  })

  app.delete('/pets/:id', async (c) => {
    await service.deletePet(c.req.param('id'))
    return new Response(null, { status: 204 })
  })

  return app
}
