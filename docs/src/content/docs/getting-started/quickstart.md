---
title: Quickstart
description: Go from an OpenAPI spec to a working typed fetch client in minutes.
---

This guide walks you through installing `@codewithagents/openapi-gen` and generating a typed fetch client from an OpenAPI spec. It takes about five minutes.

## 1. Install

```bash
npm install -D @codewithagents/openapi-gen
```

## 2. Add a config file

Create `openapi-gen.config.json` in your project root:

```json
{
  "input_openapi": "./openapi.json",
  "output": "./src/api"
}
```

Point `input_openapi` at your spec file (JSON or YAML). The `output` directory will be created if it does not exist.

## 3. Run the generator

```bash
npx openapi-gen
```

This writes the following files to `./src/api/`:

| File | Contents |
|---|---|
| `models.ts` | TypeScript interfaces for every schema |
| `client.ts` | Typed `fetch` functions, one per operation |
| `client-config.ts` | Base URL and default fetch options |
| `index.ts` | Barrel re-export |

## 4. Use the generated client

```typescript
import { getUser, createUser } from './src/api';

// Fully typed: parameters, return type, and error shape
const user = await getUser({ params: { id: '123' } });
console.log(user.name);
```

## What next?

- Add [React Query hooks](/openapi-react-query) with `@codewithagents/openapi-react-query`.
- Generate a [server interface](/openapi-server) with `@codewithagents/openapi-server`.
- Map API errors to form fields with [`@codewithagents/api-errors`](/api-errors).
- See the [full-stack tutorial](/tutorial/full-stack) for an end-to-end example using all four packages with the Petstore demo.

<!-- TODO: add a real spec snippet and generated output example once Phase 2 content porting is complete -->
