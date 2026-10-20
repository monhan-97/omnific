/**
 * @file Enforce tabIndex value is not greater than zero.
 * @author Ethan Cohen
 */

import type { Rule } from 'eslint';
import type { JSXAttribute } from 'estree-jsx';

import { getLiteralPropValue, propName } from '../util/jsxAst';

/**
 * ESLint rule: disallow positive `tabIndex` values.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce `tabIndex` value is not greater than zero.',
      url: 'https://github.com/monhan-97/omnific/tree/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/tabindex-no-positive.md',
    },
    schema: [],
    defaultOptions: [],
    messages: {
      positiveTabIndex: 'Avoid positive integer values for tabIndex.',
    },
  },

  create(context) {
    return {
      JSXAttribute(node) {
        const attribute = node as JSXAttribute;
        const name = propName(attribute).toUpperCase();

        // Check if tabIndex is the attribute
        if (name !== 'TABINDEX') {
          return;
        }

        // Only check literals because we can't infer values from certain expressions.
        const value = Number(getLiteralPropValue(attribute));

        if (Number.isNaN(value) || value <= 0) {
          return;
        }

        context.report({
          node: attribute,
          messageId: 'positiveTabIndex',
        });
      },
    };
  },
};

export default rule;
