/**
 * @file Migrated from upstream iframe-has-title.spec.js
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import rule from '../../src/rules/iframe-has-title';

const ruleTester = new RuleTester();

const expectedError = {
  messageId: 'missingTitle',
};

const componentsSettings = {
  'jsx-a11y': {
    components: {
      FooComponent: 'iframe',
    },
  },
};

ruleTester.run('iframe-has-title', rule, {
  valid: parsers
    .all([
      { code: '<div />;' },
      { code: '<iframe title="Unique title" />' },
      { code: '<iframe title={foo} />' },
      { code: '<FooComponent />' },
      {
        code: '<FooComponent title="Unique title" />',
        settings: componentsSettings,
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<iframe />', errors: [expectedError] },
      { code: '<iframe {...props} />', errors: [expectedError] },
      { code: '<iframe title={undefined} />', errors: [expectedError] },
      { code: '<iframe title="" />', errors: [expectedError] },
      { code: '<iframe title={false} />', errors: [expectedError] },
      { code: '<iframe title={true} />', errors: [expectedError] },
      { code: "<iframe title={''} />", errors: [expectedError] },
      { code: '<iframe title={``} />', errors: [expectedError] },
      { code: '<iframe title={""} />', errors: [expectedError] },
      { code: '<iframe title={42} />', errors: [expectedError] },
      {
        code: '<FooComponent />',
        errors: [expectedError],
        settings: componentsSettings,
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
