# @codewithagents

> TypeScript tooling for API consumers — zero runtime footprint.

Every package is a `devDependency` or a peer-dep-only tool. Nothing we ship adds bytes to a production bundle that weren't already there.

---

## Packages

| Package | Version | Description |
|---|---|---|
| [`@codewithagents/api-errors`](./packages/api-errors) | [![npm](https://img.shields.io/npm/v/@codewithagents/api-errors.svg)](https://npmjs.com/package/@codewithagents/api-errors) | Map API error responses to form field errors — framework-agnostic core + React Hook Form adapter |
| [`@codewithagents/openapi-gen`](./packages/openapi-gen) | [![npm](https://img.shields.io/npm/v/@codewithagents/openapi-gen.svg)](https://npmjs.com/package/@codewithagents/openapi-gen) | Generate TypeScript models + native `fetch` client + Zod schemas from an OpenAPI 3.1 spec |

---

## Quick start — `openapi-gen`

**1. Install as a dev dependency:**

```bash
pnpm add -D @codewithagents/openapi-gen
```

**2. Create `openapi-gen.config.json` in your project root:**

```json
{
  "input_openapi": "./openapi.json",
  "output": "./src/api"
}
```

**3. Run the generator:**

```bash
npx openapi-gen
```

Three files appear in `./src/api/`:

| File | What it contains |
|---|---|
| `models.ts` | TypeScript types for every schema in `components.schemas` |
| `client-config.ts` | `configureClient()` — call once at startup with your base URL and auth |
| `client.ts` | One typed `async function` per API operation, using native `fetch` |

**4. Use it:**

```ts
import { configureClient } from './src/api/client-config'
import { getTasks, createTask } from './src/api/client'

configureClient({ baseUrl: 'https://api.example.com', token: 'my-token' })

const tasks = await getTasks({ page: 1 })
const task  = await createTask({ title: 'Ship it', done: false })
```

See [packages/openapi-gen](./packages/openapi-gen) for the full docs.

---

## Quick start — `api-errors`

```ts
import { parseApiError } from '@codewithagents/api-errors'

try {
  await createTask(body)
} catch (err) {
  const { fieldErrors, globalError } = parseApiError(err)
  // fieldErrors: { title: ['must not be blank'] }
}
```

See [packages/api-errors](./packages/api-errors) for the full docs.

---

## Philosophy

- **Zero footprint** — every package is a `devDependency` or generates code that only depends on what your project already has.
- **Latest only** — TypeScript 6, OpenAPI 3.1, Zod v4. No legacy compatibility shims.
- **User owns the schema** — `schemas.ts` is bootstrapped once and never overwritten. Add your own validation rules, error messages, and business logic.
- **Readable output** — generated code looks like code you'd write yourself. No opaque abstractions.
- **Agent-friendly** — one dev dependency, one command, a fully-typed and validated API client.

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full plan, including `openapi-gen-react-query` (React Query v5 hooks) and `openapi-gen-server` (Fastify route definitions).

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Sponsors

This project is MIT-licensed and free to use. If it saves you time, consider sponsoring:

<!-- GitHub Sponsors button will appear here once configured -->

[![GitHub Sponsors](https://img.shields.io/github/sponsors/codewithagents?style=flat&logo=github)](https://github.com/sponsors/codewithagents)

---

## License

[MIT](./packages/openapi-gen/LICENSE) © codewithagents
