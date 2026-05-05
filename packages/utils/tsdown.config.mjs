import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    main: './main.ts',
  },
  format: ['esm'],
  outDir: 'dist',
  platform: 'neutral',
  sourcemap: false,
  fixedExtension: false,
  deps: {
    skipNodeModulesBundle: true,
  },
});
