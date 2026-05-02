import path from 'node:path';

import escape from './escape-string-regexp';

function ignoredFiles(appSource: string) {
  return new RegExp(
    `^(?!${escape(path.normalize(appSource + '/').replaceAll(/\\+/g, '/'))}).+/node_modules/`,
    'g',
  );
}

export default ignoredFiles;
