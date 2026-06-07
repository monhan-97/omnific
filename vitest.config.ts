import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@omnific/utils': new URL('./packages/utils/main.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
    include: ['packages/**/*.{test,spec}.ts'],
    exclude: ['**/dist/**', '**/node_modules/**'],
    clearMocks: true,
    restoreMocks: true,
    passWithNoTests: true,
  },
});
