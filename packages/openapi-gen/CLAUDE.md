# openapi-gen

Generate TypeScript models, native fetch client, and Zod schemas from an OpenAPI 3.1 spec.

## Generates
- `models.ts` — TypeScript interfaces
- `client.ts` — typed `fetch` functions (zero runtime deps)
- `client-config.ts` — base URL + default fetch options
- `index.ts` — barrel re-export
- `zod.ts` (optional) — bootstrapped once, **never overwritten** — user owns it

## Plugins (`src/plugins/`)
| File | Generates |
|---|---|
| `types.ts` | models.ts |
| `client.ts` | client.ts |
| `client-config.ts` | client-config.ts |
| `zod.ts` | zod.ts |
| `index-barrel.ts` | index.ts |

## Non-obvious decisions
- **`.js` extensions** in all generated imports — required for NodeNext module resolution
- **`resolveParamRef(p, spec)`** — resolves `$ref: '#/components/parameters/Name'` before filtering path/query/header params
- **`hasCookieAuth(spec)`** — checks `components.securitySchemes` for `type: apiKey, in: cookie`; sets `credentials: 'include'` default in client-config
- **`getRequestBodyInfo()`** — returns `{ typeName, kind: 'json' | 'multipart', multipartFields? }`; multipart generates `FormData` building code
- **Array query params** — `searchParams.append` in `for...of` loop (not `set`) for `string[]`/`number[]`
- **Header params** — `headerNameToCamelCase()` converts `X-My-Header` → `xMyHeader`; merged into `params`, spread into fetch headers
- **Zod schema ordering** (`zod.ts` plugin) — schemas are topologically sorted before emission so dependencies always precede their dependents; mutual cycles are detected via Kahn's algorithm and both schemas wrapped in `z.lazy()`

## Config
Default: `openapi-gen.config.json` in CWD. `--config <path>` resolves relative paths from config file's directory.

## Test / build
```
pnpm test           # vitest (excludes integration)
pnpm build          # tsc + chmod +x dist/cli.js
```
Fixtures live in `src/__fixtures__/specs/` — all fictional, never real client specs.

## Integration test suite — examples/
The `examples/` directory at the repo root is the real-world integration suite for this generator:
- **11 showcase specs** — committed generated output, snapshot drift detection, typecheck on every relevant PR
- **117 compat matrix specs** — generated at CI time, current pass rate 74/117
- Known failure patterns: dots in operationIds (Google APIs), spaces, special characters
- See `examples/README.md` for the full breakdown
