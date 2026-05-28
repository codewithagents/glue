import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['smoke/**/*.test.ts'],
    // Sequential — never run smoke tests in parallel (rate limiting + shared configureClient state)
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    // Real network: generous timeout per test
    testTimeout: 15_000,
    // Retry once on flaky network
    retry: 1,
    // Clear any module cache between tests (configureClient is stateful)
    clearMocks: true,
  },
})
