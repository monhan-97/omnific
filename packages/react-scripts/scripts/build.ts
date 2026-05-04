import fs from 'node:fs/promises';
import { exit } from 'node:process';
import { styleText } from 'node:util';

import type { Stats } from '@rspack/core';
import { rspack } from '@rspack/core';

import type { ScriptContext } from '../Service';
import { emptyDirectory } from '../utils/fs-extra';
import { measureFileSizesBeforeBuild, printFileSizesAfterBuild } from '../utils/file-size-reporter';
import paths from '../paths';

export async function startBuild(context: ScriptContext) {
  const { rspackConfig } = context;

  try {
    const previousFileSizes = await measureFileSizesBeforeBuild(paths.appBuild);

    await emptyDirectory(paths.appBuild);

    await copyPublicFolder();

    const stats = await build(rspackConfig);

    console.log(styleText('green', 'Compiled successfully.\n'));

    console.log('File sizes after gzip:\n');

    if (stats) {
      printFileSizesAfterBuild(stats, previousFileSizes);
    }

    console.log();
  } catch (error: any) {
    console.log(styleText('red', 'Failed to compile.\n'));

    if (error && error.message) {
      console.log(error.message);
    }
    exit(1);
  }
}

function copyPublicFolder() {
  return fs.cp(paths.appPublic, paths.appBuild, {
    recursive: true,
    filter: source => source !== paths.appHtml,
  });
}

/**
 * Create the production build and print the deployment instructions.
 * @returns
 */
async function build(rspackConfig: ScriptContext['rspackConfig']) {
  console.log('Creating an optimized production build...');

  const compiler = rspack(rspackConfig);

  return new Promise<Stats | undefined>((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) {
        return reject(error);
      }

      return resolve(stats);
    });
  });
}
