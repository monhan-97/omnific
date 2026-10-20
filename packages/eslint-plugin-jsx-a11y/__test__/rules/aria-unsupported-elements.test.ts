/**
 * @file Enforce that elements that do not support ARIA roles, states and
 *   properties do not have those attributes.
 * @author Ethan Cohen
 */

import { dom } from 'aria-query';
import { hasValue } from '@omnific/utils';

import rule from '../../src/rules/aria-unsupported-elements';
import { RuleTester } from '../utils/ruleTester';
import parsers from '../utils/parsers';
import parserOptionsMapper from '../utils/parserOptionsMapper';

const ruleTester = new RuleTester();

const errorMessage = (invalidProp: string) => ({
  message: `This element does not support ARIA roles, states and properties. Try removing the prop '${invalidProp}'.`,
});

const domElements = dom.keys();
// Generate valid test cases
const roleValidityTests = domElements.map(element => {
  const definition = dom.get(element);
  const isReserved = (hasValue(definition) && definition.reserved) || false;
  const role = isReserved ? '' : 'role';

  return {
    code: `<${element} ${role} />`,
  };
});

const ariaValidityTests = [
  ...domElements.map(element => {
    const definition = dom.get(element);
    const isReserved = (hasValue(definition) && definition.reserved) || false;
    const ariaAttr = isReserved ? '' : 'aria-hidden';

    return {
      code: `<${element} ${ariaAttr} />`,
    };
  }),
  {
    code: '<fake aria-hidden />',
  },
];

type UnsupportedInvalidCase = {
  code: string;
  errors: ReturnType<typeof errorMessage>[];
  settings?: { 'jsx-a11y': { components: Record<string, string> } };
};

// Generate invalid test cases.
const invalidRoleValidityTests: UnsupportedInvalidCase[] = [
  ...domElements
    .filter(element => {
      const definition = dom.get(element);
      return hasValue(definition) && definition.reserved === true;
    })
    .map(reservedElem => ({
      code: `<${reservedElem} role {...props} />`,
      errors: [errorMessage('role')],
    })),
  {
    code: '<Meta aria-hidden />',
    errors: [errorMessage('aria-hidden')],
    settings: { 'jsx-a11y': { components: { Meta: 'meta' } } },
  },
];

const invalidAriaValidityTests: UnsupportedInvalidCase[] = domElements
  .filter(element => {
    const definition = dom.get(element);
    return hasValue(definition) && definition.reserved === true;
  })
  .map(reservedElem => ({
    code: `<${reservedElem} aria-hidden aria-role="none" {...props} />`,
    errors: [errorMessage('aria-hidden')],
  }));

/**
 * Dedupes RuleTester cases by serialized code/options/settings.
 * ESLint 10 rejects duplicates; reserved-element generators can collide.
 * @param cases - Cases that may contain duplicates.
 * @returns Unique cases preserving first-seen order.
 */
function dedupeCases<T extends { code: string; options?: unknown; settings?: unknown }>(
  cases: readonly T[],
): T[] {
  const seen = new Set<string>();
  return cases.filter(testCase => {
    const key = JSON.stringify({
      code: testCase.code,
      options: testCase.options,
      settings: testCase.settings,
    });
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

ruleTester.run('aria-unsupported-elements', rule, {
  valid: parsers
    .all(dedupeCases([...roleValidityTests, ...ariaValidityTests]))
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all(dedupeCases([...invalidRoleValidityTests, ...invalidAriaValidityTests]))
    .map((testCase) => parserOptionsMapper(testCase)),
});

