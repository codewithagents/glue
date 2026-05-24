# api-errors

Map backend API errors to form field errors. Zero runtime dependencies.

## What it does
- Parses RFC 9457 Problem Details + custom error shapes from HTTP responses
- Maps `violations[].field` paths to form field names
- React Hook Form adapter in `src/adapters/react-hook-form.ts`

## Key decisions
- **Body unwrapping**: detects `{ status, body }` shape (ApiError from generated client) — unwraps before parsing
- **`statusCodes` option**: caller can filter which HTTP status codes trigger error mapping
- **`tryParseRfc9457Detail`**: last-resort fallback — parses top-level `detail` string as error message
- No runtime deps — pure TypeScript, framework-agnostic core

## Test / build
```
pnpm test    # vitest run (57 tests)
pnpm build   # tsc
```
