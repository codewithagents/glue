import Fastify from 'fastify'
import { createRouter } from '../../generated/router.js'
import { petService } from './petService.js'

const app = Fastify()

app.register(async (instance) => {
  createRouter(instance, petService)
}, { prefix: '/api' })

const PORT = Number(process.env.PORT ?? 3003)
app.listen({ port: PORT }, () => console.log(`petstore-fastify running on http://localhost:${PORT}`))
