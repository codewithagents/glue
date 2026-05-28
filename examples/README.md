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

Spec files are committed to `examples/specs/` and configs to `examples/configs/`. Generated output is **not** committed — CI generates all 117 at runtime and reports a pass/fail count.

**Current pass rate: 74/117 (63%).**

A sample of the APIs covered: Stripe, GitHub, Google Calendar, Google Drive, Google Sheets, Spotify, Slack, Vercel, Cloudflare, Twilio, Plaid, Notion, Jira, Okta, Asana, Bitbucket, Box, Brex, CircleCI, Figma (via Notion), Klarna, Linode, NASA, Pinecone, SendGrid, Square, Webflow, Xero, YouTube, Zoom, Zuora, and many more.

## Known failure patterns

These categories account for most of the 43 currently failing specs:

- **Dots in operationIds** — e.g. `calendar.calendars.insert` in Google APIs (11 Google API specs). The generator tries to sanitize dots but produces invalid identifiers in some cases.
- **Spaces in operationIds** — operationIds with whitespace that can't be cleanly converted to camelCase.
- **Special characters** — parens, braces, and other non-alphanumeric characters in operationIds or schema names.

These are tracked and fixes are in progress. The compat matrix is how we find and document them.

## What the showcase specs prove

The generator handles:

- Kebab-case operationIds (`post-applePay-sessions` → `postApplePaySessions`)
- Hyphenated schema names (`CapabilityProblemEntity-recursive` → `CapabilityProblemEntityRecursive`)
- Hyphenated path segments (`/api-keys` → `createApiKeys`)
- Array query params (`project_ids[]` → TS property `project_ids`, wire name `project_ids[]`)
- Dot-notation query params (`place.fields` → TS property `placeFields`, wire name `place.fields`)
- Path-item level parameters (inherited by all operations in the path)
- Schema name conflicts with global types (OpenAI has a schema called `Response`)
- 100+ query parameters on a single endpoint (Open-Meteo)
- 3.0.x specs alongside 3.1.x specs

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

The `Examples` workflow (`.github/workflows/examples.yml`) is separate from the main CI:

- **Triggers**: path-filtered (`packages/openapi-gen/**`, `examples/**`) on PRs and pushes to main, plus weekly on Monday 6am UTC
- **Steps**:
  1. Build the generator packages
  2. Run all 128 configs — reports `PASS`/`FAIL` per spec with a summary count
  3. `git diff --exit-code examples/generated/` — fails if showcase output has drifted
  4. `tsc --noEmit` on all generated output in `examples/generated/`

If CI fails with "Showcase generated output is out of date", run `pnpm generate` in `examples/` and commit the updated output.

> **Note:** The `resend` spec was patched from `openapi: "3.1.2"` → `"3.1.0"` because 3.1.2 is not an official OpenAPI version. The 3.0.x specs are accepted by the generator (3.0-specific constructs like `nullable: true` pass through; full 3.0 normalization is a planned feature).
