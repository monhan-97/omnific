import { RuleTester as ESLintRuleTester } from 'eslint';
import { describe, it } from 'vitest';

/**
 * Wires ESLint RuleTester to vitest and injects JSX-capable defaults.
 * @returns Configured RuleTester constructor.
 */
const createRuleTester = (): typeof ESLintRuleTester => {
  ESLintRuleTester.describe = describe;
  ESLintRuleTester.it = it;
  ESLintRuleTester.itOnly = it.only;
  ESLintRuleTester.setDefaultConfig({
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  });

  return ESLintRuleTester;
};

/**
 * ESLint RuleTester preconfigured for this package's vitest suite.
 */
export const RuleTester = createRuleTester();
