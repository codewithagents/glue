import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/cli.ts', 'src/index.ts', 'src/generator.ts', 'src/__fixtures__/**'],
      thresholds: {
        branches: 60,
        functions: 85,
        lines: 75,
        statements: 75,
      },
      reporter: ['text', ['lcov', { projectRoot: '../../' }]],
    },
  },
})
