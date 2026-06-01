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
 * Return true when the schema has at least one keyword that carries structure
 * (properties, items, additionalProperties, or composition arrays).
 * A schema with structure cannot be represented by the simple `type: [..., 'null']`
 * array form, so it must be wrapped in an anyOf union instead.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasStructuralKeywords(s: Record<string, any>): boolean {
  return (
    s['properties'] !== undefined ||
    s['items'] !== undefined ||
    (s['additionalProperties'] !== undefined && typeof s['additionalProperties'] === 'object') ||
    Array.isArray(s['allOf']) ||
    Array.isArray(s['anyOf']) ||
    Array.isArray(s['oneOf'])
  )
}

/** Handle `enum + nullable`: add null to enum values and drop the explicit type. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyNullableEnum(s: Record<string, any>): void {
  if (!(s['enum'] as unknown[]).includes(null)) {
    s['enum'] = [...(s['enum'] as unknown[]), null]
  }
  // Remove type so the generators use the literal-union path, which renders
  // every value including null correctly. Keeping type: 'string' would make
  // Zod use z.enum([...]) and cast null as the string "null".
  delete s['type']
}

/** Handle `type[] + nullable`: append 'null' to the existing array if absent. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyNullableTypeArray(s: Record<string, any>): void {
  if (!(s['type'] as string[]).includes('null')) {
    s['type'] = [...(s['type'] as string[]), 'null']
  }
}

/** Handle `primitive type + nullable`: convert to `[type, 'null']` array form. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyNullablePrimitiveType(s: Record<string, any>): void {
  s['type'] = [s['type'] as string, 'null']
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

  // Remove the 3.0 markers before any rewriting.
  delete s['nullable']
  delete s['x-nullable']

  if (Array.isArray(s['enum'])) {
    applyNullableEnum(s)
    return
  }

  if (Array.isArray(s['type'])) {
    applyNullableTypeArray(s)
    return
  }

  if (
    typeof s['type'] === 'string' &&
    PRIMITIVE_TYPES.has(s['type'] as string) &&
    !hasStructuralKeywords(s)
  ) {
    applyNullablePrimitiveType(s)
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

  walkSchemaChildren(schema as SchemaObject, visited)
}

/** Recurse into all child schemas of a non-ref schema node. */
function walkSchemaChildren(s: SchemaObject, visited: Set<AnySchema>): void {
  walkCompositionArrays(s, visited)
  walkPropertySchemas(s, visited)
  walkArrayItems(s, visited)
  walkAdditionalProperties(s, visited)
}

/** Walk allOf / anyOf / oneOf arrays. */
function walkCompositionArrays(s: SchemaObject, visited: Set<AnySchema>): void {
  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    const list = s[key] as AnySchema[] | undefined
    if (list !== undefined) {
      for (const item of list) {
        walkSchema(item, visited)
      }
    }
  }
}

/** Walk each value in `properties`. */
function walkPropertySchemas(s: SchemaObject, visited: Set<AnySchema>): void {
  if (s.properties === undefined) return
  for (const propSchema of Object.values(s.properties as Record<string, AnySchema>)) {
    walkSchema(propSchema, visited)
  }
}

/** Walk `items` when present. */
function walkArrayItems(s: SchemaObject, visited: Set<AnySchema>): void {
  const items = (s as unknown as ArraySchemaObject).items
  if (items !== undefined) {
    walkSchema(items as AnySchema, visited)
  }
}

/** Walk `additionalProperties` when it is a schema object (not a boolean). */
function walkAdditionalProperties(s: SchemaObject, visited: Set<AnySchema>): void {
  if (s.additionalProperties !== undefined && typeof s.additionalProperties === 'object') {
    walkSchema(s.additionalProperties as AnySchema, visited)
  }
}

/** Walk all schemas declared in `components.schemas`. */
function walkComponentSchemas(spec: OpenAPIV3_1.Document, visited: Set<AnySchema>): void {
  const schemas = spec.components?.schemas
  if (schemas === undefined) return
  for (const schema of Object.values(schemas)) {
    walkSchema(schema as AnySchema, visited)
  }
}

/** Walk the inline parameter schema for a single parameter or reference. */
function walkParameterSchema(
  param: OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject,
  visited: Set<AnySchema>
): void {
  if ('schema' in param && param.schema !== undefined) {
    walkSchema(param.schema as AnySchema, visited)
  }
}

/** Walk all media-type schemas inside a request body object. */
function walkRequestBody(
  requestBody: OpenAPIV3_1.RequestBodyObject | OpenAPIV3_1.ReferenceObject,
  visited: Set<AnySchema>
): void {
  if (isRef(requestBody as AnySchema)) return
  const body = requestBody as OpenAPIV3_1.RequestBodyObject
  if (body.content === undefined) return
  for (const mediaType of Object.values(body.content)) {
    if (mediaType.schema !== undefined) {
      walkSchema(mediaType.schema as AnySchema, visited)
    }
  }
}

/** Walk all media-type schemas inside every response. */
function walkResponses(responses: OpenAPIV3_1.ResponsesObject, visited: Set<AnySchema>): void {
  for (const response of Object.values(responses)) {
    if (isRef(response as AnySchema)) continue
    const r = response as OpenAPIV3_1.ResponseObject
    if (r.content === undefined) continue
    for (const mediaType of Object.values(r.content)) {
      if (mediaType.schema !== undefined) {
        walkSchema(mediaType.schema as AnySchema, visited)
      }
    }
  }
}

/** Walk all schemas referenced by a single operation. */
function walkOperation(operation: OpenAPIV3_1.OperationObject, visited: Set<AnySchema>): void {
  if (operation.parameters !== undefined) {
    for (const param of operation.parameters) {
      walkParameterSchema(param, visited)
    }
  }

  if (operation.requestBody !== undefined) {
    walkRequestBody(
      operation.requestBody as OpenAPIV3_1.RequestBodyObject | OpenAPIV3_1.ReferenceObject,
      visited
    )
  }

  if (operation.responses !== undefined) {
    walkResponses(operation.responses, visited)
  }
}

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const

/** Walk all operations in every path item of the spec. */
function walkPathSchemas(spec: OpenAPIV3_1.Document, visited: Set<AnySchema>): void {
  const paths = spec.paths
  if (paths === undefined) return

  for (const pathItem of Object.values(paths)) {
    if (pathItem == null || typeof pathItem !== 'object') continue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pi = pathItem as Record<string, any>
    for (const method of HTTP_METHODS) {
      const op = pi[method]
      if (op == null || typeof op !== 'object') continue
      walkOperation(op as OpenAPIV3_1.OperationObject, visited)
    }
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
  walkComponentSchemas(spec, visited)
  walkPathSchemas(spec, visited)
}
