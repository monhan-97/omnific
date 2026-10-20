/**
 * @file Enforce elements with aria-activedescendant are tabbable.
 * @author Jesse Beach <@jessebeach>
 */

import { hasValue, isNil } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import getTabIndex from '../util/getTabIndex';
import isInteractiveElement from '../util/isInteractiveElement';
import { asRuleNode, getProp } from '../util/jsxAst';

const errorMessage =
  'An element that manages focus with `aria-activedescendant` must have a tabindex';

/**
 * Enforce elements with aria-activedescendant are tabbable.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce elements with aria-activedescendant are tabbable.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/aria-activedescendant-has-tabindex.md',
    },
    schema: [],
    messages: {
      hasTabIndex: errorMessage,
    },
  },

  create(context: Rule.RuleContext) {
    const elementType = getElementType(context);

    return {
      JSXOpeningElement(node: JSXOpeningElement) {
        const { attributes } = node;

        if (isNil(getProp(attributes, 'aria-activedescendant'))) {
          return;
        }

        const type = elementType(node);
        // Do not test higher level JSX components, as we do not know what
        // low-level DOM element this maps to.
        if (!dom.has(type)) {
          return;
        }

        const tabIndex = getTabIndex(getProp(attributes, 'tabIndex'));

        // If this is an interactive element and the tabindex attribute is not specified,
        // or the tabIndex property was not mutated, then the tabIndex
        // property will be undefined.
        if (isInteractiveElement(type, attributes) && isNil(tabIndex)) {
          return;
        }

        if (hasValue(tabIndex) && tabIndex >= -1) {
          return;
        }

        context.report({
          node: asRuleNode(node),
          messageId: 'hasTabIndex',
        });
      },
    };
  },
};

export default rule;
