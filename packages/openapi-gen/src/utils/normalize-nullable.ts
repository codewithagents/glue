import type { OpenAPIV3_1 } from 'openapi-types'

type SchemaObject = OpenAPIV3_1.SchemaObject
type ArraySchemaObject = OpenAPIV3_1.ArraySchemaObject
type ReferenceObject = OpenAPIV3_1.ReferenceObject
type AnySchema = SchemaObject | ReferenceObject

function isRef(schema: AnySchema): schema is ReferenceObject {
  return '$ref' in schema
}

/** The set of `type` values the array-form null union renders correctly. */
const PRIMITIVE_TYPES = new Set(['string', 'number', 'integer', 'boolean'])

/**
 * Wrap the current node in an `anyOf` union with `{ type: 'null' }`, preserving
 * the original schema as the first member. Used whenever the node has structure
 * (object/array/composition) that the primitive `type: [..., 'null']` array form
 * cannot represent: the array form's render path in types.ts / zod.ts only knows
 * how to map primitives, so an object would collapse to `unknown | null`.
 */
function wrapInNullableAnyOf(s: Record<string, unknown>): void {
  const innerCopy: Record<string, unknown> = {}
  for (const key of Object.keys(s)) {
    innerCopy[key] = s[key]
  }
  for (const key of Object.keys(s)) {
    delete s[key]
  }
  s['anyOf'] = [innerCopy, { type: 'null' }]
}

/**
 * Normalize a single schema node in-place.
 *
 * Rules:
 * - `nullable: true` or `x-nullable: true` triggers conversion.
 * - Primitive `{ type: 'string', nullable: true }` becomes `{ type: ['string', 'null'] }`
 *   (the clean array form the generators render as `string | null` / `.nullable()`).
 * - `{ type: ['string','number'], nullable: true }` appends `'null'` if absent.
 * - `{ enum: [...], nullable: true }` adds `null` to the enum values if absent and
 *   drops the explicit type so the generators use the literal-union path (which
 *   renders `| null` in TS and `z.literal(null)` in Zod, the correct runtime shape).
 * - Anything with STRUCTURE (object/array type, properties, items,
 *   additionalProperties, allOf/anyOf/oneOf, or no type at all) is wrapped in
 *   `anyOf: [<original>, { type: 'null' }]`. The array form cannot carry that
 *   structure (it would collapse an object to `unknown | null`), but the anyOf
 *   path renders each member recursively, so `{ ... } | null` is preserved.
 * - The `nullable` and `x-nullable` keys are removed after conversion so they do
 *   not leak into generated output.
 */
function normalizeNode(schema: SchemaObject): void {
  // Use a loose cast for reading/writing the 3.0-only keys that openapi-types
  // does not model in its 3.1 type definitions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = schema as Record<string, any>

  const isNullable = s['nullable'] === true || s['x-nullable'] === true
  if (!isNullable) return

  // Remove the 3.0 markers before any rewriting
  delete s['nullable']
  delete s['x-nullable']

  // enum present. Add null to enum values and remove the explicit type so the
  // schema falls into the "mixed/untyped enum" path in the generators. That path
  // renders every value — including null — as a literal union, which is correct
  // for both TypeScript (| null) and Zod (z.literal(null)). Keeping type: 'string'
  // would make Zod use z.enum([...]) and cast null as the string "null", which is
  // the wrong runtime behaviour.
  if (Array.isArray(s['enum'])) {
    if (!(s['enum'] as unknown[]).includes(null)) {
      s['enum'] = [...(s['enum'] as unknown[]), null]
    }
    delete s['type']
    return
  }

  // type is already an array (3.1 form). Append 'null' if not already present.
  if (Array.isArray(s['type'])) {
    if (!(s['type'] as string[]).includes('null')) {
      s['type'] = [...(s['type'] as string[]), 'null']
    }
    return
  }

  // A single PRIMITIVE type with no structural keywords is the only case the
  // clean array form handles: convert `'string'` to `['string', 'null']`.
  const hasStructure =
    s['properties'] !== undefined ||
    s['items'] !== undefined ||
    (s['additionalProperties'] !== undefined && typeof s['additionalProperties'] === 'object') ||
    Array.isArray(s['allOf']) ||
    Array.isArray(s['anyOf']) ||
    Array.isArray(s['oneOf'])

  if (typeof s['type'] === 'string' && PRIMITIVE_TYPES.has(s['type'] as string) && !hasStructure) {
    s['type'] = [s['type'] as string, 'null']
    return
  }

  // Everything else (object/array type, structured schema, or a bare schema with
  // no type) is wrapped in an anyOf union so its structure is preserved.
  wrapInNullableAnyOf(s)
}

