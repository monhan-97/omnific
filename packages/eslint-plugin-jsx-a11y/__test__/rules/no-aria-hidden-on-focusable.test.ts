/**
 * @file Migrated from upstream no-aria-hidden-on-focusable.spec.js
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import rule from '../../src/rules/no-aria-hidden-on-focusable';

const ruleTester = new RuleTester();

const expectedError = {
  messageId: 'ariaHiddenOnFocusable',
};

ruleTester.run('no-aria-hidden-on-focusable', rule, {
  valid: parsers
    .all([
      { code: '<div aria-hidden="true" />;' },
      { code: '<div onClick={() => void 0} aria-hidden="true" />;' },
      { code: '<img aria-hidden="true" />' },
      { code: '<a aria-hidden="false" href="#" />' },
      { code: '<button aria-hidden="true" tabIndex="-1" />' },
      { code: '<button />' },
      { code: '<a href="/" />' },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      {
        code: '<div aria-hidden="true" tabIndex="0" />;',
        errors: [expectedError],
      },
      { code: '<input aria-hidden="true" />;', errors: [expectedError] },
      { code: '<a href="/" aria-hidden="true" />', errors: [expectedError] },
      { code: '<button aria-hidden="true" />', errors: [expectedError] },
      { code: '<textarea aria-hidden="true" />', errors: [expectedError] },
      {
        code: '<p tabindex="0" aria-hidden="true">text</p>;',
        errors: [expectedError],
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
