/**
 * @file Enforce scope prop is only used on <th> elements.
 * @author Ethan Cohen
 */

import { hasValue } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXAttribute, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { propName } from '../util/jsxAst';

/**
 * ESLint rule: restrict `scope` to `<th>` elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce `scope` prop is only used on `<th>` elements.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/scope.md',
    },
    schema: [],
    defaultOptions: [],
    messages: {
      scopeOnNonTh: 'The scope prop can only be used on <th> elements.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXAttribute(node) {
        const attribute = node as JSXAttribute;
        const name = propName(attribute);
        if (hasValue(name) && name.toUpperCase() !== 'SCOPE') {
          return;
        }

        // ESLint attaches `parent` at runtime; estree-jsx types omit it.
        const parent = (attribute as JSXAttribute & { parent: JSXOpeningElement }).parent;
        const tagName = elementType(parent);

        // Do not test higher level JSX components, as we do not know what
        // low-level DOM element this maps to.
        if (!dom.has(tagName)) {
          return;
        }
        if (hasValue(tagName) && tagName.toUpperCase() === 'TH') {
          return;
        }

        context.report({
          node: attribute,
          messageId: 'scopeOnNonTh',
        });
      },
    };
  },
};

export default rule;
