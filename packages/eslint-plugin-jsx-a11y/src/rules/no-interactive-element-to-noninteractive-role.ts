/**
 * @file Disallow inherently interactive elements to be assigned non-interactive
 *   roles.
 * @author Jesse Beach
 */

import { isArray, isPlainObject, isString } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXAttribute, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import isInteractiveElement from '../util/isInteractiveElement';
import isNonInteractiveRole from '../util/isNonInteractiveRole';
import isPresentationRole from '../util/isPresentationRole';
import { asRuleNode, getLiteralPropValue, getProp, propName } from '../util/jsxAst';

type AllowedRolesOptions = Record<string, string[]>;

/**
 * ESLint rule: disallow interactive elements being assigned non-interactive roles.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow interactive elements being assigned non-interactive roles.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/no-interactive-element-to-noninteractive-role.md',
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
          'An object mapping element types to arrays of non-interactive roles that are allowed for those elements.',
      },
    ],
    defaultOptions: [{}],
    messages: {
      interactiveToNoninteractive:
        'Interactive elements should not be assigned non-interactive roles.',
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
        const role = getLiteralPropValue(getProp(node.attributes, 'role'));

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
          isInteractiveElement(type, attributes)
          && (
            isNonInteractiveRole(type, attributes)
            || isPresentationRole(type, attributes)
          )
        ) {
          context.report({
            node: attribute,
            messageId: 'interactiveToNoninteractive',
          });
        }
      },
    };
  },
};

export default rule;
