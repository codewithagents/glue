# integration — cross-package test harness

Private package (`private: true`, never published). Verifies that `openapi-gen`, `openapi-react-query`, and `api-errors` work correctly together at runtime — things that TypeScript alone cannot catch.

---

## What it tests

71 tests across three files:

| File | Tests | What it covers |
|---|---|---|
| `integration.test.ts` | 19 | Generated client throws `ApiError` on non-2xx; `extractFieldErrors` and `mapApiErrors` consume it correctly |
| `client-runtime.test.ts` | 33 | HTTP method, path, query params, headers, body serialisation, response parsing — verified against MSW intercepts |
| `hooks-integration.test.ts` | 19 | Generated React Query hooks: `useListTasks`, `useGetTask`, `useCreateTask`, `useUpdateTask`, `useDeleteTask` — rendered with `renderHook` + `QueryClientProvider`, MSW-backed |

---

## Running it

```bash
pnpm test
```

Vitest runs all three test files. No server or database required — MSW intercepts all HTTP at the Node.js level.

---

## Regenerating generated output

`generated/` is committed so tests can import it directly without a build step. To regenerate after spec or generator changes:

```bash
pnpm generate        # runs openapi-gen
pnpm generate:hooks  # runs openapi-react-query
```

Build the upstream packages first:

```bash
pnpm --filter @codewithagents/openapi-gen build
pnpm --filter @codewithagents/openapi-react-query build
```

---

## Structure

```
spec/
  api.json                  Fictional Task Manager spec (OpenAPI 3.1)

generated/                  Committed sample output — do not edit manually
  models.ts, client.ts, client-config.ts, server.ts, index.ts, hooks.ts

src/
  __tests__/
    integration.test.ts     api-errors + generated client
    client-runtime.test.ts  HTTP behaviour via MSW
    hooks-integration.test.ts  React Query hooks via renderHook + MSW
  consumer-simulation.ts    Type-level import test (compiled, not run)
```
