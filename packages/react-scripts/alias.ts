import paths from './paths';

/** Rspack 模块解析支持的源码文件扩展名。 */
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'json', 'mjs', 'jsx'].map(extension => `.${extension}`);

/** 项目源码目录和项目根目录使用的导入别名。 */
export const aliasSymbol = {
  src: '@',
  root: '@app',
};

/** Rspack 别名与实际目录的映射。 */
export const alias = {
  [aliasSymbol.src]: paths.appSrc,
  [aliasSymbol.root]: paths.appPath,
} as Record<string, string>;
