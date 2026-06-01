import { defineConfig } from 'vitest/config'

// Vitest config used exclusively by Stryker mutation testing.
// Excludes the integration test which requires tsx (not available in CI/mutation runs).
export default defineConfig({
  test: {
    exclude: ['src/__tests__/integration.test.ts', '**/node_modules/**'],
  },
})
