/**
 * @file Enforce all aria-* properties are valid.
 * @author Ethan Cohen
 */

import { aria } from 'aria-query';
import { isArrayEmpty } from '@omnific/utils';

import rule from '../../src/rules/aria-props';
import getSuggestion from '../../src/util/getSuggestion';
import { RuleTester } from '../utils/ruleTester';
import parsers from '../utils/parsers';
import parserOptionsMapper from '../utils/parserOptionsMapper';

const ruleTester = new RuleTester();
const ariaAttributes = aria.keys();

const errorMessage = (name: string) => {
  const suggestions = getSuggestion(name, ariaAttributes);
  const message = `${name}: This attribute is an invalid ARIA attribute.`;

  if (isArrayEmpty(suggestions)) {
    return {
      message,
    };
  }

  return {
    message: `${message} Did you mean to use ${suggestions}?`,
  };
};

// Create basic test cases using all valid role types.
const basicValidityTests = ariaAttributes.map(prop => ({
  code: `<div ${prop.toLowerCase()}="foobar" />`,
}));

ruleTester.run('aria-props', rule, {
  valid: [
    ...parsers.all([


      // Variables should pass, as we are only testing literals.
      { code: '<div />' },
      { code: '<div></div>' },
      { code: '<div aria="wee"></div>' }, // Needs aria-*
      { code: '<div abcARIAdef="true"></div>' },
      { code: '<div fooaria-foobar="true"></div>' },
      { code: '<div fooaria-hidden="true"></div>' },
      { code: '<Bar baz />' },
      { code: '<input type="text" aria-errormessage="foobar" />' },
    ]),
    ...basicValidityTests,
  ].map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<div aria-="foobar" />', errors: [errorMessage('aria-')] },
      {
        code: '<div aria-labeledby="foobar" />',
        errors: [errorMessage('aria-labeledby')],
      },
      {
        code: '<div aria-skldjfaria-klajsd="foobar" />',
        errors: [errorMessage('aria-skldjfaria-klajsd')],
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
