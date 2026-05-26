import type { OpenAPIV3_1 } from 'openapi-types'

type OperationObject = OpenAPIV3_1.OperationObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject

export interface HookGenOptions {
  staleTime: number
  gcTime: number
  suspense?: boolean
  overrides?: Record<string, { staleTime: number; gcTime: number }>
  autoInvalidate?: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRef(obj: unknown): obj is ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj
}

function refToName(ref: string): string {
  const parts = ref.split('/')
  return parts[parts.length - 1]!
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const SUPPORTED_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const
type SupportedMethod = (typeof SUPPORTED_METHODS)[number]

// Mirrors deriveOperationName from openapi-gen/src/plugins/client.ts
function deriveOperationName(method: string, path: string): string {
  const prefixMap: Record<string, string> = {
    get: 'get',
    post: 'create',
    put: 'update',
    patch: 'patch',
    delete: 'delete',
  }
  const prefix = prefixMap[method] ?? method

  // Strip /api/v1/ prefix
  let segments = path.replace(/^\/api\/v\d+\//, '').replace(/^\//, '')

  const parts = segments.split('/').map((seg) => {
    if (seg.startsWith('{') && seg.endsWith('}')) {
      const name = seg.slice(1, -1)
      return 'By' + name.charAt(0).toUpperCase() + name.slice(1)
    }
    return seg.charAt(0).toUpperCase() + seg.slice(1)
  })

  const joined = parts.join('')
  return prefix + joined
}

function extractPathParams(path: string): string[] {
  const matches = path.match(/\{([^}]+)\}/g)
  if (matches === null) return []
  return matches.map((m) => m.slice(1, -1))
}

/** Extract primary resource name from path (first static segment after stripping API prefix) */
function primaryResource(path: string): string {
  // Strip /api/v{N}/ prefix or leading /
  const stripped = path.replace(/^\/api\/v\d+\//, '').replace(/^\//, '')
  const firstSegment = stripped.split('/')[0] ?? 'resource'
  // Remove any path param braces if somehow first seg is param
  return firstSegment.replace(/[{}]/g, '')
}

/** Convert tag to valid camelCase identifier, then singularize. e.g. page-selections → pageSelection */
function toKeyFactoryName(resource: string): string {
  // kebab-case and snake_case → camelCase
  const camel = resource.replace(/[-_](.)/g, (_, c: string) => c.toUpperCase())
  // simple singularization: trailing 's'
  return camel.endsWith('s') ? camel.slice(0, -1) : camel
}

interface OperationMeta {
  funcName: string
  hookName: string
  method: SupportedMethod
  path: string
  pathParams: string[]
  hasBody: boolean
  bodyTypeName: string | undefined
  hasQueryParams: boolean
  hasRequiredQueryParams: boolean
  deprecated: boolean
}

function getBodyInfo(operation: OperationObject): { hasBody: boolean; bodyTypeName: string | undefined } {
  const requestBody = operation.requestBody as OpenAPIV3_1.RequestBodyObject | ReferenceObject | undefined
  if (requestBody === undefined) return { hasBody: false, bodyTypeName: undefined }
  if (isRef(requestBody)) return { hasBody: true, bodyTypeName: undefined }

  const rb = requestBody as OpenAPIV3_1.RequestBodyObject
  const content = rb.content as Record<string, { schema?: OpenAPIV3_1.SchemaObject | ReferenceObject }> | undefined
  if (content === undefined) return { hasBody: true, bodyTypeName: undefined }

  // Check multipart first
  if (content['multipart/form-data'] !== undefined) {
    return { hasBody: true, bodyTypeName: undefined }
  }

  const jsonContent = content['application/json']
  if (jsonContent === undefined || jsonContent.schema === undefined) {
    return { hasBody: true, bodyTypeName: undefined }
  }

  const schema = jsonContent.schema
  if (isRef(schema)) {
    return { hasBody: true, bodyTypeName: refToName((schema as ReferenceObject).$ref) }
  }

  // Inline schema
  const s = schema as OpenAPIV3_1.SchemaObject
  if (s.type === 'object') {
    return { hasBody: true, bodyTypeName: 'Record<string, unknown>' }
  }
  return { hasBody: true, bodyTypeName: undefined }
}

// ── Key factory generation ─────────────────────────────────────────────────────

interface KeyEntry {
  key: string         // e.g. 'list' | 'detail' | operationId-derived
  funcName: string    // function to use in key factory
  pathParams: string[]
  hasQueryParams: boolean
  hasRequiredQueryParams: boolean
}

function buildKeyFactory(resource: string, entries: KeyEntry[]): string {
  const factoryName = `${toKeyFactoryName(resource)}Keys`
  const lines: string[] = []
  lines.push(`export const ${factoryName} = {`)
  lines.push(`  all: () => ['${resource}'] as const,`)

  for (const entry of entries) {
    const paramsOptional = !entry.hasRequiredQueryParams
    const paramsArg = paramsOptional
      ? `params?: Parameters<typeof ${entry.funcName}>[${entry.pathParams.length}]`
      : `params: Parameters<typeof ${entry.funcName}>[${entry.pathParams.length}]`

    // When multiple detail-level GET ops share the same resource (e.g. GET /items/{id}
    // and GET /items/{id}/usage), each gets a funcName-derived key instead of 'detail'.
    // Include the key name as a segment to prevent cache key collisions.
    // Single detail ops keep the canonical ['resource', id] shape (no breaking change).
    const keySegment = entry.pathParams.length > 0 && entry.key !== 'detail' ? `'${entry.key}', ` : ''

    if (entry.pathParams.length === 0 && entry.hasQueryParams) {
      // list: (params?) => ['resource', 'list', params]
      lines.push(`  ${entry.key}: (${paramsArg}) => ['${resource}', '${entry.key}', params] as const,`)
    } else if (entry.pathParams.length === 0 && !entry.hasQueryParams) {
      // list with no params
      lines.push(`  ${entry.key}: () => ['${resource}', '${entry.key}'] as const,`)
    } else if (entry.pathParams.length === 1 && !entry.hasQueryParams) {
      // detail: (id) => ['resource', id]  or  getItemUsage: (id) => ['resource', 'getItemUsage', id]
      const param = entry.pathParams[0]!
      lines.push(`  ${entry.key}: (${param}: string) => ['${resource}', ${keySegment}${param}] as const,`)
    } else if (entry.pathParams.length === 1 && entry.hasQueryParams) {
      // detail with query params
      const param = entry.pathParams[0]!
      lines.push(`  ${entry.key}: (${param}: string, ${paramsArg}) => ['${resource}', ${keySegment}${param}, params] as const,`)
    } else if (!entry.hasQueryParams) {
      // multiple path params, no query params
      const paramList = entry.pathParams.map((p) => `${p}: string`).join(', ')
      const paramValues = entry.pathParams.join(', ')
      lines.push(`  ${entry.key}: (${paramList}) => ['${resource}', ${keySegment}${paramValues}] as const,`)
    } else {
      // multiple path params + query params
      const paramList = entry.pathParams.map((p) => `${p}: string`).join(', ')
      const paramValues = entry.pathParams.join(', ')
      lines.push(`  ${entry.key}: (${paramList}, ${paramsArg}) => ['${resource}', ${keySegment}${paramValues}, params] as const,`)
    }
  }

  lines.push(`}`)
  return lines.join('\n')
}

// ── Query hook generation ──────────────────────────────────────────────────────

function buildQueryHook(
  op: OperationMeta,
  keyFactoryName: string,
  keyEntry: KeyEntry,
  staleTime: number,
  gcTime: number,
): string {
  const lines: string[] = []

  const hasQueryParams = keyEntry.hasQueryParams
  const paramsRequired = keyEntry.hasRequiredQueryParams
  const pathParams = op.pathParams
  const hasPathParams = pathParams.length > 0

  // Build parameter list
  const sigParts: string[] = []
  for (const p of pathParams) {
    // Widen path param types to allow nullish values — enables auto-disable without !!id boilerplate
    sigParts.push(`${p}: string | undefined | null`)
  }
  if (hasQueryParams) {
    const paramsToken = paramsRequired ? 'params' : 'params?'
    sigParts.push(`${paramsToken}: Parameters<typeof ${op.funcName}>[${pathParams.length}]`)
  }
  sigParts.push(`options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof ${op.funcName}>>, ApiError>, 'queryKey' | 'queryFn'>`)

  // Build queryKey call — use non-null assertions since enabled guard ensures non-null at runtime
  let queryKeyCall: string
  if (pathParams.length === 0 && hasQueryParams) {
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(params)`
  } else if (pathParams.length === 0 && !hasQueryParams) {
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}()`
  } else if (pathParams.length === 1 && !hasQueryParams) {
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(${pathParams[0]}!)`
  } else if (pathParams.length === 1 && hasQueryParams) {
    // path param + query params
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(${pathParams[0]}!, params)`
  } else if (!hasQueryParams) {
    // multiple path params, no query params
    const paramValues = pathParams.map((p) => `${p}!`).join(', ')
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(${paramValues})`
  } else {
    // multiple path params + query params
    const paramValues = pathParams.map((p) => `${p}!`).join(', ')
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(${paramValues}, params)`
  }

  // Build queryFn call — use non-null assertions
  let queryFnArgs: string[] = pathParams.map((p) => `${p}!`)
  if (hasQueryParams) queryFnArgs.push('params')
  const queryFnCall = `${op.funcName}(${queryFnArgs.join(', ')})`

  // Build enabled expression for path-param hooks
  const enabledExpr = hasPathParams
    ? `${pathParams.map((p) => `${p} != null`).join(' && ')} && (options?.enabled ?? true)`
    : undefined

  // @deprecated JSDoc on deprecated operations
  if (op.deprecated) {
    lines.push(`/** @deprecated */`)
  }
  lines.push(`export function ${op.hookName}(`)
  lines.push(`  ${sigParts.join(',\n  ')},`)
  lines.push(`) {`)
  lines.push(`  return useQuery<Awaited<ReturnType<typeof ${op.funcName}>>, ApiError>({`)
  lines.push(`    queryKey: ${queryKeyCall},`)
  lines.push(`    queryFn: () => ${queryFnCall},`)
  lines.push(`    staleTime: ${staleTime},`)
  lines.push(`    gcTime: ${gcTime},`)
  if (enabledExpr !== undefined) {
    lines.push(`    enabled: ${enabledExpr},`)
  }
  lines.push(`    ...options,`)
  lines.push(`  })`)
  lines.push(`}`)

  return lines.join('\n')
}

function buildSuspenseQueryHook(
  op: OperationMeta,
  keyFactoryName: string,
  keyEntry: KeyEntry,
  staleTime: number,
  gcTime: number,
): string {
  const lines: string[] = []

  const hasQueryParams = keyEntry.hasQueryParams
  const paramsRequired = keyEntry.hasRequiredQueryParams
  const pathParams = op.pathParams

  // Suspense hooks require path params (no nullish widening — suspense doesn't support enabled)
  const sigParts: string[] = []
  for (const p of pathParams) {
    sigParts.push(`${p}: string`)
  }
  if (hasQueryParams) {
    const paramsToken = paramsRequired ? 'params' : 'params?'
    sigParts.push(`${paramsToken}: Parameters<typeof ${op.funcName}>[${pathParams.length}]`)
  }
  sigParts.push(`options?: Omit<UseSuspenseQueryOptions<Awaited<ReturnType<typeof ${op.funcName}>>, ApiError>, 'queryKey' | 'queryFn'>`)

  // Build queryKey call
  let queryKeyCall: string
  if (pathParams.length === 0 && hasQueryParams) {
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(params)`
  } else if (pathParams.length === 0 && !hasQueryParams) {
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}()`
  } else if (pathParams.length === 1 && !hasQueryParams) {
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(${pathParams[0]})`
  } else if (pathParams.length === 1 && hasQueryParams) {
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(${pathParams[0]}, params)`
  } else if (!hasQueryParams) {
    const paramValues = pathParams.join(', ')
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(${paramValues})`
  } else {
    const paramValues = pathParams.join(', ')
    queryKeyCall = `${keyFactoryName}.${keyEntry.key}(${paramValues}, params)`
  }

  // Build queryFn call
  const queryFnArgs: string[] = [...pathParams]
  if (hasQueryParams) queryFnArgs.push('params')
  const queryFnCall = `${op.funcName}(${queryFnArgs.join(', ')})`

  const suspenseHookName = `useSuspense${capitalize(op.funcName)}`

  if (op.deprecated) {
    lines.push(`/** @deprecated */`)
  }
  lines.push(`export function ${suspenseHookName}(`)
  lines.push(`  ${sigParts.join(',\n  ')},`)
  lines.push(`) {`)
  lines.push(`  return useSuspenseQuery<Awaited<ReturnType<typeof ${op.funcName}>>, ApiError>({`)
  lines.push(`    queryKey: ${queryKeyCall},`)
  lines.push(`    queryFn: () => ${queryFnCall},`)
  lines.push(`    staleTime: ${staleTime},`)
  lines.push(`    gcTime: ${gcTime},`)
  lines.push(`    ...options,`)
  lines.push(`  })`)
  lines.push(`}`)

  return lines.join('\n')
}

// ── Mutation hook generation ───────────────────────────────────────────────────

interface MutationInvalidateInfo {
  keyFactoryName: string
  detailKeyName: string | undefined
}

function buildMutationHook(
  op: OperationMeta,
  autoInvalidate: boolean,
  invalidateInfo: MutationInvalidateInfo | undefined,
): string {
  const lines: string[] = []
  const { funcName, hookName, pathParams, hasBody, hasQueryParams } = op

  // Determine variables type and mutationFn
  // The client function argument order is: ...pathParams, body?, params?
  // We must match exactly what the generated client function expects.
  let variablesType: string
  let mutationFnBody: string

  // Compute the index of the params argument in the client function signature
  const paramsArgIndex = pathParams.length + (hasBody ? 1 : 0)

  if (pathParams.length === 0 && !hasBody && !hasQueryParams) {
    variablesType = 'void'
    mutationFnBody = `() => ${funcName}()`
  } else if (pathParams.length === 0 && !hasBody && hasQueryParams) {
    // params-only mutation: fn(params)
    variablesType = `Parameters<typeof ${funcName}>[0]`
    mutationFnBody = `(vars) => ${funcName}(vars)`
  } else if (pathParams.length === 0 && hasBody && !hasQueryParams) {
    // body-only mutation: fn(body)
    variablesType = `Parameters<typeof ${funcName}>[0]`
    mutationFnBody = `(vars) => ${funcName}(vars)`
  } else if (pathParams.length === 0 && hasBody && hasQueryParams) {
    // body + params: fn(body, params)
    variablesType = `{ body: Parameters<typeof ${funcName}>[0]; params: Parameters<typeof ${funcName}>[${paramsArgIndex}] }`
    mutationFnBody = `({ body, params }) => ${funcName}(body, params)`
  } else if (pathParams.length === 1 && !hasBody && !hasQueryParams) {
    variablesType = 'string'
    mutationFnBody = `(${pathParams[0]}) => ${funcName}(${pathParams[0]})`
  } else if (pathParams.length === 1 && !hasBody && hasQueryParams) {
    // 1 path param + params only
    const param = pathParams[0]!
    variablesType = `{ ${param}: string; params: Parameters<typeof ${funcName}>[${paramsArgIndex}] }`
    mutationFnBody = `({ ${param}, params }) => ${funcName}(${param}, params)`
  } else if (pathParams.length === 1 && hasBody && !hasQueryParams) {
    const param = pathParams[0]!
    variablesType = `{ ${param}: string; body: Parameters<typeof ${funcName}>[1] }`
    mutationFnBody = `({ ${param}, body }) => ${funcName}(${param}, body)`
  } else if (pathParams.length === 1 && hasBody && hasQueryParams) {
    // 1 path param + body + params
    const param = pathParams[0]!
    variablesType = `{ ${param}: string; body: Parameters<typeof ${funcName}>[1]; params: Parameters<typeof ${funcName}>[${paramsArgIndex}] }`
    mutationFnBody = `({ ${param}, body, params }) => ${funcName}(${param}, body, params)`
  } else if (pathParams.length > 1 && !hasBody && !hasQueryParams) {
    const fields = pathParams.map((p) => `${p}: string`).join('; ')
    variablesType = `{ ${fields} }`
    const destructured = pathParams.join(', ')
    mutationFnBody = `({ ${destructured} }) => ${funcName}(${destructured})`
  } else if (pathParams.length > 1 && !hasBody && hasQueryParams) {
    // multiple path params + params only
    const fields = pathParams.map((p) => `${p}: string`).join('; ')
    variablesType = `{ ${fields}; params: Parameters<typeof ${funcName}>[${paramsArgIndex}] }`
    const destructured = [...pathParams, 'params'].join(', ')
    mutationFnBody = `({ ${destructured} }) => ${funcName}(${[...pathParams, 'params'].join(', ')})`
  } else if (pathParams.length > 1 && hasBody && !hasQueryParams) {
    // multiple path params + body
    const fields = pathParams.map((p) => `${p}: string`).join('; ')
    variablesType = `{ ${fields}; body: Parameters<typeof ${funcName}>[${pathParams.length}] }`
    const destructured = [...pathParams, 'body'].join(', ')
    mutationFnBody = `({ ${destructured} }) => ${funcName}(${[...pathParams, 'body'].join(', ')})`
  } else {
    // multiple path params + body + params
    const fields = pathParams.map((p) => `${p}: string`).join('; ')
    variablesType = `{ ${fields}; body: Parameters<typeof ${funcName}>[${pathParams.length}]; params: Parameters<typeof ${funcName}>[${paramsArgIndex}] }`
    const destructured = [...pathParams, 'body', 'params'].join(', ')
    mutationFnBody = `({ ${destructured} }) => ${funcName}(${[...pathParams, 'body', 'params'].join(', ')})`
  }

  // @deprecated JSDoc on deprecated operations
  if (op.deprecated) {
    lines.push(`/** @deprecated */`)
  }
  lines.push(`export function ${hookName}(`)
  lines.push(`  options?: Omit<UseMutationOptions<Awaited<ReturnType<typeof ${funcName}>>, ApiError, ${variablesType}>, 'mutationFn'>,`)
  lines.push(`) {`)

  const shouldInvalidate = autoInvalidate && invalidateInfo !== undefined
  if (shouldInvalidate) {
    lines.push(`  const queryClient = useQueryClient()`)
  }

  lines.push(`  return useMutation<Awaited<ReturnType<typeof ${funcName}>>, ApiError, ${variablesType}>({`)
  lines.push(`    mutationFn: ${mutationFnBody},`)
  // Spread options first so caller can override mutationFn-unrelated options (e.g. retry, meta).
  // onSuccess must come AFTER the spread so the auto-invalidation logic always runs —
  // the caller's onSuccess is composed via options?.onSuccess?.(...args) inside.
  lines.push(`    ...options,`)

  if (shouldInvalidate) {
    const { keyFactoryName, detailKeyName } = invalidateInfo
    const canInvalidateDetail =
      detailKeyName !== undefined &&
      pathParams.length >= 1 &&
      (op.method === 'put' || op.method === 'patch')

    // Determine how to reference the first path param from variables in onSuccess
    let detailIdRef: string
    if (pathParams.length === 1 && !hasBody && !hasQueryParams) {
      // variablesType is 'string' — variables IS the id directly
      detailIdRef = 'variables'
    } else if (pathParams.length >= 1) {
      // variablesType is an object — access via property name
      detailIdRef = `variables.${pathParams[0]}`
    } else {
      detailIdRef = 'variables'
    }

    lines.push(`    onSuccess: (...args) => {`)
    if (canInvalidateDetail) {
      lines.push(`      const [, variables] = args`)
    }
    lines.push(`      queryClient.invalidateQueries({ queryKey: ${keyFactoryName}.all() })`)
    if (canInvalidateDetail) {
      lines.push(`      queryClient.invalidateQueries({ queryKey: ${keyFactoryName}.${detailKeyName}(${detailIdRef}) })`)
    }
    lines.push(`      options?.onSuccess?.(...args)`)
    lines.push(`    },`)
  }

  lines.push(`  })`)
  lines.push(`}`)

  return lines.join('\n')
}

// ── hasQueryParams detection ───────────────────────────────────────────────────

function operationHasQueryParams(operation: OperationObject): boolean {
  const params = operation.parameters as (OpenAPIV3_1.ParameterObject | ReferenceObject)[] | undefined
  if (params === undefined) return false
  return params.some((p) => {
    if (isRef(p)) return false
    const param = p as OpenAPIV3_1.ParameterObject
    return param.in === 'query'
  })
}

/** Returns true if any query parameter has required: true */
function operationHasRequiredQueryParams(operation: OperationObject): boolean {
  const params = operation.parameters as (OpenAPIV3_1.ParameterObject | ReferenceObject)[] | undefined
  if (params === undefined) return false
  return params.some((p) => {
    if (isRef(p)) return false
    const param = p as OpenAPIV3_1.ParameterObject
    return param.in === 'query' && param.required === true
  })
}

// ── Main generator ─────────────────────────────────────────────────────────────

export function generateHooks(
  spec: OpenAPIV3_1.Document,
  options: HookGenOptions,
): { filename: string; content: string } {
  const { staleTime, gcTime, suspense = false, autoInvalidate = false } = options
  const paths = spec.paths as Record<string, Record<string, OperationObject>> | undefined

  // Collect all operations
  const operations: OperationMeta[] = []

  if (paths !== undefined) {
    for (const [path, pathItem] of Object.entries(paths)) {
      for (const method of SUPPORTED_METHODS) {
        const operation = pathItem[method] as OperationObject | undefined
        if (operation === undefined) continue

        let funcName: string
        if (operation.operationId !== undefined) {
          const id = operation.operationId
          funcName = id.charAt(0).toLowerCase() + id.slice(1)
        } else {
          funcName = deriveOperationName(method, path)
        }

        const hookName = 'use' + capitalize(funcName)
        const pathParams = extractPathParams(path)
        const { hasBody, bodyTypeName } = getBodyInfo(operation)
        const hasQueryParams = operationHasQueryParams(operation)
        const hasRequiredQueryParams = operationHasRequiredQueryParams(operation)
        const deprecated = operation.deprecated === true

        operations.push({
          funcName,
          hookName,
          method,
          path,
          pathParams,
          hasBody,
          bodyTypeName,
          hasQueryParams,
          hasRequiredQueryParams,
          deprecated,
        })
      }
    }
  }

  // Separate GET vs mutation operations
  const getOps = operations.filter((op) => op.method === 'get')
  const mutationOps = operations.filter((op) => op.method !== 'get')

  // Group GET ops by resource for key factories
  const resourceToGetOps = new Map<string, OperationMeta[]>()
  for (const op of getOps) {
    const resource = primaryResource(op.path)
    const existing = resourceToGetOps.get(resource) ?? []
    existing.push(op)
    resourceToGetOps.set(resource, existing)
  }

  // Build key factories and track which key factory + entry each GET op uses
  const opToKeyInfo = new Map<string, { factoryName: string; keyEntry: KeyEntry }>()
  const keyFactoryBlocks: string[] = []

  for (const [resource, ops] of resourceToGetOps.entries()) {
    const factoryName = `${toKeyFactoryName(resource)}Keys`

    // Determine entry keys — list vs detail, or operationId-derived if ambiguous
    const listOps = ops.filter((op) => op.pathParams.length === 0)
    const detailOps = ops.filter((op) => op.pathParams.length > 0)

    const entries: KeyEntry[] = []

    if (listOps.length === 1) {
      const op = listOps[0]!
      const entry: KeyEntry = {
        key: 'list',
        funcName: op.funcName,
        pathParams: [],
        hasQueryParams: op.hasQueryParams,
        hasRequiredQueryParams: op.hasRequiredQueryParams,
      }
      entries.push(entry)
      opToKeyInfo.set(op.funcName, { factoryName, keyEntry: entry })
    } else if (listOps.length > 1) {
      for (const op of listOps) {
        const entry: KeyEntry = {
          key: op.funcName,
          funcName: op.funcName,
          pathParams: [],
          hasQueryParams: op.hasQueryParams,
          hasRequiredQueryParams: op.hasRequiredQueryParams,
        }
        entries.push(entry)
        opToKeyInfo.set(op.funcName, { factoryName, keyEntry: entry })
      }
    }

    if (detailOps.length === 1) {
      const op = detailOps[0]!
      const entry: KeyEntry = {
        key: 'detail',
        funcName: op.funcName,
        pathParams: op.pathParams,
        hasQueryParams: op.hasQueryParams,
        hasRequiredQueryParams: op.hasRequiredQueryParams,
      }
      entries.push(entry)
      opToKeyInfo.set(op.funcName, { factoryName, keyEntry: entry })
    } else if (detailOps.length > 1) {
      for (const op of detailOps) {
        const entry: KeyEntry = {
          key: op.funcName,
          funcName: op.funcName,
          pathParams: op.pathParams,
          hasQueryParams: op.hasQueryParams,
          hasRequiredQueryParams: op.hasRequiredQueryParams,
        }
        entries.push(entry)
        opToKeyInfo.set(op.funcName, { factoryName, keyEntry: entry })
      }
    }

    keyFactoryBlocks.push(buildKeyFactory(resource, entries))
  }

  // Build query hooks (and suspense variants if enabled)
  const queryHookBlocks: string[] = []
  for (const op of getOps) {
    const info = opToKeyInfo.get(op.funcName)
    if (info === undefined) continue
    const { factoryName, keyEntry } = info
    const resource = primaryResource(op.path)
    const resourceOverride = options.overrides?.[resource]
    const effectiveStaleTime = resourceOverride?.staleTime ?? staleTime
    const effectiveGcTime = resourceOverride?.gcTime ?? gcTime
    queryHookBlocks.push(buildQueryHook(op, factoryName, keyEntry, effectiveStaleTime, effectiveGcTime))
    if (suspense) {
      queryHookBlocks.push(buildSuspenseQueryHook(op, factoryName, keyEntry, effectiveStaleTime, effectiveGcTime))
    }
  }

  // Build resource → detailKeyName map for auto-invalidate
  // detailKeyName is 'detail' when exactly one detail op exists (canonical name),
  // or undefined when zero or multiple detail ops exist (ambiguous — skip detail invalidation)
  const resourceDetailKeyName = new Map<string, string | undefined>()
  for (const [resource, ops] of resourceToGetOps.entries()) {
    const detailOps = ops.filter((op) => op.pathParams.length > 0)
    resourceDetailKeyName.set(resource, detailOps.length === 1 ? 'detail' : undefined)
  }

  // Build mutation hooks
  const mutationHookBlocks: string[] = []
  for (const op of mutationOps) {
    let invalidateInfo: MutationInvalidateInfo | undefined
    if (autoInvalidate) {
      const resource = primaryResource(op.path)
      // Only invalidate if a key factory exists for this resource (i.e. it has at least one GET op).
      // A mutation-only resource has no key factory — emitting invalidateQueries against it would
      // reference an undefined variable and crash at runtime.
      if (resourceToGetOps.has(resource)) {
        const keyFactoryName = `${toKeyFactoryName(resource)}Keys`
        const detailKeyName = resourceDetailKeyName.get(resource)
        invalidateInfo = { keyFactoryName, detailKeyName }
      }
    }
    mutationHookBlocks.push(buildMutationHook(op, autoInvalidate, invalidateInfo))
  }

  // Determine which react-query exports to import
  const needsUseQuery = getOps.length > 0
  const needsUseMutation = mutationOps.length > 0
  const needsUseSuspenseQuery = suspense && getOps.length > 0
  const needsUseQueryClient = autoInvalidate && needsUseMutation
  const rqImports: string[] = []
  if (needsUseQuery) rqImports.push('useQuery', 'type UseQueryOptions')
  if (needsUseSuspenseQuery) rqImports.push('useSuspenseQuery', 'type UseSuspenseQueryOptions')
  if (needsUseMutation) rqImports.push('useMutation', 'type UseMutationOptions')
  if (needsUseQueryClient) rqImports.push('useQueryClient')

  // Collect all function names for client import
  const allFuncNames = operations.map((op) => op.funcName).sort()

  // Build file content
  const lines: string[] = []
  lines.push('// This file is auto-generated by @codewithagents/openapi-react-query — do not edit')
  lines.push('')
  if (rqImports.length > 0) {
    lines.push(`import { ${rqImports.join(', ')} } from '@tanstack/react-query'`)
  }
  if (allFuncNames.length > 0) {
    lines.push(`import { ${allFuncNames.join(', ')}, type ApiError } from './client.js'`)
  } else {
    lines.push(`import { type ApiError } from './client.js'`)
  }
  lines.push('')

  if (keyFactoryBlocks.length > 0) {
    lines.push('// ── Query key factories ──────────────────────────────────────')
    lines.push('')
    lines.push(keyFactoryBlocks.join('\n\n'))
    lines.push('')
  }

  if (queryHookBlocks.length > 0) {
    lines.push('// ── Queries ──────────────────────────────────────────────────')
    lines.push('')
    lines.push(queryHookBlocks.join('\n\n'))
    lines.push('')
  }

  if (mutationHookBlocks.length > 0) {
    lines.push('// ── Mutations ────────────────────────────────────────────────')
    lines.push('')
    lines.push(mutationHookBlocks.join('\n\n'))
    lines.push('')
  }

  return {
    filename: 'hooks.ts',
    content: lines.join('\n'),
  }
}
