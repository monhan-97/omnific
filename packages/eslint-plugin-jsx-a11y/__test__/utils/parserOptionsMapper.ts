import type { Linter, RuleTester } from 'eslint';
import { hasValue } from '@omnific/utils';

/**
 * RuleTester case accepted by {@link parserOptionsMapper}.
 */
export type MappedTestCase = RuleTester.ValidTestCase | RuleTester.InvalidTestCase;

const defaultParserOptions: Linter.ParserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
};

/**
 * Fills flat-config `languageOptions` defaults for a RuleTester case.
 *
 * Only supports ESLint flat config. Legacy `parserOptions` at the case root
 * are not restored.
 * @param testCase - RuleTester case to normalize.
 * @returns Case with merged `languageOptions`.
 */
export default function parserOptionsMapper<T extends MappedTestCase>(testCase: T): T {
  const { languageOptions, ...rest } = testCase;
  const nextLanguageOptions: Linter.LanguageOptions = hasValue(languageOptions)
    ? languageOptions
    : {};
  const nextParserOptions = hasValue(nextLanguageOptions.parserOptions)
    ? nextLanguageOptions.parserOptions
    : {};
  const nextEcmaFeatures = hasValue(nextParserOptions.ecmaFeatures)
    ? nextParserOptions.ecmaFeatures
    : {};

  return {
    ...rest,
    languageOptions: {
      ecmaVersion: 'latest',
      ...nextLanguageOptions,
      parserOptions: {
        ...defaultParserOptions,
        ...nextParserOptions,
        ecmaFeatures: {
          ...defaultParserOptions.ecmaFeatures,
          ...nextEcmaFeatures,
        },
      },
    },
  } as unknown as T;
}
