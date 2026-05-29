# @codewithagents/glue

[![CI](https://github.com/codewithagents/glue/actions/workflows/ci.yml/badge.svg)](https://github.com/codewithagents/glue/actions/workflows/ci.yml)
[![CodeQL](https://github.com/codewithagents/glue/actions/workflows/codeql.yml/badge.svg)](https://github.com/codewithagents/glue/actions/workflows/codeql.yml)
[![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?branch=main)](https://codecov.io/gh/codewithagents/glue)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./packages/openapi-gen/LICENSE)

> TypeScript glue between your OpenAPI spec and your frontend — zero runtime footprint.

You consume a REST API. You need TypeScript types, a fetch client, form error mapping, and React Query hooks. Instead of hand-writing all of this (and keeping it in sync every time the spec changes), you run one command. Everything here is a `devDependency` or generates code that only depends on what your project already has.

---

## Packages

| Package | Version | Coverage | Description |
|---|---|---|---|
| [`@codewithagents/api-errors`](./packages/api-errors) | [![npm](https://img.shields.io/npm/v/@codewithagents/api-errors.svg)](https://npmjs.com/package/@codewithagents/api-errors) | [![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=api-errors&branch=main)](https://codecov.io/gh/codewithagents/glue) | Map API error responses to form field errors — framework-agnostic core + React Hook Form adapter |
| [`@codewithagents/openapi-gen`](./packages/openapi-gen) | [![npm](https://img.shields.io/npm/v/@codewithagents/openapi-gen.svg)](https://npmjs.com/package/@codewithagents/openapi-gen) | [![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=openapi-gen&branch=main)](https://codecov.io/gh/codewithagents/glue) | Generate TypeScript models + native `fetch` client + Zod schemas from an OpenAPI 3.x spec |
| [`@codewithagents/openapi-react-query`](./packages/openapi-react-query) | [![npm](https://img.shields.io/npm/v/@codewithagents/openapi-react-query.svg)](https://npmjs.com/package/@codewithagents/openapi-react-query) | [![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=openapi-react-query&branch=main)](https://codecov.io/gh/codewithagents/glue) | Generate typed React Query v5 hooks — `useQuery`, `useMutation`, key factories |
| [`@codewithagents/openapi-server`](./packages/openapi-server) | [![npm](https://img.shields.io/npm/v/@codewithagents/openapi-server.svg)](https://npmjs.com/package/@codewithagents/openapi-server) | [![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=openapi-server&branch=main)](https://codecov.io/gh/codewithagents/glue) | Generate typed server-side service interfaces and Hono routers from OpenAPI 3.x |

Each package has its own README with full usage docs and configuration reference.

---

## Full pipeline

One spec, four generators:

```
spec/api.json
  ├── openapi-gen          → models.ts, client.ts       (TypeScript types + fetch client)
  ├── openapi-server       → service.ts, router.ts      (server interface + Hono router)
  └── openapi-react-query  → hooks.ts                   (React Query v5 hooks)
```

You write: your business logic (implement the service interface).
Everything else is generated and stays in sync when the spec changes.

---

## Philosophy

**Zero footprint.** Every package is a `devDependency` or generates code that uses only what your project already has. We never add a runtime dependency you didn't choose.

**Latest only.** TypeScript 6 (actively supported), OpenAPI 3.x (3.1.1 primary target), Zod v4, React Query v5. No legacy shims, no backports. Opinionated cuts mean less code, faster iteration, and a clear upgrade path.

**You own the output.** The Zod schema file is bootstrapped once and never overwritten. Add your own validation rules, error messages, and business logic. The generator treats your file as source of truth.

**Readable output.** Generated code looks like code you'd write yourself — no opaque abstractions, no minified magic. You can read it, review it, and commit it.

**Agent-friendly.** One `devDependency`, one command, a fully-typed API client with runtime validation. Designed to work well when an AI agent is building or maintaining your project.

---

## Why quality matters

Code generators have a wide blast radius. A subtle regression in the generator touches every project that runs it. These are the layers we use to catch problems before they reach you.

**Near-100% test coverage.** All four packages run at 100% statements, functions, and lines. Branches sit at 99%+ across the board — the remaining gap is a handful of genuinely unreachable defensive guards (`?? fallback` patterns where the fallback can never trigger by construction). Coverage is tracked per-package via [Codecov](https://codecov.io/gh/codewithagents/glue) and blocks PRs when it drops.

**128 real-world OpenAPI specs.** The generator runs against a [compatibility matrix](./examples/) of 128 publicly available specs — Stripe, GitHub, Google Calendar, Spotify, Twitter/X, OpenAI, Adyen, Slack, Vercel, Cloudflare, Twilio, Plaid, Notion, Jira, Okta, and more. **128/128 generate without errors** on every PR. The 11 showcase specs (`1Password Connect`, `Adyen Checkout`, `Adyen Legal Entity`, `Dev.to`, `Open-Meteo`, `OpenAI`, `Petstore`, `Redocly Museum`, `Resend`, `Spotify`, `Twitter`) have committed output and drift-checked on every relevant PR. If anything regresses, CI fails.

**Smoke tests against live public APIs.** The generated client code fires real HTTP requests against public no-auth APIs (Open-Meteo, Canada Holidays, Exchange Rate API, D&D 5e) on every push to main and weekly on a schedule. This is the generated code itself making network calls, not just checking that it compiles. If the generator produces a client that breaks at runtime, the smoke suite catches it.

**Mutation testing with Stryker.** `openapi-gen` and `openapi-react-query` run [Stryker](https://stryker-mutator.io/) mutation tests locally. Mutation testing deliberately introduces bugs into the source code and verifies that the test suite catches them. High line coverage that doesn't actually catch regressions shows up here.

**Full-stack E2E tests.** The [`petstore`](./packages/petstore) package is a complete runnable full-stack app: one spec drives generated types, fetch client, React Query hooks, a Hono server with Zod validation, and end-to-end [Playwright](https://playwright.dev/) tests. Every PR runs the full round-trip — spec change to browser assertion.

**Static analysis on every PR.** [Fallow](https://github.com/fallow-rs/fallow) runs on every pull request and posts inline review comments flagging dead code, duplication, and unresolved imports introduced by the diff. [CodeQL](https://github.com/codewithagents/glue/actions/workflows/codeql.yml) handles security scanning.

See [`examples/README.md`](./examples/README.md) for the full compatibility breakdown.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Sponsors

This project is MIT-licensed and free to use. If it saves you time, consider sponsoring:

[![GitHub Sponsors](https://img.shields.io/github/sponsors/codewithagents?style=flat&logo=github)](https://github.com/sponsors/codewithagents)

---

## License

[MIT](./packages/openapi-gen/LICENSE) © codewithagents
