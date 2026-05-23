# Roadmap

**Mission:** Zero-footprint glue between OpenAPI and Zod — for both sides of the wire.

Every package is a `devDependency` or a peer-dep-only tool. Nothing we publish adds bytes to a production bundle that isn't already there.

---

## Packages

### `@codewithagents/api-errors` — ✅ v0.2.0

Maps backend API error responses to form field errors. Framework-agnostic core with React Hook Form adapter.

**Supported formats:** RFC 7807 Problem Details, Spring Boot validation, flat field/message objects, Axios response wrappers.

---

### `@codewithagents/openapi-client` — 🔨 in progress

A CLI devDependency that reads an OpenAPI 3.1 spec and generates self-contained TypeScript. No runtime package required — the generated code uses only native `fetch` and whatever peer deps (Zod, React Query) are already in the project.

**Plugins (each is opt-in):**

| Plugin | Output | Runtime dep |
|---|---|---|
| `types` _(default)_ | `models.ts` — TypeScript interfaces | none |
| `zod` | `schemas.ts` — Zod v4 schemas, types inferred via `z.infer` | `zod` (peer) |
| `react-query` | `react-query.ts` — `queryOptions` + `useMutation` hooks | `@tanstack/react-query` (peer) |

**The fetch client** (`client.ts`) is always generated. When `zod` is active, responses are parsed and validated at the boundary.

**Usage:**
```json
{
  "scripts": { "generate": "openapi-gen" },
  "devDependencies": { "@codewithagents/openapi-client": "^1.0.0" }
}
```
```json
{
  "input": "openapi.json",
  "output": "src/api",
  "plugins": ["zod", "react-query"]
}
```

**Design constraints:**
- OpenAPI 3.1 only (JSON Schema 2020-12 alignment)
- TypeScript 6 only
- Generated code is readable — looks like code you'd write yourself
- Zero runtime footprint

---

### `@codewithagents/openapi-server` — 📋 planned

The server-side counterpart to `openapi-client`. Same spec, same Zod schemas, but targeted at backend route frameworks.

**Planned outputs:**
- `schemas.ts` — identical Zod schemas to what `openapi-client` generates (same source of truth)
- `routes.ts` — Fastify route definitions using `fastify-type-provider-zod`

**The full-stack story:**
```
openapi.json
    ├── openapi-client → client validates responses with Zod
    └── openapi-server → server validates requests with Zod
                   same schemas, both sides
```

The same `CreateCampaignSchema` that validates the API response on the client validates the request body on the server, and validates the form input before the request is even sent.

---

## Design Principles

**1. Zero footprint**
Every package in this repo is a `devDependency` or generates code that only depends on what the project already has. We never add a runtime dependency a project didn't choose.

**2. Latest only**
TypeScript 6, OpenAPI 3.1, Zod v4, React Query v5. No legacy compatibility shims. Opinionated cuts mean less code and faster iteration.

**3. Composable, not monolithic**
Each package solves one problem. `api-errors` doesn't know about `openapi-client`. `openapi-client` doesn't know about `api-errors`. They compose in user code.

**4. Readable output**
Generated code looks like code a developer would write. No minified magic, no opaque abstractions. If something goes wrong, you can read the generated file and understand it.

**5. Agent-friendly**
An AI agent building a TypeScript project should be able to install one devDependency, run one command, and have a fully-typed, validated API client. That's the bar.
