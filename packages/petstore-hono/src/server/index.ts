import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { createRouter } from '../../generated/router.js'
import { petService, resetPets } from './petService.js'

const app = new Hono()

// Dev-only reset endpoint — registered BEFORE apiRouter so it takes priority
if (process.env.NODE_ENV !== 'production') {
  app.delete('/api/pets', (c) => {
    resetPets()
    return new Response(null, { status: 204 })
  })
}

// API routes at /api
const apiRouter = createRouter(petService)
app.route('/api', apiRouter)

// Serve built React app for everything else
app.use('/*', serveStatic({ root: './dist' }))

const port = Number(process.env.PORT ?? 3001)
console.log(`Petstore server running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
