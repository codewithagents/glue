# @codewithagents/openapi-gen

Generate TypeScript models and a native `fetch` client from an OpenAPI 3.1 spec.

- **Zero runtime footprint** — generated code uses only `fetch`. No axios, no wrapper libraries.
- **SSR-ready** — every generated function accepts a per-request config override. No global singleton mutation.
- **OpenAPI 3.1 only** — `type: ['string', 'null']`, `$ref`, `allOf`, `anyOf`, `oneOf`. No legacy compat.
- **TypeScript strict mode** — all output passes `strict: true`.

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

**3. Three files appear in `./src/api/`:**

| File | What it contains |
|---|---|
| `models.ts` | TypeScript types for every schema in `components.schemas` |
| `client-config.ts` | `configureClient()` — call once at startup to set your base URL and auth |
| `client.ts` | One `async function` per API operation, using native `fetch` |

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

## Config reference

`openapi-gen.config.json`:

```json
{
  "input_openapi": "./openapi.json",   // required — path to OpenAPI 3.1 spec (JSON or YAML)
  "output": "./src/api"                // required — directory for generated files
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

## Roadmap

- **Zod schemas** — optional `input_schema` field: bootstrap a Zod schema from your spec, then customise it. Generated client validates requests before they leave the browser.
- **`@codewithagents/openapi-gen-react-query`** — separate package generating React Query v5 `queryOptions` + `useMutation` hooks on top of the generated client.
