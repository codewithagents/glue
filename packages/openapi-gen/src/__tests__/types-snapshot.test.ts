import { describe, it, expect } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import { parseSpec } from '../parser.js'
import { generateTypes } from '../plugins/types.js'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, '../__fixtures__/specs')

const fixtures = [
  ['task-manager', join(fixturesDir, 'task-manager.json')],
  ['edge-cases', join(fixturesDir, 'edge-cases.json')],
  ['petstore', join(fixturesDir, 'petstore.json')],
] as const

describe('types plugin snapshots', () => {
  it.each(fixtures)('generates stable output for %s', async (name, fixturePath) => {
    const spec = await parseSpec(fixturePath)
    const { content } = generateTypes(spec)

    // Snapshot — update with: vitest --update-snapshots
    expect(content).toMatchSnapshot()
  })
})

describe('types plugin explicit assertions per fixture', () => {
  describe('task-manager', () => {
    it('generates all expected schemas', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      const expectedNames = ['TaskStatus', 'Tag', 'Task', 'CreateTaskRequest', 'PagedTasks', 'Pagination', 'ValidationError', 'NotFoundError', 'ErrorDetail']
      for (const name of expectedNames) {
        expect(content, `Expected ${name} to appear in output`).toContain(name)
      }
    })

    it('TaskStatus is a string literal union, not an interface', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain(`export type TaskStatus = "pending"`)
      expect(content).not.toContain('interface TaskStatus')
    })

    it('Task required fields have no ?', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      // id, title, status are required in Task
      expect(content).toMatch(/id: string/)
      expect(content).toMatch(/title: string/)
    })

    it('Task optional fields have ?', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      expect(content).toMatch(/description\?:/)
      expect(content).toMatch(/tags\?:/)
      expect(content).toMatch(/priority\?:/)
      expect(content).toMatch(/completed\?:/)
    })

    it('nullable field is string | null', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('string | null')
    })

    it('array of $ref items uses type name', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('Tag[]')
    })

    it('additionalProperties generates Record', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('Record<string, string>')
    })

    it('allOf generates intersection type', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('Pagination &')
    })

    it('anyOf generates union type', async () => {
      const spec = await parseSpec(join(fixturesDir, 'task-manager.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('ValidationError | NotFoundError')
    })
  })

  describe('edge-cases', () => {
    it('self-referential TreeNode generates without error', async () => {
      const spec = await parseSpec(join(fixturesDir, 'edge-cases.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('TreeNode')
      expect(content).toContain('children')
    })

    it('integer enum generates number literal union', async () => {
      const spec = await parseSpec(join(fixturesDir, 'edge-cases.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('export type Priority = 1 | 2 | 3 | 4 | 5')
    })

    it('StringMap generates Record<string, string>', async () => {
      const spec = await parseSpec(join(fixturesDir, 'edge-cases.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('Record<string, string>')
    })

    it('property with hyphen is quoted in output', async () => {
      const spec = await parseSpec(join(fixturesDir, 'edge-cases.json'))
      const { content } = generateTypes(spec)
      expect(content).toMatch(/'Content-Type'|"Content-Type"/)
    })

    it('multi-type union generates T | U', async () => {
      const spec = await parseSpec(join(fixturesDir, 'edge-cases.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('string | number')
    })

    it('NullableRef with anyOf null generates union with null', async () => {
      const spec = await parseSpec(join(fixturesDir, 'edge-cases.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('TreeNode | null')
    })

    it('Shape oneOf generates union type', async () => {
      const spec = await parseSpec(join(fixturesDir, 'edge-cases.json'))
      const { content } = generateTypes(spec)
      expect(content).toContain('Circle | Rectangle')
    })
  })
})

describe('schema-enhanced types generation', () => {
  const petSpec: OpenAPIV3_1.Document = {
    openapi: '3.1.0',
    info: { title: 'Pet API', version: '1' },
    paths: {},
    components: {
      schemas: {
        Pet: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            species: { type: 'string' },
          },
        },
        PetStatus: {
          type: 'string',
          enum: ['available', 'adopted'],
        },
      },
    },
  }

  it('generates z.infer types when schemaNames provided', () => {
    const result = generateTypes(petSpec, {
      schemaNames: new Set(['PetSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).toMatchSnapshot()
    expect(result.content).toContain("import type { z } from 'zod'")
    expect(result.content).toContain('export type Pet = z.infer<typeof PetSchema>')
    expect(result.content).not.toContain('export interface Pet')
  })

  it('imports only schemas that are in schemaNames set', () => {
    // PetStatus is an enum, not in schemaNames, so it should not be imported
    const result = generateTypes(petSpec, {
      schemaNames: new Set(['PetSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).toContain('PetSchema')
    expect(result.content).not.toContain('PetStatusSchema')
  })

  it('keeps enum as TypeScript type alias when schemaNames provided', () => {
    // PetStatus is a string enum — should remain as a TS type alias, not z.infer
    const result = generateTypes(petSpec, {
      schemaNames: new Set(['PetSchema', 'PetStatusSchema']),
      schemaImportPath: './schemas.js',
    })
    expect(result.content).toContain(`export type PetStatus = "available" | "adopted"`)
    expect(result.content).not.toContain('export type PetStatus = z.infer')
  })

  it('generates import from the provided schemaImportPath', () => {
    const result = generateTypes(petSpec, {
      schemaNames: new Set(['PetSchema']),
      schemaImportPath: '../shared/schemas.js',
    })
    expect(result.content).toContain("from '../shared/schemas.js'")
  })

  it('falls back to standard output when no options provided', () => {
    const result = generateTypes(petSpec)
    expect(result.content).not.toContain("import type { z }")
    expect(result.content).toContain('export interface Pet')
    expect(result.content).not.toContain('z.infer')
  })
})
