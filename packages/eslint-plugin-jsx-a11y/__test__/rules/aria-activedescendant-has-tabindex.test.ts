/**
 * @file Enforce elements with aria-activedescendant are tabbable.
 * @author Jesse Beach <@jessebeach>
 */

import rule from '../../src/rules/aria-activedescendant-has-tabindex';
import { RuleTester } from '../utils/ruleTester';
import parsers from '../utils/parsers';
import parserOptionsMapper from '../utils/parserOptionsMapper';

const ruleTester = new RuleTester();

const expectedError = {
  messageId: 'hasTabIndex' as const,
};

ruleTester.run('aria-activedescendant-has-tabindex', rule, {
  valid: parsers
    .all([
      {
        code: '<CustomComponent />;',
      },
      {
        code: '<CustomComponent aria-activedescendant={someID} />;',
      },
      {
        code: '<CustomComponent aria-activedescendant={someID} tabIndex={0} />;',
      },
      {
        code: '<CustomComponent aria-activedescendant={someID} tabIndex={-1} />;',
      },
      {
        code: '<CustomComponent aria-activedescendant={someID} tabIndex={0} />;',
        settings: {
          'jsx-a11y': { components: { CustomComponent: 'div' } },
        },
      },
      {
        code: '<div />;',
      },
      {
        code: '<input />;',
      },
      {
        code: '<div tabIndex={0} />;',
      },
      {
        code: '<div aria-activedescendant={someID} tabIndex={0} />;',
      },
      {
        code: '<div aria-activedescendant={someID} tabIndex="0" />;',
      },
      {
        code: '<div aria-activedescendant={someID} tabIndex={1} />;',
      },
      {
        code: '<input aria-activedescendant={someID} />;',
      },
      {
        code: '<input aria-activedescendant={someID} tabIndex={1} />;',
      },
      {
        code: '<input aria-activedescendant={someID} tabIndex={0} />;',
      },
      {
        code: '<input aria-activedescendant={someID} tabIndex={-1} />;',
      },
      {
        code: '<div aria-activedescendant={someID} tabIndex={-1} />;',
      },
      {
        code: '<div aria-activedescendant={someID} tabIndex="-1" />;',
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
  invalid: parsers
    .all([
      {
        code: '<div aria-activedescendant={someID} />;',
        errors: [expectedError],
      },
      {
        code: '<CustomComponent aria-activedescendant={someID} />;',
        errors: [expectedError],
        settings: {
          'jsx-a11y': { components: { CustomComponent: 'div' } },
        },
      },
    ])
    .map((testCase) => parserOptionsMapper(testCase)),
});