/**
 * Walk a schema tree recursively, normalising every nullable node in-place.
 *
 * A visited Set guards against infinite loops from shared object references
 * (possible in bundled specs where multiple fields share the same schema object).
 */
function walkSchema(schema: AnySchema, visited: Set<AnySchema>): void {
  if (visited.has(schema)) return
  visited.add(schema)

  if (isRef(schema)) return

  // Normalize this node first, then recurse into children.
  normalizeNode(schema as SchemaObject)

  const s = schema as SchemaObject

  // Composition arrays
  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    const list = s[key] as AnySchema[] | undefined
    if (list !== undefined) {
      for (const item of list) {
        walkSchema(item, visited)
      }
    }
  }

  // Properties
  if (s.properties !== undefined) {
    for (const propSchema of Object.values(
      s.properties as Record<string, AnySchema>
    )) {
      walkSchema(propSchema, visited)
    }
  }

  // Array items
  const items = (s as unknown as ArraySchemaObject).items
  if (items !== undefined) {
    walkSchema(items as AnySchema, visited)
  }

  // additionalProperties (only when it is a schema, not a boolean)
  if (s.additionalProperties !== undefined && typeof s.additionalProperties === 'object') {
    walkSchema(s.additionalProperties as AnySchema, visited)
  }
}

/**
 * Normalise all `nullable: true` / `x-nullable: true` usages in the spec into
 * the OpenAPI 3.1 null-union form so the types and zod plugins pick them up
 * through their existing `'null'`-in-type-union logic.
 *
 * Operates in-place on the document passed from `parseSpec()`. Call this once
 * immediately after bundling, before any plugin runs.
 */
export function normalizeNullable(spec: OpenAPIV3_1.Document): void {
  const visited = new Set<AnySchema>()

  // Walk top-level component schemas
  const schemas = spec.components?.schemas
  if (schemas !== undefined) {
    for (const schema of Object.values(schemas)) {
      walkSchema(schema as AnySchema, visited)
    }
  }

  // Also walk inline request/response body and parameter schemas so nullable
  // path/body params are normalised alongside component schemas.
  const paths = spec.paths
  if (paths !== undefined) {
    for (const pathItem of Object.values(paths)) {
      if (pathItem == null || typeof pathItem !== 'object') continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pi = pathItem as Record<string, any>
      for (const method of [
        'get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace',
      ]) {
        const op = pi[method]
        if (op == null || typeof op !== 'object') continue
        const operation = op as OpenAPIV3_1.OperationObject

        // Parameters
        if (operation.parameters !== undefined) {
          for (const param of operation.parameters) {
            if ('schema' in param && param.schema !== undefined) {
              walkSchema(param.schema as AnySchema, visited)
            }
          }
        }

        // Request body
        const requestBody = operation.requestBody
        if (
          requestBody !== undefined &&
          !isRef(requestBody as AnySchema) &&
          (requestBody as OpenAPIV3_1.RequestBodyObject).content !== undefined
        ) {
          for (const mediaType of Object.values(
            (requestBody as OpenAPIV3_1.RequestBodyObject).content
          )) {
            if (mediaType.schema !== undefined) {
              walkSchema(mediaType.schema as AnySchema, visited)
            }
          }
        }

        // Responses
        const responses = operation.responses
        if (responses !== undefined) {
          for (const response of Object.values(responses)) {
            if (isRef(response as AnySchema)) continue
            const r = response as OpenAPIV3_1.ResponseObject
            if (r.content !== undefined) {
              for (const mediaType of Object.values(r.content)) {
                if (mediaType.schema !== undefined) {
                  walkSchema(mediaType.schema as AnySchema, visited)
                }
              }
            }
          }
        }
      }
    }
  }
}
