import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/api-tests/**/*.test.ts'],
    threads: false,
    setupFiles: ['utils/tests/setup.ts'],
    testTimeout: 15000
  },
  resolve: {
    alias: {
      auth: '/src/auth',
      quotes: '/src/quotes',
      lib: '/src/lib'
    }
  }
})
