import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const directoryName = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@omnific/icons': path.resolve(directoryName, '../../packages/icons/main.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/__test__/setup.ts',
  },
});
