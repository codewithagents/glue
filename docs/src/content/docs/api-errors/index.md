---
title: Form error mapping
description: Map API error responses to form field errors with @codewithagents/api-errors.
---

`@codewithagents/api-errors` maps backend API error responses to form field errors. Framework-agnostic core with a first-class React Hook Form adapter.

## Overview

- `extractFieldErrors(error)` returns normalized `{ field, message }` pairs from any error shape.
- React Hook Form adapter: `mapApiErrors(error, setError)` wires directly to RHF's `setError`. One call at the catch site.
- Supports multiple error formats: RFC 7807 Problem Details, Spring Boot validation format, flat `{ field, message }` arrays.
- Response unwrapping: detects `error.response.data` (Axios), `{ status, body }` (generated client's `ApiError`), and nested `{ data }` wrappers.
- Zero runtime dependencies.

## Install

```bash
npm install @codewithagents/api-errors
```

## Minimal example

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { mapApiErrors } from '@codewithagents/api-errors';

function SignupForm() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const onSubmit = async (data: FormData) => {
    try {
      await createUser(data);
    } catch (error) {
      // Maps API error fields to RHF field errors automatically
      mapApiErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Sign up</button>
    </form>
  );
}
```

### Without React Hook Form

```typescript
import { extractFieldErrors } from '@codewithagents/api-errors';

try {
  await createUser(data);
} catch (error) {
  const fieldErrors = extractFieldErrors(error);
  // [{ field: 'email', message: 'Email is already taken' }, ...]
  for (const { field, message } of fieldErrors) {
    console.error(`${field}: ${message}`);
  }
}
```

## Supported error formats

<!-- TODO (Phase 2): expand with full format documentation -->

| Format | Example |
|---|---|
| RFC 7807 Problem Details | `{ type, title, violations: [{ field, message }] }` |
| Spring Boot validation | `{ errors: [{ field, defaultMessage }] }` |
| Flat array | `[{ field, message }]` |
| Generated client `ApiError` | `{ status, body }` (unwrapped automatically) |

## Works with

- [Types and fetch client](/openapi-gen): the generated `ApiError` type is recognized by `api-errors` for automatic unwrapping.
- [React Query hooks](/openapi-react-query): use `mapApiErrors` in mutation `onError` callbacks.
- [Server interface](/openapi-server): pair with the generated Hono router to return structured error responses.
