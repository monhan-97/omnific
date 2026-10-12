import fs from 'node:fs';
import path from 'node:path';

import { isDevelopment } from './utils/environment';

const appDirectory = fs.realpathSync(process.cwd());

/**
 * 从指定应用目录解析项目相对路径。
 */
export function resolveApp(relativePath: string, directoryPath = appDirectory) {
  return path.resolve(directoryPath, relativePath);
}

/**
 * 设置应用源码目录，并同步更新入口文件路径。
 */
export function setSourceDirectory(directoryPath: string) {
  paths.appSrc = directoryPath;
  paths.appIndexJs = resolveApp('index.tsx', directoryPath);
}

/**
 * 设置静态资源目录，并同步更新 HTML 模板路径。
 */
export function setPublicDirectory(directoryPath: string) {
  paths.appPublic = directoryPath;
  paths.appHtml = resolveApp('index.html', directoryPath);
}

const paths = {
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

export default paths;
