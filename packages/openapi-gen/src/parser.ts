import SwaggerParser from '@apidevtools/swagger-parser'
import type { OpenAPIV3_1 } from 'openapi-types'
import { assertBoundedDepth } from './utils/schema-depth.js'

export async function parseSpec(inputPath: string): Promise<OpenAPIV3_1.Document> {
  const api = (await SwaggerParser.bundle(inputPath)) as OpenAPIV3_1.Document

  // Security: reject pathologically deep inline schemas before any recursive
  // generation pass runs, so a hostile spec cannot crash the build with a
  // stack-overflow DoS. This is the shared parse entry for all generators
  // (types, client, zod, server, react-query). Cyclic $refs are handled by the
  // bundler + visited sets; this bounds raw inline nesting depth.
  for (const schema of Object.values(api.components?.schemas ?? {})) {
    assertBoundedDepth(schema)
  }

  return api
}
