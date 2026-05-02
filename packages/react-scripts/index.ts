#!/usr/bin/env node
import { styleText } from 'node:util';

import { DEVELOPMENT, PRODUCTION, setEnv } from './utils/env';

process.on('unhandledRejection', error => {
  if (error instanceof Error) {
    console.log(styleText('red', error.message));
    process.exit(1);
  } else {
    throw error;
  }
});

const args = process.argv.slice(2);

const scriptLoaders = {
  build: () => import('./scripts/build.js'),
  dev: () => import('./scripts/dev.js'),
} as const;

const scriptIndex = args.findIndex(script => script === 'build' || script === 'dev');

if (scriptIndex === -1) {
  console.log('Unknown script "' + args[0] + '".');
  process.exit(1);
} else {
  const script = args[scriptIndex];

  setEnv({
    NODE_ENV: script === 'dev' ? DEVELOPMENT : PRODUCTION,
    SCRIPT: script,
  });

  await scriptLoaders[script as keyof typeof scriptLoaders]();
}
