# api-errors

Map backend API errors to form field errors. Zero runtime dependencies.

## What it does
- Parses RFC 9457 / RFC 7807 Problem Details + custom error shapes from HTTP responses
- Maps field paths from supported error formats to normalized `{ field, message }` pairs
- React Hook Form adapter (`mapApiErrors`) lives in `src/index.ts` alongside the core `extractFieldErrors` export

## Supported error formats
- RFC 7807 / RFC 9457 `errors` map: `{ "errors": { "email": ["must not be blank"] } }`
- Spring Boot array format: `{ "errors": [{ "field": "email", "defaultMessage": "..." }] }`
- Flat object: `{ "field": "email", "message": "..." }`
- Array of flat objects: `[{ "field": "email", "message": "..." }]`
- RFC 9457 top-level `detail` string (last-resort fallback)

## Exports (`src/index.ts`)
- `extractFieldErrors(error, options?)`: framework-agnostic core; returns `FieldError[]`
- `mapApiErrors(error, setError, options?)`: React Hook Form adapter; calls `setError` per field
- `FieldError` interface, `MapApiErrorsOptions` interface

## Key decisions
- **Body unwrapping**: detects `{ status, body }` shape (ApiError from generated client), `error.response.data` (Axios), and `{ data }` wrappers; unwraps before parsing
- **`statusCodes` option**: caller can filter which HTTP status codes trigger error mapping
- **`tryParseRfc9457Detail`**: last-resort fallback; parses top-level `detail` string as error message
- No runtime deps: pure TypeScript, framework-agnostic core

## Test / build
```
pnpm test    # vitest run (57 tests)
pnpm build   # tsc
```
