/**
 * Unit tests for the readOnly/writeOnly request/response type variant split (#211).
 *
 * Verifies:
 * - Schema with readOnly props: X emits without readOnly props, XWritable omits them.
 * - Schema with writeOnly props: X omits writeOnly props, XWritable includes them.
 * - Schema with BOTH readOnly and writeOnly: X and XWritable are both correctly filtered.
 * - Plain schema (no readOnly/writeOnly): single unchanged type, NO XWritable variant.
 * - allOf schema with writeOnly in inline member: both shapes emitted correctly.
 * - Request body referencing a split schema uses XWritable.
 * - Response referencing a split schema uses X.
 * - XWritable is always a plain TS interface (not z.infer).
 */
import { describe, it, expect } from 'vitest'
import { generateTypes } from '../plugins/types.js'
import { generateClient } from '../plugins/client.js'
import type { OpenAPIV3_1 } from 'openapi-types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSpec(
  schemas: Record<string, OpenAPIV3_1.SchemaObject>,
  paths?: OpenAPIV3_1.Document['paths']
): OpenAPIV3_1.Document {
  return {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1' },
    paths: paths ?? {},
    components: { schemas },
  }
}

// ---------------------------------------------------------------------------
// models.ts split emission tests
// ---------------------------------------------------------------------------

describe('readOnly/writeOnly split: models.ts', () => {
  it('emits X without writeOnly prop and XWritable without readOnly prop', () => {
    const spec = makeSpec({
      User: {
        type: 'object',
        properties: {
          // readOnly: server-set, omit from write shape
          id: { type: 'string', readOnly: true } as OpenAPIV3_1.SchemaObject,
          name: { type: 'string' },
          // writeOnly: client-only, omit from read shape
          password: { type: 'string', writeOnly: true } as OpenAPIV3_1.SchemaObject,
        },
      },
    })
    const out = generateTypes(spec).content

    // Read shape (User): should have id and name, NOT password
    expect(out).toContain('export interface User {')
    expect(out).toMatch(/id\??\s*:\s*string/)
    expect(out).toMatch(/name\??\s*:\s*string/)
    // password is writeOnly so excluded from read shape
    expect(out).not.toMatch(/export interface User \{[^}]*password/)

    // Write shape (UserWritable): should have name and password, NOT id
    expect(out).toContain('export interface UserWritable {')
    expect(out).toMatch(/password\??\s*:\s*string/)
    // id is readOnly so excluded from write shape
    expect(out).not.toMatch(/export interface UserWritable \{[^}]*\n.*id/)
  })

  it('single readOnly prop: X omits it, XWritable keeps it... wait, readOnly goes in X only', () => {
    // readOnly: X includes it (it is a response-side field), XWritable excludes it
    const spec = makeSpec({
      Article: {
        type: 'object',
        properties: {
          id: { type: 'string', readOnly: true } as OpenAPIV3_1.SchemaObject,
          title: { type: 'string' },
        },
      },
    })
    const out = generateTypes(spec).content

    // X (Article) includes id (it is readOnly, present in read shape)
    expect(out).toContain('export interface Article {')
    expect(out).toMatch(/id\??\s*:\s*string/)
    expect(out).toMatch(/title\??\s*:\s*string/)

    // XWritable (ArticleWritable) excludes id (readOnly) but keeps title
    expect(out).toContain('export interface ArticleWritable {')
    expect(out).toMatch(/title\??\s*:\s*string/)
    // id should not appear in ArticleWritable
    const writableSection = out.slice(out.indexOf('export interface ArticleWritable {'))
    const closingBrace = writableSection.indexOf('}')
    const writableBody = writableSection.slice(0, closingBrace + 1)
    expect(writableBody).not.toContain('id')
  })

  it('single writeOnly prop: X omits it, XWritable includes it', () => {
    const spec = makeSpec({
      Credential: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          secret: { type: 'string', writeOnly: true } as OpenAPIV3_1.SchemaObject,
        },
      },
    })
    const out = generateTypes(spec).content

    // X (Credential) excludes secret (writeOnly)
    expect(out).toContain('export interface Credential {')
    expect(out).toMatch(/username\??\s*:\s*string/)
    const readSection = out.slice(out.indexOf('export interface Credential {'))
    const readClose = readSection.indexOf('}')
    const readBody = readSection.slice(0, readClose + 1)
    expect(readBody).not.toContain('secret')

    // XWritable (CredentialWritable) includes secret
    expect(out).toContain('export interface CredentialWritable {')
    expect(out).toMatch(/secret\??\s*:\s*string/)
  })

  it('plain schema with no readOnly/writeOnly: single type, no XWritable', () => {
    const spec = makeSpec({
      Tag: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    })
    const out = generateTypes(spec).content

    // Only one type for Tag
    expect(out).toContain('export interface Tag {')
    expect(out).not.toContain('TagWritable')
  })

  it('allOf schema with writeOnly in inline member: both shapes emitted', () => {
    // Pattern common in real specs: allOf with a $ref base + inline member with writeOnly
    const spec = makeSpec({
      BaseUser: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
        },
      },
      UserWithPassword: {
        allOf: [
          { $ref: '#/components/schemas/BaseUser' },
          {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string', writeOnly: true } as OpenAPIV3_1.SchemaObject,
            },
          } as OpenAPIV3_1.SchemaObject,
        ],
      } as OpenAPIV3_1.SchemaObject,
    })
    const out = generateTypes(spec).content

    // X (UserWithPassword): allOf type with password excluded from inline member
    expect(out).toContain('export type UserWithPassword =')
    // The read shape should contain email but NOT password
    expect(out).toContain('email')
    // password should NOT appear in the read-shape allOf expansion
    const readSection = out.slice(
      out.indexOf('export type UserWithPassword ='),
      out.indexOf('export interface UserWithPasswordWritable')
    )
    expect(readSection).not.toContain('password')

    // XWritable (UserWithPasswordWritable): flat interface with email + password
    expect(out).toContain('export interface UserWithPasswordWritable {')
    expect(out).toMatch(/email\??\s*:\s*string/)
    expect(out).toMatch(/password\??\s*:\s*string/)
  })

  it('the auto-generated banner is present', () => {
    const spec = makeSpec({
      Foo: { type: 'object', properties: { x: { type: 'string' } } },
    })
    const out = generateTypes(spec).content
    expect(out.startsWith('// This file is auto-generated by @codewithagents/openapi-gen')).toBe(
      true
    )
  })
})

