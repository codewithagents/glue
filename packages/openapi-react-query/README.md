# @codewithagents/openapi-react-query

[![npm](https://img.shields.io/npm/v/@codewithagents/openapi-react-query.svg)](https://npmjs.com/package/@codewithagents/openapi-react-query)
[![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=openapi-react-query)](https://codecov.io/gh/codewithagents/glue)

Generate typed [React Query v5](https://tanstack.com/query/v5) hooks from an OpenAPI 3.1 spec. Run once, get a fully typed `useQuery` hook per GET endpoint and a `useMutation` hook per write operation — no hand-written boilerplate.

Works alongside [`@codewithagents/openapi-gen`](../openapi-gen) which generates the underlying typed fetch client.

## Install

```bash
npm install -D @codewithagents/openapi-react-query @codewithagents/openapi-gen
npm install @tanstack/react-query
```

## Configure

Create `openapi-react-query.config.json` in your project root:

```json
{
  "input_openapi": "./openapi.json",
  "output": "./src/api",
  "stale_time": 30000,
  "gc_time": 300000
}
```

| Field | Required | Default | Description |
|---|---|---|---|
| `input_openapi` | ✅ | — | Path to OpenAPI 3.1 spec (JSON or YAML) |
| `output` | ✅ | — | Directory to write generated files (same as openapi-gen output) |
| `stale_time` | — | `0` | `staleTime` in ms applied to all `useQuery` hooks |
| `gc_time` | — | `300000` | `gcTime` in ms applied to all `useQuery` hooks |

## Generate

Run both generators — order matters, openapi-gen first:

```bash
npx openapi-gen
npx openapi-react-query
```

Or add to `package.json`:

```json
{
  "scripts": {
    "generate": "openapi-gen && openapi-react-query"
  }
}
```

## What gets generated

Given a spec with a `/tasks` resource, `hooks.ts` contains:

**Key factory** — one per resource, used for cache invalidation:

```ts
export const taskKeys = {
  all: () => ['tasks'] as const,
  list: (params?) => ['tasks', 'list', params] as const,
  detail: (id: string) => ['tasks', id] as const,
}
```

**Query hooks** — one per GET operation:

```ts
export function useListTasks(params?, options?) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => listTasks(params),
    staleTime: 30000,
    gcTime: 300000,
    ...options,   // override any option per call site
  })
}
```

**Mutation hooks** — one per POST/PUT/PATCH/DELETE:

```ts
export function useCreateTask(options?) {
  return useMutation({ mutationFn: (vars) => createTask(vars), ...options })
}

export function useUpdateTask(options?) {
  return useMutation({ mutationFn: ({ id, body }) => updateTask(id, body), ...options })
}
```

All types are derived from the generated client — no duplication:
- Data type: `Awaited<ReturnType<typeof listTasks>>`
- Variables type: `Parameters<typeof createTask>[0]`

## Use it

```tsx
import { useListTasks, useCreateTask, taskKeys } from './src/api/hooks'
import { useQueryClient } from '@tanstack/react-query'

function TaskList() {
  const { data, isLoading } = useListTasks({ status: 'open' })

  const queryClient = useQueryClient()
  const create = useCreateTask({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all() }),
  })

  if (isLoading) return <Spinner />
  return (
    <>
      {data?.map(task => <Task key={task.id} task={task} />)}
      <button onClick={() => create.mutate({ title: 'New task' })}>Add</button>
    </>
  )
}
```

## Multiple specs

Use `--config` to point at different config files per vendor:

```bash
npx openapi-gen --config ./config/payments.config.json
npx openapi-react-query --config ./config/payments.config.json
```

Relative paths in each config resolve from the config file's directory.

## License

MIT
