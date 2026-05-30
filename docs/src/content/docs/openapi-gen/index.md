---
title: Types and fetch client
description: Generate TypeScript types, a native fetch client, and Zod schemas from your OpenAPI spec with @codewithagents/openapi-gen.
---

`@codewithagents/openapi-gen` generates TypeScript types, a typed native `fetch` client, and optional Zod schemas from an OpenAPI 3.x spec. Zero runtime footprint. Tested against 128 real-world specs on every PR.

## Overview

- Generates `models.ts` (interfaces), `client.ts` (typed `fetch` calls), `client-config.ts`, `index.ts`, and an optional `zod.ts`.
- No axios, no runtime wrapper libraries. The generated client uses only `fetch`.
- OpenAPI 3.1.x primary target, 3.0.x best-effort.
- Every generated file passes `prettier --check` out of the box.
- All output passes TypeScript `strict: true`.

## Install

```bash
npm install -D @codewithagents/openapi-gen
```

## Minimal example

**Config (`openapi-gen.config.json`):**

```json
{
  "input_openapi": "./openapi.json",
  "output": "./src/api"
}
```

**Run:**

```bash
npx openapi-gen
```

**Use the generated client:**

```typescript
import { getPet } from './src/api';

const pet = await getPet({ params: { petId: 1 } });
console.log(pet.name);
```

## Configuration

<!-- TODO (Phase 2): generate this table from the TS config type -->

| Field | Type | Required | Description |
|---|---|---|---|
| `input_openapi` | `string` | Yes | Path to your OpenAPI spec (JSON or YAML) |
| `output` | `string` | Yes | Directory to write generated files |

## Generated files

| File | Description |
|---|---|
| `models.ts` | TypeScript interfaces for every schema in the spec |
| `client.ts` | One typed `fetch` function per operation |
| `client-config.ts` | Base URL and default fetch options (edit to taste) |
| `zod.ts` | Bootstrapped Zod schema stubs (written once, never overwritten; you own it) |
| `index.ts` | Barrel re-export |

## Zod schemas

Pass `"zod": true` in your config to generate `zod.ts`. The file is written once and never overwritten: the generator bootstraps the stubs, you fill in the validation rules. Re-running the generator does not clobber your changes.

<!-- TODO (Phase 2): add real code examples imported from integration tests -->

## Works with

- [React Query hooks](/openapi-react-query): use the generated client as the foundation for typed hooks.
- [Server interface](/openapi-server): share the same spec to generate a server-side service interface.
- [Form error mapping](/api-errors): map API error responses from the generated client to form fields.
