---
title: Server interface
description: Generate a typed service interface and optional Hono router from your OpenAPI spec with @codewithagents/openapi-server.
---

`@codewithagents/openapi-server` generates a typed service interface from your OpenAPI spec. Framework-agnostic by design: wire it to Hono, Express, Fastify, or any router you already use.

## Overview

- Generates `service.ts`: a plain TypeScript interface with one method per operation. No framework imports.
- Optional router scaffolding: set `"framework": "hono"` for a ready-to-mount Hono router. Set `"framework": "none"` and wire the interface yourself.
- Type-safe contract: if your implementation drifts from the spec, the TypeScript compiler tells you.
- Optional Zod validation in the router: set `input_schema` to enable `safeParse` calls and `422` responses on invalid input.

## Install

```bash
npm install -D @codewithagents/openapi-server
```

Requires `@codewithagents/openapi-gen`. Run both generators together.

## Minimal example

**Config (`openapi-server.config.json`):**

```json
{
  "input_openapi": "./openapi.json",
  "output": "./src/api",
  "framework": "hono"
}
```

**Run both generators:**

```bash
npx openapi-gen
npx openapi-server
```

**Implement the service interface:**

```typescript
import type { PetService } from './src/api/service';

export const petService: PetService = {
  async getPetById({ params }) {
    const pet = await db.pets.findById(params.petId);
    return { status: 200, body: pet };
  },
  // TypeScript errors if you forget any operation
};
```

**Mount the generated router:**

```typescript
import { createRouter } from './src/api/router';
import { Hono } from 'hono';

const app = new Hono();
app.route('/api', createRouter(petService));
```

## Configuration

<!-- TODO (Phase 2): generate this table from the TS config type -->

| Field | Type | Required | Description |
|---|---|---|---|
| `input_openapi` | `string` | Yes | Path to your OpenAPI spec |
| `output` | `string` | Yes | Directory to write generated files |
| `framework` | `"hono" \| "none"` | No | Router scaffolding. Default: `"none"` |
| `input_schema` | `string` | No | Path to user-owned Zod schema file for request validation |

## Zod validation

Set `input_schema` to a Zod schema file you maintain. The generator uses it to add `safeParse` calls to the router, returning `422 { error, issues }` on invalid input. The schema file is never overwritten.

<!-- TODO (Phase 2): add real code examples from the petstore-hono demo -->

## Works with

- [Types and fetch client](/openapi-gen): `openapi-server` uses the same spec as `openapi-gen`; run them together.
- [React Query hooks](/openapi-react-query): pair a typed server with typed client hooks on the same spec.
- [Form error mapping](/api-errors): the generated `ApiError` shape is recognized by `api-errors` for automatic error mapping.
