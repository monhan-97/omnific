/**
 * @file Enforce aria-hidden is not used on interactive elements or contain
 *   interactive elements.
 * @author Kate Higa
 */

import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import isFocusable from '../util/isFocusable';
import { getProp, getPropValue } from '../util/jsxAst';

/**
 * ESLint rule: disallow `aria-hidden="true"` on focusable elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow `aria-hidden="true"` from being set on focusable elements.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/no-aria-hidden-on-focusable.md',
    },
    schema: [],
    defaultOptions: [],
    messages: {
      ariaHiddenOnFocusable:
        'aria-hidden="true" must not be set on focusable elements.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const { attributes } = opening;
        const type = elementType(opening);
        const isAriaHidden = getPropValue(getProp(attributes, 'aria-hidden')) === true;

        if (isAriaHidden && isFocusable(type, attributes)) {
          context.report({
            node: opening,
            messageId: 'ariaHiddenOnFocusable',
          });
        }
      },
    };
  },
};

export default rule;
