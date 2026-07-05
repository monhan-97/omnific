import { defineConfig } from 'tsdown';

const sharedConfig = {
  outDir: 'dist',
  platform: 'node',
  sourcemap: false,
  fixedExtension: false,
  deps: {
    skipNodeModulesBundle: true,
  },
};

export default defineConfig([
  {
    ...sharedConfig,
    name: 'react-scripts-cli',
    entry: {
      index: './index.ts',
      'scripts/build': './scripts/build.ts',
      'scripts/dev': './scripts/development.ts',
    },
    format: 'esm',
    clean: true,
    dts: false,
  },
  {
    ...sharedConfig,
    name: 'react-scripts-runtime',
    entry: {
      main: './main.ts',
    },
    format: ['esm'],
    clean: false,
  },
]);
