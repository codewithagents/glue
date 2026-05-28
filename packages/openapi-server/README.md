# @codewithagents/openapi-server

[![npm](https://img.shields.io/npm/v/@codewithagents/openapi-server.svg)](https://npmjs.com/package/@codewithagents/openapi-server)
[![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=openapi-server)](https://codecov.io/gh/codewithagents/glue)

Generate a typed server-side service interface and a [Hono](https://hono.dev) router from an OpenAPI 3.1 spec.

- **Type-safe contract** — a TypeScript interface derived directly from your spec. The compiler tells you if your implementation drifts.
- **Prettier-clean output** — every generated file passes `prettier --check` out of the box. Commit it, lint it, ship it.
- **Zero boilerplate routing** — a ready-to-mount Hono router that extracts path params, query params, and request bodies, then delegates to your service.
- **OpenAPI 3.1 only** — `$ref`, `allOf`, `anyOf`, `oneOf`, `type: ['string', 'null']`. No legacy compat.
- **TypeScript strict mode** — all output passes `strict: true`.

---

## Install

```bash
pnpm add -D @codewithagents/openapi-server
# or
npm install -D @codewithagents/openapi-server
```

Requires [`@codewithagents/openapi-gen`](../openapi-gen) — run both generators together.

---

## Quick start

**1. Create `openapi-server.config.json` in your project root:**

```json
{
  "input_openapi": "./spec/api.json",
  "output": "./generated",
  "framework": "hono"
}
```

**2. Run the generator:**

```bash
npx openapi-server
```

**3. Files appear in `./generated/`:**

| File | What it contains |
|---|---|
| `service.ts` | TypeScript interface — one method per API operation |
| `router.ts` | `createRouter(service)` factory — mounts every route on a Hono app |

Run `openapi-gen` first (or together) so `models.ts` exists before `service.ts` imports from it:

```bash
npx openapi-gen && npx openapi-server
```

Or add to `package.json`:

```json
{
  "scripts": {
    "generate": "openapi-gen && openapi-server"
  }
}
```

---

## Generated output

Given the petstore spec (`GET /pets`, `POST /pets`, `GET /pets/{id}`, `DELETE /pets/{id}`):

**`generated/service.ts`**

```ts
// This file is auto-generated. Do not edit manually.

import type { CreatePetRequest, Pet } from './models.js'

export interface PetstoreService {
  /** GET /pets */
  listPets(params?: { species?: string }): Promise<Pet[]>
  /** POST /pets */
  createPet(body: CreatePetRequest): Promise<Pet>
  /** GET /pets/{id} */
  getPet(id: string): Promise<Pet>
  /** DELETE /pets/{id} */
  deletePet(id: string): Promise<void>
}
```

**`generated/router.ts`**

```ts
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
```

The router handles:
- Path params: `{id}` → `:id` (Hono style), extracted via `c.req.param()`
- Query params: extracted and typed (`string`, `number`, `boolean`)
- Request bodies: parsed via `c.req.json<T>()` with the correct model type
- Response status: `200` for GET, `201` for POST, `204` for DELETE — derived from your spec

---

## Implementing the service

Create a file that satisfies the generated interface. The compiler enforces the contract:

```ts
// src/server/petService.ts
import { randomUUID } from 'node:crypto'
import type { PetstoreService } from '../generated/service.js'
import type { Pet } from '../generated/models.js'

const pets = new Map<string, Pet>()

export const petService: PetstoreService = {
  async listPets(params) {
    const all = Array.from(pets.values())
    if (params?.species) {
      return all.filter(p => p.species.toLowerCase() === params.species!.toLowerCase())
    }
    return all
  },
  async createPet(body) {
    const pet: Pet = { id: randomUUID(), ...body }
    pets.set(pet.id, pet)
    return pet
  },
  async getPet(id) {
    const pet = pets.get(id)
    if (!pet) throw new Error(`Pet ${id} not found`)
    return pet
  },
  async deletePet(id) {
    pets.delete(id)
  },
}
```

The interface is re-generated every time the spec changes. If you add an endpoint in the spec and forget to implement it, TypeScript will tell you at compile time.

---

## Wiring it up

Mount the generated router on a Hono app and serve it:

```ts
// src/server/index.ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createRouter } from '../generated/router.js'
import { petService } from './petService.js'

const app = new Hono()

// Mount API routes at /api
const apiRouter = createRouter(petService)
app.route('/api', apiRouter)

serve({ fetch: app.fetch, port: 3001 })
```

`createRouter` returns a plain `Hono` instance. You can mount it at any path prefix, add middleware before or after, or nest it inside a larger app.

---

## Config reference

`openapi-server.config.json`:

```json
{
  "input_openapi": "./spec/api.json",       // required — path to OpenAPI 3.1 spec (JSON or YAML)
  "output": "./generated",                  // required — directory to write generated files
  "framework": "hono",                      // optional — router target (default: "hono")
  "input_schema": "./generated/schemas.ts"  // optional — Zod schema file for request validation
}
```

| Field | Required | Default | Description |
|---|---|---|---|
| `input_openapi` | Yes | — | Path to OpenAPI 3.1 spec (JSON or YAML) |
| `output` | Yes | — | Directory to write `service.ts` and `router.ts` |
| `framework` | No | `"hono"` | Router framework to generate. Use `"none"` to generate only `service.ts` |
| `input_schema` | No | — | Path to user-owned Zod schema file. Enables server-side request validation (see below) |

Use `--config <path>` to point at a config file in a different location:

```bash
npx openapi-server --config ./config/openapi-server.config.json
```

Relative paths in the config resolve from the config file's directory.

---

## Zod request validation (`input_schema`)

Point `input_schema` at the same `schemas.ts` you use with `@codewithagents/openapi-gen`. The server generator adds runtime validation to every route that receives a request body:

**Config:**

```json
{
  "input_openapi": "./spec/api.json",
  "output": "./generated",
  "framework": "hono",
  "input_schema": "./generated/schemas.ts"
}
```

**Generated router with validation:**

```ts
app.post('/pets', async (c) => {
  const body = await c.req.json()
  const parseResult = CreatePetRequestSchema.safeParse(body)
  if (!parseResult.success) {
    return c.json({ error: 'Invalid request body', issues: parseResult.error.issues }, 422)
  }
  return c.json(await service.createPet(parseResult.data), 201)
})
```

Invalid requests get a structured `422` response instead of reaching your service implementation:

```json
{
  "error": "Invalid request body",
  "issues": [
    { "code": "too_small", "path": ["name"], "message": "Name is required" }
  ]
}
```

**Same schemas, both sides of the wire** — `openapi-gen` validates outgoing requests in the browser; `openapi-server` validates incoming requests on the server. One `schemas.ts`, one source of truth.

**Drift detection** — if schemas diverge from the spec (extra schema, missing schema), the generator warns to stderr. Builds still succeed — the warning is advisory.

---

## Frameworks

| Framework | Status |
|---|---|
| [Hono](https://hono.dev) | Supported |
| Express | Planned |
| Fastify | Planned |

Set `"framework": "none"` to generate only the service interface without a router — useful if you want to wire up your own routing layer.
