# Roadmap

**Mission:** Zero-footprint bridge between OpenAPI and Zod, for both sides of the wire.

Every package is a `devDependency` or a peer-dep-only tool. Nothing we publish adds bytes to a production bundle that isn't already there.

---

## Packages

### `@codewithagents/api-errors` — ✅ v0.2.0

Maps backend API error responses to form field errors. Framework-agnostic core with React Hook Form adapter.

**Supported formats:** RFC 7807 Problem Details, Spring Boot validation, flat field/message objects, Axios response wrappers.

---

### `@codewithagents/openapi-gen` — 🔨 in progress

A CLI devDependency that reads an OpenAPI 3.1 spec and an optional user-owned Zod schema, and generates self-contained TypeScript. No runtime package required — the generated code uses only native `fetch`.

**Two inputs:**

| Field | Required | Description |
|---|---|---|
| `input_openapi` | ✅ | Path to OpenAPI 3.1 spec (JSON or YAML) |
| `input_schema` | optional | Path to user-owned Zod schema file. Bootstrapped on first run if absent. |

**Always generated:**
- `models.ts` — TypeScript interfaces (or types derived from `input_schema` via `z.infer`)
- `client.ts` — native fetch functions. When `input_schema` is present: pre-send validation + response validation using the user's Zod schemas.

**Usage:**
```json
{
  "scripts": { "generate": "openapi-gen" },
  "devDependencies": { "@codewithagents/openapi-gen": "^1.0.0" }
}
```
```json
{
  "input_openapi": "openapi.json",
  "input_schema": "schemas.ts",
  "output": "src/api"
}
```

**First run (no `input_schema`):** bootstraps `schemas.ts` as a starting point — structural only, ready to customise with error messages and business rules.

**Subsequent runs:** uses `schemas.ts` as the validation layer. Warns on drift between the OpenAPI spec and user's schema.

**Design constraints:**
- OpenAPI 3.1 only (JSON Schema 2020-12 alignment)
- TypeScript 6 only
- Generated code is readable — looks like code you'd write yourself
- Zero runtime footprint

---

### `@codewithagents/openapi-gen-react-query` — 📋 next

Separate package on top of `openapi-gen`. Reads the same `openapi.json` and the output of `openapi-gen`, generates React Query v5 hooks.

```json
{
  "devDependencies": {
    "@codewithagents/openapi-gen": "^1.0.0",
    "@codewithagents/openapi-gen-react-query": "^1.0.0"
  }
}
```

Generates `react-query.ts` — `queryOptions` factories for GET endpoints, `useMutation` hooks for writes. Imports from `openapi-gen`'s `client.ts` output. Peer dep: `@tanstack/react-query`.

---

### `@codewithagents/openapi-gen-server` — 📋 planned

Server-side counterpart. Same `openapi.json`, generates Fastify route definitions using the same Zod schemas. Peer dep: `fastify` + `fastify-type-provider-zod`.

**The full-stack story:**
```
openapi.json + schemas.ts
    ├── openapi-gen        → client validates responses with user's Zod schemas
    └── openapi-gen-server → server validates requests with same Zod schemas
```

---

## Design Principles

**1. Zero footprint**
Every package in this repo is a `devDependency` or generates code that only depends on what the project already has. We never add a runtime dependency a project didn't choose.

**2. Latest only**
TypeScript 6, OpenAPI 3.1, Zod v4, React Query v5. No legacy compatibility shims. Opinionated cuts mean less code and faster iteration.

**3. Two inputs, one truth**
`input_openapi` owns structure. `input_schema` owns validation behaviour and messages. Neither can replace the other. The generator merges them.

**4. User owns the schema**
`schemas.ts` is bootstrapped once and never overwritten. The user adds error messages, business rules, cross-field validation. The generator warns when it drifts from the OpenAPI spec.

**5. Readable output**
Generated code looks like code a developer would write. No minified magic, no opaque abstractions.

**6. Agent-friendly**
An AI agent building a TypeScript project should be able to install one devDependency, run one command, and have a fully-typed, validated API client. That's the bar.
