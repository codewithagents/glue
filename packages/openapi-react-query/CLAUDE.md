# openapi-react-query

Generate typed React Query v5 hooks from OpenAPI 3.x specs (3.1 primary target, 3.0.x best-effort).

## What it generates (`hooks.ts`)
- **Key factories** per primary resource: `all()`, `list(params)`, `detail(id)`
- **`useQuery` hooks** for GET operations
- **`useMutation` hooks** for POST/PUT/PATCH/DELETE
- Types fully derived from generated client — no duplication:
  - `Awaited<ReturnType<typeof fn>>` for data type
  - `Parameters<typeof fn>[N]` for variables type

## Dependencies
- **Runtime dep**: `@codewithagents/openapi-gen` (uses `parseSpec`)
- **Peer dep**: `@tanstack/react-query ^5`
- Build openapi-gen first: `pnpm --filter @codewithagents/openapi-gen build`

## Config
Default: `openapi-react-query.config.json` in CWD. Fields:
- `input_openapi` (required): path to OpenAPI 3.x spec
- `output` (required): directory to write generated files
- `stale_time?`: staleTime in ms for all useQuery hooks (default: 0)
- `gc_time?`: gcTime in ms for all useQuery hooks (default: 300000)
- `suspense?`: when true, generates `useSuspense*` variants alongside each `useQuery` hook (default: false)
- `overrides?`: per-resource cache timing overrides; key is resource name, value is `{ stale_time?, gc_time? }`
- `auto_invalidate?`: when true, mutation hooks auto-invalidate related resource queries on success (default: false)

`--config <path>` resolves relative paths from config file's directory (same pattern as openapi-gen).

## Key non-obvious decisions
- **Multiple detail ops → operation-name key segment** — when a resource has >1 GET with path params (e.g. `/items/{id}` and `/items/{id}/usage`), each key includes the operation name to prevent cache collisions: `['items', 'getItemById', id]` vs `['items', 'getItemUsage', id]`. Single detail ops keep the canonical `['resource', id]` shape.
- **`...options` spread before `onSuccess` in auto-invalidate hooks** — so the generated `onSuccess` (which calls `queryClient.invalidateQueries`) always wins; caller's `onSuccess` is composed inside via `options?.onSuccess?.(...args)`.

## Test / build
```
pnpm test    # vitest (47 tests)
pnpm build   # tsc + chmod +x dist/cli.js
```