// ---------------------------------------------------------------------------
// client.ts request body wiring tests
// ---------------------------------------------------------------------------

describe('readOnly/writeOnly split: client.ts request body wiring', () => {
  it('POST request body with $ref to split schema uses XWritable', () => {
    const spec = makeSpec(
      {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', readOnly: true } as OpenAPIV3_1.SchemaObject,
            name: { type: 'string' },
            password: { type: 'string', writeOnly: true } as OpenAPIV3_1.SchemaObject,
          },
        },
      },
      {
        '/users': {
          post: {
            operationId: 'createUser',
            requestBody: {
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/User' } },
              },
            },
            responses: {
              '201': {
                content: {
                  'application/json': { schema: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
        },
      }
    )
    const clientOut = generateClient(spec).content

    // Request body should reference UserWritable
    expect(clientOut).toContain('body: UserWritable')
    // UserWritable must be imported from ./models.js
    expect(clientOut).toContain('UserWritable')
    expect(clientOut).toMatch(/import type \{[^}]*UserWritable[^}]*\} from '\.\/models\.js'/)
  })

  it('GET response with $ref to split schema still uses X (read shape)', () => {
    const spec = makeSpec(
      {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', readOnly: true } as OpenAPIV3_1.SchemaObject,
            name: { type: 'string' },
          },
        },
      },
      {
        '/products/{id}': {
          get: {
            operationId: 'getProduct',
            parameters: [{ name: 'id', in: 'path', required: true }],
            responses: {
              '200': {
                content: {
                  'application/json': { schema: { $ref: '#/components/schemas/Product' } },
                },
              },
            },
          },
        },
      }
    )
    const clientOut = generateClient(spec).content

    // Return type should be Product (read shape), not ProductWritable
    expect(clientOut).toContain('Promise<Product>')
    expect(clientOut).not.toContain('Promise<ProductWritable>')
  })

  it('schema without readOnly/writeOnly: client uses X (unchanged name) for request body', () => {
    const spec = makeSpec(
      {
        Item: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            value: { type: 'number' },
          },
        },
      },
      {
        '/items': {
          post: {
            operationId: 'createItem',
            requestBody: {
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Item' } },
              },
            },
            responses: {
              '201': {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Item' } } },
              },
            },
          },
        },
      }
    )
    const clientOut = generateClient(spec).content

    // No split: body uses Item directly
    expect(clientOut).toContain('body: Item')
    expect(clientOut).not.toContain('ItemWritable')
  })
})
