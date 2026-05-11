import { defineConfig } from 'tsdown';
import { createRequire } from 'node:module';

export default defineConfig({
  entry: [{ main: './main.ts' }, { '*': ['./*.ts', '!./main.ts'] }],
  outDir: 'dist',
  platform: 'neutral',
  unbundle: true,
  fixedExtension: false,
  dts: true,
  sourcemap: false,
  clean: true,
  exports: false,
  attw: false,
  publint: false,
});
