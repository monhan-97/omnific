/**
 * @file Migrated from upstream no-autofocus.spec.js
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import rule from '../../src/rules/no-autofocus';

const ruleTester = new RuleTester();

const expectedError = {
  messageId: 'noAutofocus',
};

const ignoreNonDOMSchema = [
  {
    ignoreNonDOM: true,
  },
];

const componentsSettings = {
  'jsx-a11y': {
    components: {
      Button: 'button',
    },
  },
};

ruleTester.run('no-autofocus', rule, {
  valid: parsers
    .all([
      { code: '<div />;' },
      { code: '<div autofocus />;' },
      { code: '<input autofocus="true" />;' },
      { code: '<Foo bar />' },
      { code: '<div autoFocus={false} />' },
      { code: '<div autoFocus="false" />' },
      { code: '<Foo autoFocus />', options: ignoreNonDOMSchema },
      { code: '<div><div autofocus /></div>', options: ignoreNonDOMSchema },
      { code: '<Button />', settings: componentsSettings },
      {
        code: '<Button />',
        options: ignoreNonDOMSchema,
        settings: componentsSettings,
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<div autoFocus />', errors: [expectedError] },
      { code: '<div autoFocus={true} />', errors: [expectedError] },
      { code: '<div autoFocus={undefined} />', errors: [expectedError] },
      { code: '<div autoFocus="true" />', errors: [expectedError] },
      { code: '<input autoFocus />', errors: [expectedError] },
      { code: '<Foo autoFocus />', errors: [expectedError] },
      {
        code: '<Button autoFocus />',
        errors: [expectedError],
        settings: componentsSettings,
      },
      {
        code: '<Button autoFocus />',
        errors: [expectedError],
        options: ignoreNonDOMSchema,
        settings: componentsSettings,
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
