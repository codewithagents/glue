# petstore — glue end-to-end showcase

A private demo package that proves the full glue toolchain works together. It is not published to npm. It takes a single OpenAPI 3.1 spec and runs all four generators to produce a working full-stack application: a Hono API server and a React Query-powered frontend, tested end-to-end with Playwright.

---

## Pipeline

```
spec/api.json
  ├── openapi-gen          → generated/models.ts, client.ts, client-config.ts, index.ts
  ├── openapi-server       → generated/service.ts, router.ts
  └── openapi-react-query  → generated/hooks.ts

You write:
  src/server/petService.ts   — implements PetstoreService (business logic only)
  src/server/index.ts        — mounts the router, serves the React app
  src/client/App.tsx         — uses the generated hooks
```

---

## Running it

**Regenerate from spec:**

```bash
pnpm generate
```

Runs `openapi-gen && openapi-server && openapi-react-query` in order. Overwrites everything in `generated/` except `zod.ts` (if present).

**Dev mode (Vite + Hono, with hot reload):**

```bash
pnpm dev
```

Starts both the Vite dev server (React) and the Hono API server (`tsx watch`) concurrently.

**Run Playwright E2E tests:**

```bash
pnpm test:e2e
```

Builds the React app with Vite, then runs the full Playwright suite against the Hono server.

---

## What the E2E tests verify

The five tests in `e2e/pets.spec.ts`:

1. Shows an empty state on first load
2. Can add a pet and see it appear in the list
3. Can delete a pet and see it disappear
4. Can add multiple pets (list grows correctly)
5. Form clears after a pet is added

Each test resets server state via `DELETE /api/pets` before running, so tests are fully isolated.

---

## Structure

```
spec/
  api.json                  OpenAPI 3.1 source of truth

generated/                  Auto-generated — do not edit manually
  models.ts                 TypeScript types (Pet, CreatePetRequest)
  client.ts                 Typed fetch client
  client-config.ts          Base URL + default fetch config
  index.ts                  Barrel re-export
  service.ts                PetstoreService interface
  router.ts                 createRouter(service) — Hono routes
  hooks.ts                  useListPets, useCreatePet, useDeletePet

src/
  server/
    petService.ts           Implements PetstoreService (in-memory Map store)
    index.ts                Hono app entry point — mounts router, serves static
  client/
    App.tsx                 React UI — uses generated hooks

e2e/
  pets.spec.ts              Playwright tests
```
