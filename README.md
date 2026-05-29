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

## Tested against 128 real-world OpenAPI specs

The generator runs against a [compatibility matrix](./examples/) of 128 publicly available OpenAPI specs — Stripe, GitHub, Google Calendar, Spotify, Twitter/X, OpenAI, Adyen, Slack, Vercel, Cloudflare, Twilio, Plaid, Notion, Jira, Okta, and more.

**128/128 generate without errors.** All specs run as parameterized tests across all three generators on every PR — if any spec regresses, CI fails.

The 11 showcase specs (`1Password Connect`, `Adyen Checkout`, `Adyen Legal Entity`, `Dev.to`, `Open-Meteo`, `OpenAI`, `Petstore`, `Redocly Museum`, `Resend`, `Spotify`, `Twitter`) have their generated output committed and drift-checked on every relevant PR. The remaining 117 specs run as a compatibility signal.

See [`examples/README.md`](./examples/README.md) for the full breakdown.

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
