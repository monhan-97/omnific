import path from 'node:path';

import { defineConfig } from '@omnific/react-scripts';

export default defineConfig({
  configureRspack(config) {
    return {
      output: {
        ...config.output,
        publicPath: './',
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@omnific/icons': path.resolve('../../packages/icons/main.ts'),
        },
      },
    };
  },
});
