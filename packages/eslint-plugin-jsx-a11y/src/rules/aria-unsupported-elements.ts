/**
 * @file Enforce that elements that do not support ARIA roles, states and
 *   properties do not have those attributes.
 * @author Ethan Cohen
 */

import { aria, dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { asRuleNode, propName } from '../util/jsxAst';

const invalidAttributes = new Set([...aria.keys(), 'role']);

/**
 * Enforce that elements that do not support ARIA roles, states, and properties
 * do not have those attributes.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/aria-unsupported-elements.md',
    },
    schema: [],
    messages: {
      unsupported:
        "This element does not support ARIA roles, states and properties. Try removing the prop '{{invalidProp}}'.",
    },
  },

  create(context: Rule.RuleContext) {
    const elementType = getElementType(context);

    return {
      JSXOpeningElement(node: JSXOpeningElement) {
        const nodeType = elementType(node);
        const nodeAttrs = dom.get(nodeType) || {};
        const { reserved: isReservedNodeType = false } = nodeAttrs;

        // If it's not reserved, then it can have aria-* roles, states, and properties
        if (!isReservedNodeType) {
          return;
        }

        for (const prop of node.attributes) {
          if (prop.type === 'JSXSpreadAttribute') {
            continue;
          }

          const name = propName(prop).toLowerCase();

          if (invalidAttributes.has(name)) {
            context.report({
              node: asRuleNode(node),
              messageId: 'unsupported',
              data: { invalidProp: name },
            });
          }
        }
      },
    };
  },
};

export default rule;
