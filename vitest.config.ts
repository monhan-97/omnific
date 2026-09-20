import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@omnific/hooks': new URL('packages/hooks/main.ts', import.meta.url).pathname,
      '@omnific/icons': new URL('packages/icons/main.ts', import.meta.url).pathname,
      '@omnific/utils': new URL('packages/utils/main.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
    include: ['packages/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/dist/**', '**/node_modules/**'],
    clearMocks: true,
    restoreMocks: true,
    passWithNoTests: true,
  },
});
