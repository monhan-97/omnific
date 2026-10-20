/**
 * @file Migrated from upstream scope.spec.js
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import rule from '../../src/rules/scope';

const ruleTester = new RuleTester();

const expectedError = {
  messageId: 'scopeOnNonTh',
};

const componentsSettings = {
  'jsx-a11y': {
    components: {
      Foo: 'div',
      TableHeader: 'th',
    },
  },
};

ruleTester.run('scope', rule, {
  valid: parsers
    .all([
      { code: '<div />;' },
      { code: '<div foo />;' },
      { code: '<th scope />' },
      { code: '<th scope="row" />' },
      { code: '<th scope={foo} />' },
      { code: '<th scope={"col"} {...props} />' },
      { code: '<Foo scope="bar" {...props} />' },
      { code: '<TableHeader scope="row" />', settings: componentsSettings },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<div scope />', errors: [expectedError] },
      {
        code: '<Foo scope="bar" />',
        settings: componentsSettings,
        errors: [expectedError],
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
