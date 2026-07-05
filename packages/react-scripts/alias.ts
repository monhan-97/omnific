import paths from './paths';

export const moduleFileExtensions = ['ts', 'tsx', 'js', 'json', 'mjs', 'jsx'].map(extension => `.${extension}`);

export const aliasSymbol = {
  src: '@',
  root: '@app',
};

export const alias = {
  [aliasSymbol.src]: paths.appSrc,
  [aliasSymbol.root]: paths.appPath,
} as Record<string, string>;
