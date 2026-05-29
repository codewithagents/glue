# @codewithagents/openapi-react-query

[![npm](https://img.shields.io/npm/v/@codewithagents/openapi-react-query.svg)](https://npmjs.com/package/@codewithagents/openapi-react-query)
[![codecov](https://codecov.io/gh/codewithagents/glue/graph/badge.svg?flag=openapi-react-query)](https://codecov.io/gh/codewithagents/glue)

Generate typed [React Query v5](https://tanstack.com/query/v5) hooks from an OpenAPI 3.x spec. Run once, get a fully typed `useQuery` hook per GET endpoint and a `useMutation` hook per write operation — no hand-written boilerplate.

Works alongside [`@codewithagents/openapi-gen`](https://www.npmjs.com/package/@codewithagents/openapi-gen) which generates the underlying typed fetch client. All generated files are **Prettier-clean** out of the box — commit them without running a formatter.

See the [petstore demo](https://github.com/codewithagents/glue/tree/main/packages/petstore) for a full-stack example combining all four packages.

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
  "gc_time": 300000,
  "suspense": false,
  "auto_invalidate": false
}
```

| Field | Required | Default | Description |
|---|---|---|---|
| `input_openapi` | ✅ | — | OpenAPI 3.x spec (JSON or YAML) |
| `output` | ✅ | — | Directory to write generated files (same as openapi-gen output) |
| `stale_time` | — | `0` | `staleTime` in ms applied to all `useQuery` hooks |
| `gc_time` | — | `300000` | `gcTime` in ms applied to all `useQuery` hooks |
| `suspense` | — | `false` | When `true`, generates a `useSuspense*` variant alongside every query hook |
| `auto_invalidate` | — | `false` | When `true`, mutation hooks auto-invalidate related queries on success |
| `overrides` | — | — | Per-resource cache timing (see [Per-resource cache timing](#per-resource-cache-timing)) |

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
// Key factory (id stays string here — only the hook widens it)
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

// Detail hook — id widened to allow undefined/null; auto-disabled until id is set
export function useGetTask(
  id: string | undefined | null,
  options?,
) {
  return useQuery({
    queryKey: taskKeys.detail(id!),
    queryFn: () => getTask(id!),
    enabled: id != null && (options?.enabled ?? true),
    ...options,
  })
}
```

Detail hooks (those with a path parameter) automatically disable when the parameter is `null` or `undefined` — no more `enabled: !!id` at every call site.

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

## Suspense variants

When `suspense: true` in config, a `useSuspense*` hook is generated alongside every query hook:

```ts
// Regular hook (always generated)
const { data, isLoading } = useGetTask(id)

// Suspense variant (generated when suspense: true)
// data is never undefined — wrap parent in <Suspense fallback={...}>
const { data } = useSuspenseGetTask(id)
```

Works with React 18 `<Suspense>` boundaries and Next.js App Router loading states.

## Auto-invalidate on mutation success

When `auto_invalidate: true` in config, mutation hooks automatically invalidate related cache entries on success. No `useQueryClient` boilerplate at the call site:

```ts
// With auto_invalidate: true — invalidation is generated inside the hook
const create = useCreateTask()
create.mutate({ title: 'New task' })
// taskKeys.all() is automatically invalidated on success

const update = useUpdateTask()
update.mutate({ id: '123', body: { title: 'Updated' } })
// taskKeys.all() AND taskKeys.detail('123') are invalidated on success
```

Invalidation scope:
- `POST` → invalidates `resourceKeys.all()`
- `PUT` / `PATCH` → invalidates `resourceKeys.all()` + `resourceKeys.detail(id)`
- `DELETE` → invalidates `resourceKeys.all()`

Your `onSuccess` callback (if provided in `options`) is called after invalidation.

## Per-resource cache timing

Use `overrides` in config to set different `staleTime` / `gcTime` per resource:

```json
{
  "input_openapi": "./openapi.json",
  "output": "./src/api",
  "stale_time": 30000,
  "gc_time": 300000,
  "overrides": {
    "platforms": { "stale_time": 86400000 },
    "settings": { "stale_time": 5000, "gc_time": 60000 }
  }
}
```

The override key is the resource name as it appears in the API path (e.g. `platforms` for `/api/v1/platforms`). Non-overridden resources use the global `stale_time` / `gc_time`.

## Use it

```tsx
import { useListTasks, useCreateTask } from './src/api/hooks'

function TaskList() {
  const { data, isLoading } = useListTasks({ status: 'open' })

  // With auto_invalidate: true, useCreateTask invalidates taskKeys.all() automatically
  const create = useCreateTask()

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
