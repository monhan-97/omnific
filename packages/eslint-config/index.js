import { builtinModules } from 'node:module';

import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver, flatConfigs as importXFlagConfigs } from 'eslint-plugin-import-x';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

// 'tsc' already handles this
const conflictRules = (type = 'off') => {
  return {
    'no-unused-vars': type,
    'default-case': type,
    'no-dupe-class-members': type,
    'no-undef': type,
    'no-unused-expressions': type,
    'no-redeclare': type,
  };
};

const commonConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  ignores: [
    '.vscode/',
    '.idea/',
    '.git/',
    '.yarn/',
    '.next/',
    '.husky/',
    '.local/',
    '.next/',
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
    'dot-location': ['error', 'property'],
    eqeqeq: ['error', 'smart'],
    'new-parens': 'error',
    'no-array-constructor': 'error',
    'no-caller': 'error',
    'no-cond-assign': ['error', 'except-parens'],
    'no-const-assign': 'error',
    'no-control-regex': 'error',
    'no-delete-var': 'error',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty-character-class': 'error',
    'no-empty-pattern': 'error',
    'no-eval': 'error',
    'no-ex-assign': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-fallthrough': 'error',
    'no-func-assign': 'error',
    'no-implied-eval': 'error',
    'no-invalid-regexp': 'error',
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
    'no-global-assign': 'error',
    'no-unsafe-negation': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-symbol': 'error',
    'no-new-wrappers': 'error',
    'no-obj-calls': 'error',
    'no-octal': 'error',
    'no-octal-escape': 'error',
    'no-redeclare': 'error',
    'no-regex-spaces': 'error',
    'no-restricted-syntax': ['error', 'WithStatement'],
    'no-script-url': 'error',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow-restricted-names': 'error',
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'error',
    'no-this-before-super': 'error',
    'no-throw-literal': 'error',
    'no-unreachable': 'warn',
    'no-unused-labels': 'error',
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
    'no-useless-escape': 'error',
    'no-useless-rename': [
      'error',
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    'no-with': 'error',
    'no-whitespace-before-property': 'error',
    'require-yield': 'error',
    'rest-spread-spacing': ['error', 'never'],
    strict: ['error', 'never'],
    'unicode-bom': ['error', 'never'],
    'use-isnan': 'error',
    'valid-typeof': 'error',
    'no-restricted-properties': [
      'error',
      {
        object: 'require',
        property: 'ensure',
        message:
          'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
      },
      {
        object: 'System',
        property: 'import',
        message:
          'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
      },
    ],
    'getter-return': 'error',
    ...conflictRules('error'),
    'import-x/first': 'error',
    'import-x/no-amd': 'error',
    'import-x/no-anonymous-default-export': [
      'error',
      {
        allowObject: true,
      },
    ],
    'import-x/no-webpack-loader-syntax': 'error',
    'import-x/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'unknown'],
        'newlines-between': 'always',
      },
    ],
    'import-x/no-unresolved': [
      2,
      {
        commonjs: true,
        caseSensitiveStrict: true,
        amd: true,
      },
    ],
    'import-x/no-extraneous-dependencies': 'off',
    'import-x/no-rename-default': 'off',
    'import-x/default': 'off',
    'import-x/no-nodejs-modules': [
      'error',
      { allow: builtinModules.map(module_ => `node:${module_}`) },
    ],
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
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    indent: 'off',
  },
};

const tsEslintConfig = {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    '@typescript-eslint': tsEslintPlugin,
  },
  settings: {
    'import-x/resolver-next': [
      createTypeScriptImportResolver({
        alwaysTryTypes: true,
      }),
      createNodeResolver(),
    ],
  },
  languageOptions: {
    parser: tsEslintParser,
    globals: { ...globals.node, ...globals.browser },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      warnOnUnsupportedTypeScriptVersion: true,
    },
  },
  rules: {
    ...conflictRules('off'),
    '@typescript-eslint/no-useless-constructor': 'warn',
    '@typescript-eslint/no-use-before-define': [
      'warn',
      {
        functions: false,
        classes: false,
        variables: false,
        typedefs: false,
      },
    ],
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
    '@typescript-eslint/no-redeclare': 'warn',
    '@typescript-eslint/no-array-constructor': 'warn',
    '@typescript-eslint/consistent-type-assertions': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/indent': 'off',
  },
};

const eslintBaseJSConfig = defineConfig([
  eslintConfigPrettier,
  importXFlagConfigs.warnings,
  importXFlagConfigs.errors,
  importXFlagConfigs.typescript,
  commonConfig,
  tsEslintConfig,
]);

export default eslintBaseJSConfig;
