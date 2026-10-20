/**
 * @file Migrated from upstream no-access-key.spec.js
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import rule from '../../src/rules/no-access-key';

const ruleTester = new RuleTester();

const expectedError = {
  messageId: 'noAccessKey',
};

ruleTester.run('no-access-key', rule, {
  valid: parsers
    .all([
      { code: '<div />;' },
      { code: '<div {...props} />' },
      { code: '<div accessKey={undefined} />' },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<div accesskey="h" />', errors: [expectedError] },
      { code: '<div accessKey="h" />', errors: [expectedError] },
      { code: '<div accessKey="h" {...props} />', errors: [expectedError] },
      { code: '<div acCesSKeY="y" />', errors: [expectedError] },
      { code: '<div accessKey={"y"} />', errors: [expectedError] },
      { code: `<div accessKey={\`\${y}\`} />`, errors: [expectedError] },
      {
        code: `<div accessKey={\`\${undefined}y\${undefined}\`} />`,
        errors: [expectedError],
      },
      {
        code: `<div accessKey={\`This is \${bad}\`} />`,
        errors: [expectedError],
      },
      { code: '<div accessKey={accessKey} />', errors: [expectedError] },
      { code: `<div accessKey={\`\${undefined}\`} />`, errors: [expectedError] },
      {
        code: `<div accessKey={\`\${undefined}\${undefined}\`} />`,
        errors: [expectedError],
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
