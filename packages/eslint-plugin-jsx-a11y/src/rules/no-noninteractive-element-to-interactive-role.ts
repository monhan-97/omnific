/**
 * @file Disallow inherently non-interactive elements to be assigned interactive
 *   roles.
 * @author Jesse Beach
 */

import { isArray, isPlainObject, isString } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXAttribute, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import getExplicitRole from '../util/getExplicitRole';
import isInteractiveRole from '../util/isInteractiveRole';
import isNonInteractiveElement from '../util/isNonInteractiveElement';
import { asRuleNode, propName } from '../util/jsxAst';

type AllowedRolesOptions = Record<string, string[]>;

/**
 * ESLint rule: disallow non-interactive elements being assigned interactive roles.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow non-interactive elements being assigned interactive roles.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-element-to-interactive-role.md',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true,
        },
        description:
          'An object mapping element types to arrays of interactive roles that are allowed for those elements.',
      },
    ],
    defaultOptions: [{}],
    messages: {
      noninteractiveToInteractive:
        'Non-interactive elements should not be assigned interactive roles.',
    },
  },

  create(context) {
    const options = context.options;
    const elementType = getElementType(context);
    return {
      JSXAttribute(attributeNode) {
        const attribute = attributeNode as JSXAttribute;
        const attributeName = propName(attribute);
        if (attributeName !== 'role') {
          return;
        }
        const node = asRuleNode(attributeNode).parent as JSXOpeningElement;
        const { attributes } = node;
        const type = elementType(node);
        const role = getExplicitRole(type, node.attributes);

        if (!dom.has(type)) {
          // Do not test higher level JSX components, as we do not know what
          // low-level DOM element this maps to.
          return;
        }
        // Allow overrides from rule configuration for specific elements and
        // roles.
        const allowedRoles = (options[0] ?? {}) as AllowedRolesOptions;
        if (
          isPlainObject(allowedRoles)
          && Object.hasOwn(allowedRoles, type)
          && isArray(allowedRoles[type])
          && isString(role)
          && allowedRoles[type].includes(role)
        ) {
          return;
        }
        if (
          isNonInteractiveElement(type, attributes)
          && isInteractiveRole(type, attributes)
        ) {
          context.report({
            node: attribute,
            messageId: 'noninteractiveToInteractive',
          });
        }
      },
    };
  },
};

export default rule;
