---
title: Full-stack tutorial
description: End-to-end example using all four Glue packages together with the Petstore demo.
---

This tutorial walks through a complete full-stack application using all four Glue packages together. It is based on the [petstore-hono demo](https://github.com/codewithagents/glue/tree/main/packages/petstore-hono) in the monorepo.

## What you will build

A pet management API with a React frontend. The stack:

- **Backend:** Hono server with a typed service interface generated from the Petstore OpenAPI spec.
- **Client:** Generated types and a typed `fetch` client.
- **Frontend:** React Query hooks generated from the same spec.
- **Forms:** `api-errors` wiring mutation errors to form fields automatically.

## Prerequisites

- Node.js 18 or later.
- An OpenAPI 3.1 spec. This tutorial uses the Petstore spec.

## Step 1: Install packages

```bash
npm install -D @codewithagents/openapi-gen @codewithagents/openapi-react-query @codewithagents/openapi-server
npm install @codewithagents/api-errors @tanstack/react-query
```

## Step 2: Configure generators

Create config files in your project root:

**`openapi-gen.config.json`:**

```json
{
  "input_openapi": "./petstore.json",
  "output": "./src/api"
}
```

**`openapi-react-query.config.json`:**

```json
{
  "input_openapi": "./petstore.json",
  "output": "./src/api",
  "auto_invalidate": true
}
```

**`openapi-server.config.json`:**

```json
{
  "input_openapi": "./petstore.json",
  "output": "./src/api",
  "framework": "hono"
}
```

## Step 3: Run all generators

```bash
npx openapi-gen
npx openapi-react-query
npx openapi-server
```

## Step 4: Implement the service

<!-- TODO (Phase 2): pull real code from packages/petstore-hono once content is ported -->

```typescript
import type { PetService } from './src/api/service';

const pets = new Map<number, Pet>();

export const petService: PetService = {
  async listPets({ query }) {
    const all = [...pets.values()];
    return { status: 200, body: query.limit ? all.slice(0, query.limit) : all };
  },
  async createPet({ body }) {
    const id = Date.now();
    const pet = { ...body, id };
    pets.set(id, pet);
    return { status: 201, body: pet };
  },
  async getPetById({ params }) {
    const pet = pets.get(params.petId);
    if (!pet) return { status: 404, body: { message: 'Not found' } };
    return { status: 200, body: pet };
  },
};
```

## Step 5: Mount the router

```typescript
import { Hono } from 'hono';
import { createRouter } from './src/api/router';
import { petService } from './service';

const app = new Hono();
app.route('/api', createRouter(petService));

export default app;
```

## Step 6: Use hooks in the frontend

```tsx
import { usePetsList } from './src/api/hooks';

function PetList() {
  const { data: pets, isLoading } = usePetsList();
  if (isLoading) return <p>Loading...</p>;
  return (
    <ul>
      {pets?.map(pet => <li key={pet.id}>{pet.name}</li>)}
    </ul>
  );
}
```

## Step 7: Wire mutation errors to forms

```tsx
import { useCreatePetMutation } from './src/api/hooks';
import { mapApiErrors } from '@codewithagents/api-errors';
import { useForm } from 'react-hook-form';

function AddPetForm() {
  const { register, handleSubmit, setError } = useForm();
  const { mutateAsync } = useCreatePetMutation();

  const onSubmit = async (data: { name: string }) => {
    try {
      await mutateAsync({ body: data });
    } catch (error) {
      mapApiErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Pet name" />
      <button type="submit">Add pet</button>
    </form>
  );
}
```

## Full source

The complete working demo is in [`packages/petstore-hono`](https://github.com/codewithagents/glue/tree/main/packages/petstore-hono) in the monorepo.

<!-- TODO (Phase 2): expand with Playwright test walkthrough and live code imports from the petstore demo -->
