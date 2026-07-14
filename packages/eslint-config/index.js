import js from '@eslint/js';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver, flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

const sourceFiles = ['**/*.{js,jsx,ts,tsx}'];

const typeScriptFiles = ['**/*.{ts,tsx}'];

const commonConfig = {
  files: sourceFiles,
  ignores: [
    '.vscode/',
    '.idea/',
    '.git/',
    '.yarn/',
    '.next/',
    '.husky/',
    '.local/',
    'tmp/',
    'bin/',
    'build/',
    'dist/',
    'node_modules/',
    '**/*.md',
    '**/*.woff',
    '**/*.ttf',
  ],
  plugins: {
    unicorn: eslintPluginUnicorn,
  },
  languageOptions: {
    globals: { ...globals.node, ...globals.browser },
  },
  rules: {
    'array-callback-return': 'error',
    eqeqeq: ['error', 'smart'],
    'no-caller': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': ['error', { allowLoop: true, allowSwitch: false }],
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: false,
      },
    ],
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-restricted-syntax': ['error', 'WithStatement'],
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: false,
      },
    ],
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-rename': 'error',
    strict: ['error', 'never'],
    'import-x/first': 'error',
    'import-x/no-amd': 'error',
    'import-x/no-anonymous-default-export': ['error', { allowObject: true }],
    'import-x/no-webpack-loader-syntax': 'error',
    'import-x/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'unknown'],
        'newlines-between': 'always',
      },
    ],
    'import-x/no-unresolved': [
      'error',
      {
        commonjs: true,
        caseSensitiveStrict: true,
        amd: true,
      },
    ],
    'import-x/default': 'off',
    'import-x/no-extraneous-dependencies': 'off',
    'import-x/no-rename-default': 'off',
    'preserve-caught-error': 'off',
    ...eslintPluginUnicorn.configs.recommended.rules,
    'unicorn/better-regex': 'warn',
    'unicorn/no-array-reduce': 'warn',
    'unicorn/no-for-loop': 'warn',
    'unicorn/no-array-sort': 'off',
    'unicorn/consistent-class-member-order': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-declarations-before-early-exit': 'off',
    'unicorn/no-this-outside-of-class': 'off',
    'unicorn/no-unnecessary-global-this': 'off',
    'unicorn/no-unreadable-new-expression': 'off',
    'unicorn/no-unsafe-property-key': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-await': 'off',
    'unicorn/prefer-minimal-ternary': 'off',
    'unicorn/prefer-private-class-fields': 'off',
    'unicorn/no-unnecessary-boolean-comparison': 'off',
    'unicorn/name-replacements': 'off',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
  },
};

const typeScriptRecommendedConfigs = tsEslintPlugin.configs['flat/recommended'].map(config => ({
  ...config,
  files: typeScriptFiles,
}));

const typeScriptConfig = {
  files: typeScriptFiles,
  settings: {
    'import-x/resolver-next': [
      createTypeScriptImportResolver({ alwaysTryTypes: true }),
      createNodeResolver(),
    ],
  },
  rules: {
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    '@typescript-eslint/consistent-type-assertions': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
  },
};

export default defineConfig([
  { ...js.configs.recommended, files: sourceFiles },
  importXFlatConfigs.warnings,
  importXFlatConfigs.errors,
  importXFlatConfigs.typescript,
  commonConfig,
  ...typeScriptRecommendedConfigs,
  typeScriptConfig,
  eslintConfigPrettier,
]);
