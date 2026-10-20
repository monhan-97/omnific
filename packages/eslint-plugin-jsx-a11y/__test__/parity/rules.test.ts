/**
 * @file Asserts local rules against upstream plugin oracle samples.
 */

import { Linter } from 'eslint';
import { describe, expect, test } from 'vitest';

import { rulesParityCases } from './rules-parity';

import plugin from '../../src/index';

const linter = new Linter({ configType: 'flat' });

/**
 * Lints `code` with a single `@omnific/eslint-plugin-jsx-a11y` rule enabled.
 * @param rule - Rule name without plugin prefix.
 * @param code - JSX snippet.
 * @returns Error-severity messages.
 */
function lintRule(rule: string, code: string) {
  return linter.verify(
    code,
    [
      {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { 'jsx-a11y': plugin },
        rules: { [`jsx-a11y/${rule}`]: 'error' },
      },
    ],
    'sample.jsx',
  ).filter(message => message.severity === 2 && !message.fatal);
}

describe('rules parity', () => {
  test.each(rulesParityCases)(
    '$rule: $code → expectError=$expectError',
    ({ rule, code, expectError, messages }) => {
      const errors = lintRule(rule, code);
      expect(errors.length > 0).toBe(expectError);
      if (expectError) {
        expect(errors.map(error => error.message)).toEqual(messages);
      }
    },
  );
});
