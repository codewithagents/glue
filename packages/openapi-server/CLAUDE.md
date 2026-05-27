# openapi-server

Generate a typed server-side service interface and a Hono router from an OpenAPI 3.1 spec.

## Generates

| File | Description |
|---|---|
| `service.ts` | TypeScript interface — one method per operation; implement this to wire your business logic |
| `router.ts` | Hono router (`createRouter(service)`) — routes + optional Zod validation |

## Two-pass generation (schema-enhanced mode)

When `input_schema` is set in config:

1. **First pass** — generates `service.ts` + `router.ts` (no Zod validation)
2. **Second pass** — re-generates `router.ts` with `safeParse` calls using the schemas from `input_schema`; returns `422 { error, issues }` on validation failure

`input_schema` is **never overwritten** — the user owns it.

## Config

Default: `openapi-server.config.json` in CWD. Fields: `input_openapi`, `output`, `framework?` (`"hono"` | `"none"`), `input_schema?`.

## Key non-obvious decisions

- **`--external:prettier` in esbuild** — Prettier is ESM-only; dynamic `await import('prettier')` + external flag keeps the CJS CLI bundle small (~700 KB) and avoids a `createRequire(undefined)` crash
- **`createRouter(service)`** — router is a factory, not a singleton; makes it trivially testable with `app.request()` in vitest without starting a server
- **Zod validation is opt-in** — no `input_schema` → router is plain Hono with no Zod dep in generated output; zero footprint for consumers who don't want validation
- **Schema names matched by convention** — `${PascalCasedOperationBodyType}Schema` must exist in `input_schema`; unmatched schemas trigger a `console.warn` drift warning

## Test / build

```
pnpm test    # vitest
pnpm build   # tsc + esbuild CJS CLI
```
