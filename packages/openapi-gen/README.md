# @codewithagents/openapi-gen

[![npm](https://img.shields.io/npm/v/@codewithagents/openapi-gen.svg)](https://npmjs.com/package/@codewithagents/openapi-gen)
[![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=openapi-gen)](https://codecov.io/gh/codewithagents/glue)

Generate TypeScript models and a native `fetch` client from an OpenAPI 3.1 spec.

- **Zero runtime footprint** — generated code uses only `fetch`. No axios, no wrapper libraries.
- **Prettier-clean output** — every generated file passes `prettier --check` out of the box. Commit it, lint it, ship it.
- **SSR-ready** — every generated function accepts a per-request config override. No global singleton mutation.
- **OpenAPI 3.1 only** — `type: ['string', 'null']`, `$ref`, `allOf`, `anyOf`, `oneOf`. No legacy compat.
- **TypeScript strict mode** — all output passes `strict: true`.
- **Tested against 128 real-world specs** — Stripe, GitHub, Spotify, OpenAI, Adyen, Twilio, Slack, Vercel, and more. See the [`examples/`](../../examples/) directory.

---

## Install

```bash
pnpm add -D @codewithagents/openapi-gen
# or
npm install -D @codewithagents/openapi-gen
```

---

## Quick start

**1. Create `openapi-gen.config.json` in your project root:**

```json
{
  "input_openapi": "./openapi.json",
  "output": "./src/api"
}
```

**2. Run the generator:**

```bash
npx openapi-gen
```

**3. Files appear in `./src/api/`:**

| File | What it contains |
|---|---|
| `models.ts` | TypeScript types for every schema in `components.schemas` |
| `client-config.ts` | `configureClient()` — call once at startup to set your base URL and auth |
| `client.ts` | One `async function` per API operation, using native `fetch` |
| `server.ts` *(optional)* | `createServerClient()` factory — generated when `server_client: true` |

---

## Generated output

Given an OpenAPI spec with a `Task` schema and a `GET /tasks` endpoint, you get:

**`models.ts`**
```typescript
export interface Task {
  id: string
  title: string
  done?: boolean
}
```

**`client-config.ts`**
```typescript
export interface ClientConfig {
  baseUrl: string
  token?: string | (() => string | Promise<string>)
  credentials?: RequestCredentials
  headers?: Record<string, string>
}

export function configureClient(config: ClientConfig): void { ... }
export function getConfig(): Readonly<ClientConfig> { ... }
```

**`client.ts`**
```typescript
export async function getTasks(
  params?: { page?: number; status?: string },
  config?: Partial<ClientConfig>      // optional SSR override
): Promise<Task[]> { ... }
```

---

## Auth configuration

### Bearer token (OAuth / JWT)

```typescript
// Startup (e.g. main.ts or App.tsx)
import { configureClient } from './src/api/client-config'

configureClient({
  baseUrl: 'https://api.example.com',
  token: () => getAccessToken(),   // sync or async — called per request
  credentials: 'omit',
})
```

### Cookie-based auth

```typescript
configureClient({
  baseUrl: 'https://api.example.com',
  credentials: 'include',           // sends HttpOnly cookies automatically
})
```

---

## SSR support (Next.js, Remix, RSC)

Every generated function accepts an optional `config` override as its last parameter. This merges with the global config for that single call — no singleton mutation, safe for concurrent server requests.

```typescript
// app/tasks/page.tsx (Next.js Server Component)
import { getTasks } from '@/api/client'
import { getServerSession } from 'next-auth'

export default async function TasksPage() {
  const session = await getServerSession()

  const tasks = await getTasks(undefined, {
    baseUrl: process.env.API_URL,        // absolute URL required on server
    token: session.accessToken,
    credentials: 'omit',
  })

  return <TaskList tasks={tasks} />
}
```

```typescript
// Client component — uses global config set at startup, no override needed
const tasks = await getTasks({ page: 1 })
```

---

## Next.js RSC — server client factory

When `server_client: true` in config, the generator also writes `server.ts` alongside the other files. It exports `createServerClient()` — a factory that pre-binds a per-request `ClientConfig` to every function:

```ts
// Generated: src/api/server.ts
export function createServerClient(config: Partial<ClientConfig>) {
  return {
    listTasks: (...args) => listTasks(...args, config),
    getTask: (...args) => getTask(...args, config),
    createTask: (...args) => createTask(...args, config),
    // ... all functions
  }
}
```

Usage in a Next.js Server Component:

```ts
// app/tasks/page.tsx
import { createServerClient } from '@/api/server'

async function getServerConfig(): Promise<Partial<ClientConfig>> {
  const session = await getServerSession()
  return { baseUrl: process.env.API_URL, token: session.accessToken }
}

export default async function TasksPage() {
  const api = createServerClient(await getServerConfig())

  const tasks = await api.listTasks()
  const featured = await api.getTask('featured-id')

  return <TaskList tasks={tasks} featured={featured} />
}
```

Without this, you'd pass config to every call manually. With it, bind once per request, call freely.

---

## Config reference

`openapi-gen.config.json`:

```json
{
  "input_openapi": "./openapi.json",   // required
  "output": "./src/api",               // required
  "input_schema": "./src/api/zod.ts",  // optional — Zod bootstrap (write-once)
  "baseUrl": "https://api.example.com", // optional — sets default base URL in generated client-config
  "server_client": false               // optional — generate server.ts factory (default: false)
}
```

---

## Error handling

Generated functions throw `ApiError` for non-2xx responses:

```typescript
import { ApiError } from './src/api/client'

try {
  const task = await getTaskById('123')
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.status, err.body)
  }
}
```

---

## Zod validation (`input_schema`)

Point `input_schema` at a user-owned Zod schema file and the generator upgrades its output:

**1. Bootstrap once** — if the file doesn't exist yet, `openapi-gen` writes a `schemas.ts` for you:

```ts
// generated/schemas.ts  (bootstrapped, then yours to edit)
import { z } from 'zod'

export const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
}).passthrough()   // forward-compatible: new optional server fields are preserved

export const CreatePetRequestSchema = z.object({
  name: z.string(),
})
```

**2. Add your rules** — refine freely. The file is never overwritten:

```ts
export const CreatePetRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.enum(['cat', 'dog', 'fish']),
})
```

**3. Re-run the generator** — `models.ts` switches to `z.infer<>` types, `client.ts` adds runtime validation:

```ts
// models.ts (regenerated)
import type { z } from 'zod'
import type { PetSchema, CreatePetRequestSchema } from './schemas.js'
export type Pet = z.infer<typeof PetSchema>
export type CreatePetRequest = z.infer<typeof CreatePetRequestSchema>
```

```ts
// client.ts (regenerated) — pre-send and post-receive validation
export async function createPet(body: CreatePetRequest): Promise<Pet> {
  const validatedBody = CreatePetRequestSchema.strip().parse(body)  // strips UI-only fields
  const res = await fetch(...)
  return PetSchema.parse(await res.json())                          // throws ZodError on bad response
}
```

**Form wizard pattern** — extend API schemas for UI-only fields without leaking them to the backend:

```ts
// Your form schema — adds step + confirmTerms on top of the API schema
export const CreatePetFormSchema = CreatePetRequestSchema.extend({
  step: z.number(),
  confirmTerms: z.boolean(),
})
// Use CreatePetFormSchema for React Hook Form validation.
// The generated client calls .strip().parse() before sending, so step and confirmTerms never reach the API.
```

**Drift detection** — if you add a schema to `schemas.ts` that has no matching component in the spec (or vice versa), the generator warns to stderr. Your build still succeeds — the warning is advisory.

---

## Ecosystem

These packages work together — all driven from the same OpenAPI 3.1 spec:

| Package | What it generates |
|---|---|
| **`@codewithagents/openapi-gen`** | TypeScript models + native fetch client + Zod schemas |
| [`@codewithagents/openapi-react-query`](https://www.npmjs.com/package/@codewithagents/openapi-react-query) | React Query v5 hooks (`useQuery`, `useMutation`, key factories) |
| [`@codewithagents/openapi-server`](https://www.npmjs.com/package/@codewithagents/openapi-server) | Hono router + typed service interface |
| [`@codewithagents/api-errors`](https://www.npmjs.com/package/@codewithagents/api-errors) | Maps API error responses to form field errors |

See the [petstore demo](https://github.com/codewithagents/glue/tree/main/packages/petstore) for a full-stack example using all four packages together.
