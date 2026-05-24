# integration

Private cross-package test harness. Verifies `openapi-gen` + `openapi-react-query` + `api-errors` work together end-to-end.

## Key facts
- `private: true` — never published to npm
- `generated/` is **committed** — sample output that tests import directly
- `spec/api.json` — fictional Task Manager OpenAPI 3.1 spec (19 integration tests)

## Regenerating `generated/`
Build packages first, then:
```
pnpm run generate        # runs openapi-gen
pnpm run generate:hooks  # runs openapi-react-query
```

## Test
```
pnpm test   # vitest run
```
