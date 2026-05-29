# examples

128 real-world OpenAPI specs run through `@codewithagents/openapi-gen`. Two tiers: **showcase specs** with committed generated output and **compatibility matrix specs** that prove breadth.

## Two tiers

### Showcase specs (11)

Generated output is committed to `examples/generated/`. CI regenerates on every relevant PR and fails if output has drifted. All 11 generated clients also pass `tsc --strict`.

These are the "golden examples" — they prove the generator handles real edge cases end-to-end.

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

### Compatibility matrix specs (117)

Spec files are committed to `examples/specs/` and configs to `examples/configs/`. Generated output is **not** committed — CI generates all 117 at runtime as part of `pnpm test` in each package.

**Current pass rate: 117/117 (100%).**

A sample of the APIs covered: Stripe, GitHub, Google Calendar, Google Drive, Google Sheets, Spotify, Slack, Vercel, Cloudflare, Twilio, Plaid, Notion, Jira, Okta, Asana, Bitbucket, Box, Brex, CircleCI, Figma (via Notion), Klarna, Linode, NASA, Pinecone, SendGrid, Square, Webflow, Xero, YouTube, Zoom, Zuora, and many more.

## What the generator handles

Edge cases covered by the full 128-spec suite:

- **Dots in operationIds** — `calendar.calendars.insert` → `calendarCalendarsInsert` (Google API style)
- **Spaces and special characters** — operationIds with whitespace, parens, or braces are sanitized to valid identifiers
- **Kebab-case operationIds** — `post-applePay-sessions` → `postApplePaySessions`
- **Hyphenated schema names** — `CapabilityProblemEntity-recursive` → `CapabilityProblemEntityRecursive`
- **Hyphenated and mixed path segments** — `/api-keys` → `createApiKeys`
- **Array query params** — `project_ids[]` → TS property `project_ids`, wire name `project_ids[]`
- **Dot-notation query params** — `place.fields` → TS property `placeFields`, wire name `place.fields`
- **Path-item level parameters** — inherited by all operations in the path
- **Schema name conflicts with global types** — OpenAI has a schema called `Response`
- **100+ query parameters on a single endpoint** — Open-Meteo
- **3.0.x specs alongside 3.1.x specs**

## Regenerating showcase output

```bash
cd examples
pnpm generate    # runs openapi-gen on all 11 showcase specs
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

The `Examples` workflow (`.github/workflows/examples.yml`) runs on every relevant PR:

- **Triggers**: path-filtered (`packages/openapi-gen/**`, `examples/**`) on PRs and pushes to main, plus weekly on Monday 6am UTC
- **Steps**:
  1. Build the generator packages
  2. Run all 128 configs — all 117 compat matrix specs must generate without errors (parameterized tests via `pnpm test`)
  3. `git diff --exit-code examples/generated/` — fails if showcase output has drifted
  4. `tsc --noEmit` on all generated output in `examples/generated/`

If CI fails with "Showcase generated output is out of date", run `pnpm generate` in `examples/` and commit the updated output.

> **Note:** The `resend` spec was patched from `openapi: "3.1.2"` → `"3.1.0"` because 3.1.2 is not an official OpenAPI version. The 3.0.x specs are accepted by the generator (3.0-specific constructs like `nullable: true` pass through; full 3.0 normalization is a planned feature).
