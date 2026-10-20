import type { RuleTester as RuleTesterTypes } from 'eslint';
import { hasValue, isArray, isPlainObject, isString } from '@omnific/utils';
import typescriptEslintParser from '@typescript-eslint/parser';

/**
 * RuleTester case expanded by {@link parsers.all}.
 */
export type ParserTestCase = RuleTesterTypes.ValidTestCase | RuleTesterTypes.InvalidTestCase;

/**
 * Appends a trailing comment that records the active parser and case knobs.
 * @param testCase - Case whose code/output should be annotated.
 * @param parserName - Human-readable parser label for failure output.
 * @returns Case with annotation comments applied.
 */
function addParserComment(testCase: ParserTestCase, parserName: string): ParserTestCase {
  const extras = [`parser: ${parserName}`];

  if (hasValue(testCase.languageOptions)) {
    const languageOptionsWithoutParser = { ...testCase.languageOptions };
    Reflect.deleteProperty(languageOptionsWithoutParser, 'parser');
    if (Object.keys(languageOptionsWithoutParser).length > 0) {
      extras.push(`languageOptions: ${JSON.stringify(languageOptionsWithoutParser)}`);
    }
  }

  if (hasValue(testCase.options)) {
    extras.push(`options: ${JSON.stringify(testCase.options)}`);
  }

  if (hasValue(testCase.settings)) {
    extras.push(`settings: ${JSON.stringify(testCase.settings)}`);
  }

  const extraComment = `\n// ${extras.join(', ')}`;
  const nextCase: ParserTestCase = {
    ...testCase,
    code: `${testCase.code}${extraComment}`,
  };

  if ('output' in testCase && isString(testCase.output)) {
    (nextCase as RuleTesterTypes.InvalidTestCase).output = `${testCase.output}${extraComment}`;
  }

  if ('errors' in testCase && isArray(testCase.errors)) {
    (nextCase as RuleTesterTypes.InvalidTestCase).errors = testCase.errors.map(error => {
      if (isString(error) || error instanceof RegExp) {
        return error;
      }

      if (!isPlainObject(error)) {
        return error;
      }

      if (!isArray(error.suggestions)) {
        return error;
      }

      return {
        ...error,
        suggestions: error.suggestions.map(suggestion => {
          if (!isPlainObject(suggestion) || !isString(suggestion.output)) {
            return suggestion;
          }

          return {
            ...suggestion,
            output: `${suggestion.output}${extraComment}`,
          };
        }),
      };
    });
  }

  return nextCase;
}

/**
 * Expands each RuleTester case into default-parser and TypeScript-parser variants.
 * @param tests - Cases to expand.
 * @returns Flattened cases covering both parsers.
 */
function all<T extends ParserTestCase>(tests: readonly T[]): T[] {
  return tests.flatMap(testCase => {
    const defaultCase = addParserComment({ ...testCase }, 'default') as T;
    const typescriptCase = addParserComment(
      {
        ...testCase,
        languageOptions: {
          ...testCase.languageOptions,
          parser: typescriptEslintParser,
        },
      },
      '@typescript-eslint/parser',
    ) as T;

    return [defaultCase, typescriptCase];
  });
}

/**
 * Parser matrix helpers used by rule tests.
 */
const parsers = {
  all,
};

export default parsers;
