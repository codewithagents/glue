# @codewithagents/api-errors

[![npm](https://img.shields.io/npm/v/@codewithagents/api-errors.svg)](https://npmjs.com/package/@codewithagents/api-errors)
[![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=api-errors)](https://codecov.io/gh/codewithagents/glue)

Backend API errors don't automatically map to form field errors. Every project writes the same glue code from scratch: catch the error, inspect its shape, figure out which field each message belongs to, then call your form library's error setter. This package does that for you — framework-agnostic core with a first-class React Hook Form adapter.

## Installation

```bash
npm install @codewithagents/api-errors
```

## Usage

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form'
import { mapApiErrors } from '@codewithagents/api-errors'

function SignupForm() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      await api.post('/signup', data)
    } catch (error) {
      // Automatically maps backend field errors to RHF setError calls
      mapApiErrors(error, setError)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <button type="submit">Sign up</button>
    </form>
  )
}
```

### With typed React Hook Form forms

`mapApiErrors` accepts any function matching `(field: string, error: { type: string; message: string }) => void`, which is compatible with RHF's `UseFormSetError<T>`. No casting needed:

```tsx
type FormValues = { email: string; name: string }

const { setError } = useForm<FormValues>()

// ✅ works — setError is assignable to the expected signature
mapApiErrors(error, setError)
```

### With native `fetch` (no Axios)

Pass the parsed response body directly to `extractFieldErrors`:

```ts
import { extractFieldErrors } from '@codewithagents/api-errors'

const res = await fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) })
if (!res.ok) {
  const body = await res.json()
  const fieldErrors = extractFieldErrors(body)
  for (const { field, message } of fieldErrors) {
    setError(field, { type: 'server', message })
  }
}
```

### Standalone with `extractFieldErrors`

Use `extractFieldErrors` when you need the normalized error list without a form library:

```ts
import { extractFieldErrors } from '@codewithagents/api-errors'

try {
  await submitData(payload)
} catch (error) {
  const fieldErrors = extractFieldErrors(error)
  // [{ field: 'email', message: 'must not be blank' }, ...]
  for (const { field, message } of fieldErrors) {
    console.warn(`${field}: ${message}`)
  }
}
```

### Options

Both `extractFieldErrors` and `mapApiErrors` accept an options object:

```ts
const fieldErrors = extractFieldErrors(error, {
  // Field name used when no field can be determined (default: 'root')
  fallbackField: 'serverError',

  // Transform field names — e.g. camelCase backend → dot.path for nested RHF fields
  transformField: (f) => f.replace(/([A-Z])/g, '.$1').toLowerCase(),
})

// Options work on mapApiErrors too
mapApiErrors(error, setError, { fallbackField: 'root' })
```

> **Note:** `transformField` is also applied to `fallbackField`. If you transform `emailAddress` → `email.address`, the fallback field name is transformed the same way.

## Supported Error Formats

**RFC 7807 Problem Details** (Spring Boot 3+, standard):
```json
{
  "type": "...",
  "title": "Validation failed",
  "status": 400,
  "errors": {
    "email": ["must not be blank"],
    "name": ["too short"]
  }
}
```

**Spring Boot default validation format** (older):
```json
{
  "status": 400,
  "errors": [
    { "field": "email", "defaultMessage": "must not be blank" }
  ]
}
```

**Simple flat format** (custom APIs):
```json
{ "field": "email", "message": "Invalid email" }
```

**Array of flat objects:**
```json
[{ "field": "email", "message": "Invalid email" }]
```

Response wrappers are automatically unwrapped — both Axios-style `error.response.data` and generic `{ data: { ... } }` shapes.

## Known behaviour: multiple errors for the same field

When a backend returns multiple errors for the same field (e.g. in the flat array format), `extractFieldErrors` returns all of them. If you pass them all to React Hook Form's `setError`, the **last call wins** — only the last message is displayed. If you need to show all messages, collect them before calling `setError`:

```ts
const fieldErrors = extractFieldErrors(error)
const grouped = Map.groupBy(fieldErrors, (e) => e.field)

for (const [field, errs] of grouped) {
  setError(field, { type: 'server', message: errs.map((e) => e.message).join(', ') })
}
```

## TypeScript

This package is written in TypeScript and ships full type declarations. No `@types` package needed.

```ts
import type { FieldError, MapApiErrorsOptions } from '@codewithagents/api-errors'
```
