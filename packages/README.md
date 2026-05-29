# packages

This directory contains all packages in the `@codewithagents/glue` monorepo.

## Published packages

| Package | Version | Description |
|---|---|---|
| [`api-errors`](./api-errors) | [![npm](https://img.shields.io/npm/v/@codewithagents/api-errors.svg)](https://npmjs.com/package/@codewithagents/api-errors) | Map API error responses to form field errors |
| [`openapi-gen`](./openapi-gen) | [![npm](https://img.shields.io/npm/v/@codewithagents/openapi-gen.svg)](https://npmjs.com/package/@codewithagents/openapi-gen) | Generate TypeScript models + fetch client from OpenAPI 3.x |
| [`openapi-react-query`](./openapi-react-query) | [![npm](https://img.shields.io/npm/v/@codewithagents/openapi-react-query.svg)](https://npmjs.com/package/@codewithagents/openapi-react-query) | Generate React Query v5 hooks from OpenAPI 3.x |
| [`openapi-server`](./openapi-server) | [![npm](https://img.shields.io/npm/v/@codewithagents/openapi-server.svg)](https://npmjs.com/package/@codewithagents/openapi-server) | Generate typed server interfaces + Hono routers from OpenAPI 3.x |

## Private packages

| Package | Description |
|---|---|
| [`integration`](./integration) | Cross-package test harness — 71 tests verifying the generators work together |
| [`petstore`](./petstore) | End-to-end showcase — real Hono server + React frontend + 5 Playwright tests |

## How they fit together

```
spec/api.json
  ├── openapi-gen          → models.ts, client.ts        TypeScript types + fetch client
  ├── openapi-server       → service.ts, router.ts       Server interface + Hono router
  └── openapi-react-query  → hooks.ts                    React Query v5 hooks

You write: business logic only (implement the service interface).
```

See the [petstore](./petstore) package for a working example of the full pipeline.
