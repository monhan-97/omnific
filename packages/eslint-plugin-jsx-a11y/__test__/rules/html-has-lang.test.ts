/**
 * @file Migrated from upstream html-has-lang.spec.js
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import rule from '../../src/rules/html-has-lang';

const ruleTester = new RuleTester();

const expectedError = {
  messageId: 'missingLang',
};

ruleTester.run('html-has-lang', rule, {
  valid: parsers
    .all([
      { code: '<div />;' },
      { code: '<html lang="en" />' },
      { code: '<html lang="en-US" />' },
      { code: '<html lang={foo} />' },
      { code: '<html lang />' },
      { code: '<HTML />' },
      {
        code: '<HTMLTop lang="en" />',
        settings: { 'jsx-a11y': { components: { HTMLTop: 'html' } } },
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<html />', errors: [expectedError] },
      { code: '<html {...props} />', errors: [expectedError] },
      { code: '<html lang={undefined} />', errors: [expectedError] },
      {
        code: '<HTMLTop />',
        errors: [expectedError],
        settings: { 'jsx-a11y': { components: { HTMLTop: 'html' } } },
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
