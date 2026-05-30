---
title: Introduction
description: What Glue is, and the spec-to-UI pipeline mental model.
---

Glue is a TypeScript OpenAPI toolchain that takes a spec and generates everything you need: types, a fetch client, React Query hooks, Zod schemas, a server-side service interface, and form error mapping. Each piece is a separate npm package. Use as many or as few as your project needs.

## The pipeline

```
OpenAPI spec
    |
    v
openapi-gen   --> TypeScript types
              --> Typed fetch client
              --> Zod schemas (optional, user-owned)
    |
    +-----------> openapi-react-query --> React Query v5 hooks
    |
    +-----------> openapi-server      --> Service interface + optional Hono router
    |
    v
api-errors    --> Form field error mapping (framework-agnostic)
```

Everything flows from a single spec. One source of truth. When the spec changes, re-run the generator and the compiler tells you what broke.

## Packages

| Package | What it does |
|---|---|
| [`@codewithagents/openapi-gen`](/openapi-gen) | Generates TypeScript types, a native `fetch` client, and optional Zod schemas |
| [`@codewithagents/openapi-react-query`](/openapi-react-query) | Generates typed React Query v5 hooks from the generated client |
| [`@codewithagents/openapi-server`](/openapi-server) | Generates a typed service interface and optional Hono router |
| [`@codewithagents/api-errors`](/api-errors) | Maps API error responses to form field errors at runtime |

## Who it is for

Glue is built for TypeScript projects that want end-to-end type safety from an OpenAPI spec. It works with any HTTP framework on the server side and any React setup on the client. The generated output is plain TypeScript with no runtime wrapper dependencies.

## Next step

Follow the [Quickstart](/getting-started/quickstart) to go from a spec file to a working typed client in a few minutes.
