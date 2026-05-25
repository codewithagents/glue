# codewithagents/glue — monorepo

## Stack
- **pnpm** workspace (`packageManager: pnpm@10.30.3`) — never use npm/yarn at root
- **TypeScript 6**, `"type": "module"` everywhere, `NodeNext` module resolution
- **vitest** for all tests

## Packages
| Package | Purpose |
|---|---|
| `packages/api-errors` | Map API errors to form field errors |
| `packages/openapi-gen` | Generate TS models + fetch client + Zod from OpenAPI 3.1 |
| `packages/openapi-react-query` | Generate React Query v5 hooks (depends on openapi-gen) |
| `packages/integration` | Private cross-package test harness, committed sample output |

## Key rules
- **OpenAPI 3.1 only** — no 3.0.x support
- **Never commit real/internal API specs** — all fixtures must be fictional
- Build order matters: `openapi-gen` must be built before `openapi-react-query`
- `pnpm -r run build` / `pnpm -r run test` / `pnpm -r run lint` at root

## Release pipeline
- **Release Please** — automatic versioning from conventional commits; config in `release-please-config.json`
- **npm publish** via OIDC Trusted Publishing (no stored token) — triggered by Release Please release creation
- Manifest seeded in `.release-please-manifest.json`; `bump-major-pre-major: true` on 0.x packages
- **Never bump versions manually** — merge your PR, wait for Release Please to open its release PR, merge that; the publish workflow fires automatically

## CI
- GitHub Actions: `Build, Lint & Test` + `CodeQL Advanced` on every PR
- All checks must pass before merge — squash merge strategy
