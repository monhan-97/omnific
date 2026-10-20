/**
 * @file Disallow tabindex on static and noninteractive elements
 * @author jessebeach
 */

import { hasValue, isNil, isUndefined } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import getTabIndex from '../util/getTabIndex';
import isInteractiveElement from '../util/isInteractiveElement';
import isInteractiveRole from '../util/isInteractiveRole';
import isNonLiteralProperty from '../util/isNonLiteralProperty';
import { getLiteralPropValue, getProp } from '../util/jsxAst';

const schema = {
  type: 'object',
  properties: {
    roles: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
      description: 'An array of ARIA roles',
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
      description: 'An array of HTML tag names',
    },
    allowExpressionValues: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
} as const;

type NoNoninteractiveTabindexOptions = {
  roles?: string[];
  tags?: string[];
  allowExpressionValues?: boolean;
};

/**
 * ESLint rule: allow `tabIndex` only on interactive elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce `tabIndex` only be declared on interactive elements.',
      url: 'https://github.com/monhan-97/omnific/tree/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-tabindex.md',
    },
    schema: [schema],
    defaultOptions: [{ roles: [], tags: [] }],
    messages: {
      noninteractiveTabIndex: '`tabIndex` should only be declared on interactive elements.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const type = elementType(opening);
        const { attributes } = opening;
        const tabIndexProp = getProp(attributes, 'tabIndex');
        const tabIndex = getTabIndex(tabIndexProp);
        // Early return;
        if (isUndefined(tabIndex)) {
          return;
        }
        const role = getLiteralPropValue(getProp(attributes, 'role'));

        if (!dom.has(type)) {
          // Do not test higher level JSX components, as we do not know what
          // low-level DOM element this maps to.
          return;
        }
        // Allow for configuration overrides.
        const options = (context.options[0] ?? {}) as NoNoninteractiveTabindexOptions;
        const tags = options.tags ?? [];
        const roles = options.roles ?? [];
        const { allowExpressionValues } = options;
        if (tags.includes(type)) {
          return;
        }
        if (hasValue(role) && roles.includes(String(role))) {
          return;
        }
        if (allowExpressionValues && isNonLiteralProperty(attributes, 'role')) {
          // Special case if role is assigned using ternary with literals on both side
          const roleProp = getProp(attributes, 'role');
          if (
            hasValue(roleProp)
            && roleProp.type === 'JSXAttribute'
            && hasValue(roleProp.value)
            && roleProp.value.type === 'JSXExpressionContainer'
           && roleProp.value.expression.type === 'ConditionalExpression' && 
                roleProp.value.expression.consequent.type === 'Literal'
                && roleProp.value.expression.alternate.type === 'Literal'
              ) {
                return;
              }
          return;
        }
        if (isInteractiveElement(type, attributes) || isInteractiveRole(type, attributes)) {
          return;
        }
        if (!isNil(tabIndex) && tabIndex >= 0) {
          context.report({
            node: tabIndexProp ?? opening,
            messageId: 'noninteractiveTabIndex',
          });
        }
      },
    };
  },
};

export default rule;
