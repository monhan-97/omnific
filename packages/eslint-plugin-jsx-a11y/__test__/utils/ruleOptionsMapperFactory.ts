import type { RuleTester } from 'eslint';
import { hasValue, isArray, isPlainObject } from '@omnific/utils';

/**
 * RuleTester case accepted by {@link ruleOptionsMapperFactory}.
 */
export type OptionsMappedTestCase = RuleTester.ValidTestCase | RuleTester.InvalidTestCase;

/**
 * Merges factory rule options into each test case's `options[0]` object.
 * @param ruleOptions - Option object(s) to flatten into a single options entry.
 * @returns Mapper that applies the merged options to a test case.
 */
export default function ruleOptionsMapperFactory(
  ruleOptions: Record<string, unknown> | ReadonlyArray<Record<string, unknown>> = [],
) {
  const optionObjects = isArray(ruleOptions) ? ruleOptions : [ruleOptions];

  return <T extends OptionsMappedTestCase>(testCase: T): T => {
    const caseOptions = hasValue(testCase.options) && isArray(testCase.options)
      ? testCase.options.filter((item): item is Record<string, unknown> => isPlainObject(item))
      : [];

    return {
      ...testCase,
      options: [
        Object.fromEntries(
          [...caseOptions, ...optionObjects].flatMap(item =>
            Object.entries(item as Record<string, unknown>),
          ),
        ),
      ],
    };
  };
}
