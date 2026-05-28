# Petstore — Full-Stack Demo

A complete, runnable full-stack application that shows the entire `@codewithagents` OpenAPI toolchain working together. One spec file drives a typed fetch client, React Query hooks, a Hono API server with Zod request validation, and end-to-end Playwright tests — all from a single source of truth.

> **Not published to npm.** This is a reference implementation. Clone the monorepo and run it locally.

---

## What this demonstrates

| Layer | Technology | Generated from spec? |
|---|---|---|
| TypeScript types | `models.ts` | ✅ `@codewithagents/openapi-gen` |
| Fetch client | `client.ts` | ✅ `@codewithagents/openapi-gen` |
| React Query hooks | `hooks.ts` | ✅ `@codewithagents/openapi-react-query` |
| Server interface | `service.ts` | ✅ `@codewithagents/openapi-server` |
| Hono router + Zod validation | `router.ts` | ✅ `@codewithagents/openapi-server` |
| Zod schemas | `schemas.ts` | ⚠️ Bootstrapped once, then **yours to own** |
| Business logic | `src/server/petService.ts` | ❌ You write this |
| React UI | `src/client/App.tsx` | ❌ You write this |

**The key insight:** everything in `generated/` is disposable. Change `spec/api.json`, run `pnpm generate`, and the types, client, hooks, and router update automatically. Your business logic in `src/` is untouched because it implements a stable TypeScript interface.

---

## Quick start

**Prerequisites:** Node.js ≥ 22, pnpm ≥ 10

**1. Clone the monorepo and install dependencies:**

```bash
git clone https://github.com/codewithagents/glue.git
cd glue
pnpm install
```

**2. Build the generator packages:**

```bash
pnpm build
```

**3. Start the petstore in dev mode:**

```bash
cd packages/petstore
pnpm dev
```

This starts two servers concurrently:
- **Vite** on `http://localhost:5173` — React frontend with hot reload
- **Hono** on `http://localhost:3001` — API server (Vite proxies `/api` requests to it)

Open `http://localhost:5173` and you'll see a pet management UI. Add a pet, delete a pet — the full round-trip is live.

---

## The Zod validation story

This is the part that ties everything together. Open `generated/schemas.ts`:

```ts
// Bootstrapped by openapi-gen — this file is yours. Never overwritten.
import { z } from 'zod'

export const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: z.string(),
}).passthrough()

export const CreatePetRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
})
```

The `.min(1, ...)` rules are custom — they weren't in the spec. This is business logic you own.

Now look at the generated `router.ts`:

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

The router was regenerated (second pass) because `openapi-server.config.json` points at `input_schema: "generated/schemas.ts"`. The generator found `CreatePetRequestSchema`, wired it into the route, and now invalid requests return a structured `422` before they ever reach your service implementation.

**The full round-trip:**
```
Browser form submit
  → POST /api/pets { name: "", species: "Dog" }
  → Hono router → CreatePetRequestSchema.safeParse()
  → 422 { error: "Invalid request body", issues: [{ path: ["name"], message: "Name is required" }] }
  → React renders the error message next to the name field
```

---

## Regenerating from spec

When you change `spec/api.json`, regenerate all output files:

```bash
pnpm generate
```

This runs all three generators in order:
1. `openapi-gen` → `models.ts`, `client.ts`, `client-config.ts`, `index.ts`
2. `openapi-server` → `service.ts`, `router.ts` (with Zod validation wired in)
3. `openapi-react-query` → `hooks.ts`, `test-utils.ts`

**`generated/schemas.ts` is never overwritten.** It's bootstrapped on the very first run (if it doesn't exist), then left entirely to you. Add validation rules, refinements, and business logic freely.

---

## Running E2E tests

The Playwright suite covers the complete browser-to-server round-trip:

```bash
pnpm test:e2e
```

This builds the React app with Vite, starts the Hono server, and runs 5 Playwright tests in Chromium:

1. Shows an empty state on first load
2. Can add a pet and see it in the list
3. Can delete a pet
4. Can add multiple pets
5. Form clears after adding a pet

Each test resets server state via `DELETE /api/pets` before running — tests are fully isolated.

**These tests also run in CI** as a separate parallel job (`E2E (Petstore)`) alongside the standard `Build, Lint & Test` job.

---

## Using this as a template for your own project

The petstore is deliberately simple so the structure is easy to copy. Here's how to adapt it:

**1. Replace the spec:**

```bash
cp your-api.json spec/api.json
```

**2. Regenerate:**

```bash
pnpm generate
```

The generator will bootstrap a fresh `generated/schemas.ts` if it doesn't exist yet. All other generated files are overwritten.

**3. Implement the service interface:**

Open `generated/service.ts` — it now reflects your spec. Create a file that satisfies the interface:

```ts
// src/server/myService.ts
import type { YourApiService } from '../generated/service.js'

export const myService: YourApiService = {
  async listItems(params) { ... },
  async createItem(body) { ... },
}
```

TypeScript will tell you at compile time if your implementation drifts from the spec.

**4. Wire it up:**

```ts
// src/server/index.ts
import { createRouter } from '../generated/router.js'
import { myService } from './myService.js'

const apiRouter = createRouter(myService)
app.route('/api', apiRouter)
```

**5. Use the hooks in React:**

```tsx
import { useListItems, useCreateItem } from '../generated/hooks.js'

function ItemList() {
  const { data } = useListItems()
  const create = useCreateItem()
  ...
}
```

---

## File structure

```
spec/
  api.json                    OpenAPI 3.1 — single source of truth

generated/                    Auto-generated — safe to delete and re-run
  models.ts                   TypeScript types (Pet, CreatePetRequest)
  client.ts                   Typed fetch functions (zero runtime deps)
  client-config.ts            configureClient() — base URL + auth setup
  index.ts                    Barrel re-export
  service.ts                  PetstoreService interface
  router.ts                   createRouter(service) — Hono routes + Zod validation
  hooks.ts                    useListPets, useCreatePet, useDeletePet (React Query)
  test-utils.ts               MSW handlers for testing hooks
  schemas.ts                  ⚠️ User-owned — bootstrapped once, never overwritten

src/
  server/
    petService.ts             Implements PetstoreService (in-memory Map)
    index.ts                  Hono app — mounts router, serves React build
  client/
    App.tsx                   React UI — uses generated hooks

e2e/
  pets.spec.ts                Playwright tests (browser → Hono → Zod → React)

openapi-gen.config.json       Generator config (client-side files)
openapi-server.config.json    Generator config (server files + Zod validation)
openapi-react-query.config.json  Generator config (React Query hooks)
```

---

## Generator configs

**`openapi-gen.config.json`**
```json
{
  "input_openapi": "spec/api.json",
  "output": "generated/",
  "input_schema": "generated/schemas.ts"
}
```

**`openapi-server.config.json`**
```json
{
  "input_openapi": "spec/api.json",
  "output": "generated/",
  "framework": "hono",
  "input_schema": "generated/schemas.ts"
}
```

**`openapi-react-query.config.json`**
```json
{
  "input_openapi": "spec/api.json",
  "output": "generated/"
}
```

All three share the same spec and output directory. The `input_schema` points both `openapi-gen` and `openapi-server` at the same `schemas.ts`, so client-side and server-side validation use identical rules.
