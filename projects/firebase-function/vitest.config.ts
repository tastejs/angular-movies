import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'firebase-function',
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../dist/coverage/firebase-function',
    },
  },
});
