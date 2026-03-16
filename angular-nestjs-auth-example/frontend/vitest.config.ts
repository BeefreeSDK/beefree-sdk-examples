import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@beefree.io/sdk/dist/types/bee': '@beefree.io/sdk/dist/types/bee.js',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.spec.ts',
        'src/test-setup.ts',
        'src/app/types/**/*.ts',
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
