import fs from 'node:fs';
import path from 'node:path';

import { isDevelopment } from './utils/env';

const appDirectory = fs.realpathSync(process.cwd());

export function resolveApp(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
}

export default {
  appSrc: resolveApp('src'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appIndexJs: resolveApp('src/index.tsx'),
  publicUrlOrPath: isDevelopment() ? '/' : './',
  appHtml: resolveApp('public/index.html'),
  appTsConfig: resolveApp('./tsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  appPublic: resolveApp('public'),
  config: resolveApp('react-scripts.config'),
  tsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
};
