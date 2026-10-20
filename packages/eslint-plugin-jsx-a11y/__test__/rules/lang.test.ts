/**
 * @file Migrated from upstream lang.spec.js
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import rule from '../../src/rules/lang';

const ruleTester = new RuleTester();

const expectedError = {
  messageId: 'invalidLang',
};

const componentsSettings = {
  'jsx-a11y': {
    polymorphicPropName: 'as',
    components: {
      Foo: 'html',
    },
  },
};

ruleTester.run('lang', rule, {
  valid: parsers
    .all([
      { code: '<div />;' },
      { code: '<div foo="bar" />;' },
      { code: '<div lang="foo" />;' },
      { code: '<html lang="en" />' },
      { code: '<html lang="en-US" />' },
      { code: '<html lang="zh-Hans" />' },
      { code: '<html lang="zh-Hant-HK" />' },
      { code: '<html lang="zh-yue-Hant" />' },
      { code: '<html lang="ja-Latn" />' },
      { code: '<html lang={foo} />' },
      { code: '<HTML lang="foo" />' },
      { code: '<Foo lang={undefined} />' },
      { code: '<Foo lang="en" />', settings: componentsSettings },
      { code: '<Box as="html" lang="en"  />', settings: componentsSettings },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<html lang="foo" />', errors: [expectedError] },
      { code: '<html lang="zz-LL" />', errors: [expectedError] },
      { code: '<html lang={undefined} />', errors: [expectedError] },
      {
        code: '<Foo lang={undefined} />',
        settings: componentsSettings,
        errors: [expectedError],
      },
      {
        code: '<Box as="html" lang="foo" />',
        settings: componentsSettings,
        errors: [expectedError],
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
