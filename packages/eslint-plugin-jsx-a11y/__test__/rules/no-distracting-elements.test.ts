/**
 * @file Migrated from upstream no-distracting-elements.spec.js
 */

import { RuleTester } from '../utils/ruleTester';
import parserOptionsMapper from '../utils/parserOptionsMapper';
import parsers from '../utils/parsers';
import rule from '../../src/rules/no-distracting-elements';

const ruleTester = new RuleTester();

const expectedError = (element: string) => ({
  messageId: 'distracting' as const,
  data: { element },
});

const componentsSettings = {
  'jsx-a11y': {
    components: {
      Blink: 'blink',
    },
  },
};

ruleTester.run('no-distracting-elements', rule, {
  valid: parsers
    .all([
      { code: '<div />;' },
      { code: '<Marquee />' },
      { code: '<div marquee />' },
      { code: '<Blink />' },
      { code: '<div blink />' },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      { code: '<marquee />', errors: [expectedError('marquee')] },
      { code: '<marquee {...props} />', errors: [expectedError('marquee')] },
      {
        code: '<marquee lang={undefined} />',
        errors: [expectedError('marquee')],
      },
      { code: '<blink />', errors: [expectedError('blink')] },
      { code: '<blink {...props} />', errors: [expectedError('blink')] },
      { code: '<blink foo={undefined} />', errors: [expectedError('blink')] },
      {
        code: '<Blink />',
        settings: componentsSettings,
        errors: [expectedError('blink')],
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
