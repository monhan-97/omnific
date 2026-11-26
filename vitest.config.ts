import { defineConfig } from 'vitest/config';

const config = defineConfig({
  resolve: {
    alias: {
      '@omnific/animate': new URL('packages/animate/main.ts', import.meta.url).pathname,
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

export default config;
