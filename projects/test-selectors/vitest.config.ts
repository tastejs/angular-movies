import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'test-selectors',
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../coverage/test-selectors',
    },
  },
});
