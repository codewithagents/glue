import SwaggerParser from '@apidevtools/swagger-parser'
import type { OpenAPIV3_1 } from 'openapi-types'

export async function parseSpec(inputPath: string): Promise<OpenAPIV3_1.Document> {
  const api = await SwaggerParser.bundle(inputPath)
  return api as OpenAPIV3_1.Document
}
