# examples

Real-world OpenAPI specs run through `@codewithagents/openapi-gen`. Generated output is committed so CI can detect drift.

## What this proves

Every spec here generates a Prettier-clean, `tsc --strict`-passing TypeScript client. Across 11 APIs from 8 different industries — payments, AI, security, fintech, email, weather, music, social — the generator handles:

- Kebab-case operationIds (`post-applePay-sessions` → `postApplePaySessions`)
- Hyphenated schema names (`CapabilityProblemEntity-recursive` → `CapabilityProblemEntityRecursive`)
- Hyphenated path segments (`/api-keys` → `createApiKeys`)
- Array query params (`project_ids[]` → TS property `project_ids`, wire name `project_ids[]`)
- Dot-notation query params (`place.fields` → TS property `placeFields`, wire name `place.fields`)
- Path-item level parameters (inherited by all operations in the path)
- Schema name conflicts with global types (OpenAI has a schema called `Response`)
- 100+ query parameters on a single endpoint (Open-Meteo)
- 3.0.x specs alongside 3.1.x specs

## Specs included

| Name | Version | Paths | Industry |
|------|---------|-------|----------|
| `redocly-museum` | 3.1.0 | 5 | Reference / museum |
| `1password-connect` | 3.0.2 | 11 | Security / secrets |
| `petstore-3.0` | 3.0.4 | 13 | Canonical reference |
| `adyen-legal-entity` | 3.1.0 | 20 | Fintech / KYC |
| `adyen-checkout` | 3.1.0 | 26 | Payments |
| `resend` | 3.1.0 | 47 | Email / developer tools |
| `devto` | 3.0.3 | 49 | Developer community |
| `open-meteo` | 3.0.0 | 1 (deep) | Weather |
| `spotify` | 3.0.3 | 71 | Music |
| `twitter` | 3.0.0 | 67 | Social |
| `openai` | 3.0.0 | ~100 | AI |

> **Note:** The `resend` spec was patched from `openapi: "3.1.2"` → `"3.1.0"` because 3.1.2 is not an official OpenAPI version. The 3.0.x specs are accepted by the generator (which runs against 3.1-shaped internals — 3.0-specific constructs like `nullable: true` pass through; full 3.0 normalization is a planned feature).

## Regenerating

```bash
cd examples
pnpm generate    # runs openapi-gen on all 11 specs
```

Or from the repo root:

```bash
pnpm --filter @codewithagents/examples run generate
```

## Typechecking

```bash
pnpm --filter @codewithagents/examples run typecheck
```

## CI

The `examples` job in `.github/workflows/ci.yml` runs in parallel with `Build, Lint & Test`. It:

1. Builds the generator packages
2. Runs `generate` to regenerate all output
3. Runs `git diff --exit-code` on `examples/generated/` — fails if output changed
4. Runs `tsc --noEmit` on all generated files

If CI fails with "Generated output is out of date", run `pnpm generate` in `examples/` and commit the updated output.
