/**
 * @file Enforce tabIndex value is not greater than zero.
 * @author Ethan Cohen
 */

import rule from '../../src/rules/tabindex-no-positive';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import { RuleTester } from '../utils/ruleTester';

const ruleTester = new RuleTester();

const expectedError = {
  message: 'Avoid positive integer values for tabIndex.',
};

ruleTester.run('tabindex-no-positive', rule, {
  valid: parsers
    .all([
      { code: '<div />;' },
      { code: '<div {...props} />' },
      { code: '<div id="main" />' },
      { code: '<div tabIndex={undefined} />' },
      { code: `<div tabIndex={\`\${undefined}\`} />` },
      { code: `<div tabIndex={\`\${undefined}\${undefined}\`} />` },
      { code: '<div tabIndex={0} />' },
      { code: '<div tabIndex={-1} />' },
      { code: '<div tabIndex={null} />' },
      { code: '<div tabIndex={bar()} />' },
      { code: '<div tabIndex={bar} />' },
      { code: '<div tabIndex={"foobar"} />' },
      { code: '<div tabIndex="0" />' },
      { code: '<div tabIndex="-1" />' },
      { code: '<div tabIndex="-5" />' },
      { code: '<div tabIndex="-5.5" />' },
      { code: '<div tabIndex={-5.5} />' },
      { code: '<div tabIndex={-5} />' },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),

  invalid: parsers
    .all([
      { code: '<div tabIndex="1" />', errors: [expectedError] },
      { code: '<div tabIndex={1} />', errors: [expectedError] },
      { code: '<div tabIndex={"1"} />', errors: [expectedError] },
      { code: '<div tabIndex={`1`} />', errors: [expectedError] },
      { code: '<div tabIndex={1.589} />', errors: [expectedError] },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
