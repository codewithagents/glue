# petstore

Full-stack demo and e2e test harness for the `@codewithagents` OpenAPI toolchain. Uses all three generators together with a shared user-owned Zod schema.

## Purpose

- **Demo**: shows a real production-shaped project built on top of the generated code
- **E2E validation**: Playwright tests cover the full round-trip — browser form → Hono server → Zod validation → 422/201 response → React UI update

Not published to npm (`private: true`). No unit tests — integration-level testing lives in `packages/integration/`.

## Generators used

| Config | Generates |
|---|---|
| `openapi-gen.config.json` | `models.ts`, `client.ts`, `client-config.ts`, `index.ts` |
| `openapi-server.config.json` | `service.ts`, `router.ts` (Hono + Zod validation) |
| `openapi-react-query.config.json` | `hooks.ts`, `test-utils.ts` |

All three share `spec/api.json` and `generated/schemas.ts`.

## `generated/schemas.ts` — user-owned

Written by hand with real business rules (`.min(1, 'Name is required')`). Generators never overwrite it. Regenerating `generated/` is safe.

## Dev / generate / test

```bash
pnpm run generate     # re-run all three generators (does NOT touch schemas.ts)
pnpm run dev          # Vite + Hono server in watch mode (concurrently)
pnpm run test:e2e     # vite build → playwright test (Chromium)
```

## CI

The `e2e` job in `.github/workflows/ci.yml` runs `test:e2e` in parallel with `Build, Lint & Test`. Requires `npx playwright install --with-deps chromium` before running.
