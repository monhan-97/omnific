import path from 'node:path';

import escape from './escape-string-regexp';

/**
 * 创建用于忽略应用源码目录外文件的正则表达式。
 */
function ignoredFiles(appSource: string) {
  return new RegExp(
    `^(?!${escape(path.normalize(appSource + '/').replaceAll(/\\+/g, '/'))}).+/node_modules/`,
    'g',
  );
}

export default ignoredFiles;
