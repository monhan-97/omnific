#!/usr/bin/env node
import { parseArgs, styleText } from 'node:util';

import { Service } from './Service';

process.on('unhandledRejection', consoleError);

const rawArguments = process.argv.slice(2);

const arguments_ = parseArgs({
  args: rawArguments,
  strict: false,
  allowPositionals: true,
});

const service = new Service();

const command = arguments_.positionals[0];

try {
  command && (await service.run(command));
} catch (error) {
  consoleError(error);
}

function consoleError(value: any) {
  if (value instanceof Error) {
    console.log(styleText('red', value.message));
  } else {
    console.log(styleText('red', String(value)));
  }
  process.exit(1);
}
