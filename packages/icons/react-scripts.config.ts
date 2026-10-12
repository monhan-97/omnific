import path from 'node:path';

import { defineConfig } from '@omnific/react-scripts';

const docsDirectory = path.resolve(import.meta.dirname, 'docs');

const config = defineConfig({
  src: docsDirectory,
  public: path.join(docsDirectory, 'public'),
  configureRspack(rspackConfig) {
    return {
      output: {
        ...rspackConfig.output,
        publicPath: './',
      },
      resolve: {
        ...rspackConfig.resolve,
        alias: {
          ...rspackConfig.resolve?.alias,
          '@omnific/icons': path.resolve(import.meta.dirname, 'main.ts'),
        },
      },
    };
  },
});

export default config;
