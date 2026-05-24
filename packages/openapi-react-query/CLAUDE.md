# openapi-react-query

Generate typed React Query v5 hooks from OpenAPI 3.1 specs.

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
Default: `openapi-react-query.config.json` in CWD. Fields: `input_openapi`, `output`, `stale_time?`, `gc_time?`.
`--config <path>` resolves relative paths from config file's directory (same pattern as openapi-gen).

## Test / build
```
pnpm test    # vitest (47 tests)
pnpm build   # tsc + chmod +x dist/cli.js
```
