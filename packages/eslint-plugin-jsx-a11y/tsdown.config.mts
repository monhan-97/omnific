import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/configs/*.ts',
    'src/rules/*.ts',
    'src/util/*.ts',
    'src/util/autocomplete/*.ts',
    'src/util/implicitRoles/*.ts',
  ],
  root: 'src',
  outDir: 'dist',
  platform: 'node',
  unbundle: true,
  fixedExtension: false,
  dts: true,
  sourcemap: false,
  clean: true,
  exports: false,
  attw: false,
  publint: false,
});
