# @codewithagents/api-errors

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

      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}

      <button type="submit">Sign up</button>
    </form>
  )
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

You can customize the fallback field name and transform field names:

```ts
const fieldErrors = extractFieldErrors(error, {
  fallbackField: 'root',               // used when no field is found (default: 'root')
  transformField: (f) => f.replace(/([A-Z])/g, '.$1').toLowerCase(), // camelCase → dot.path
})
```

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
or as an array:
```json
[{ "field": "email", "message": "Invalid email" }]
```

## TypeScript

This package is written in TypeScript and ships full type declarations. No `@types` package needed.

```ts
import type { FieldError, MapApiErrorsOptions } from '@codewithagents/api-errors'
```
