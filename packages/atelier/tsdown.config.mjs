import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [{ main: './main.ts' }, { '*': ['./*/index.ts'] }],
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
