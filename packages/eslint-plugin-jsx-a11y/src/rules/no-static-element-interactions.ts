/**
 * @file Enforce static elements have no interactive handlers.
 * @author Ethan Cohen
 */

import { hasValue, isArray, isBoolean, isPlainObject } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import isAbstractRole from '../util/isAbstractRole';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import isInteractiveElement from '../util/isInteractiveElement';
import isInteractiveRole from '../util/isInteractiveRole';
import isNonInteractiveElement from '../util/isNonInteractiveElement';
import isNonInteractiveRole from '../util/isNonInteractiveRole';
import isNonLiteralProperty from '../util/isNonLiteralProperty';
import isPresentationRole from '../util/isPresentationRole';
import { eventHandlersByType, getProp, getPropValue, hasProp } from '../util/jsxAst';

const defaultInteractiveProps = [
  ...eventHandlersByType.focus,
  ...eventHandlersByType.keyboard,
  ...eventHandlersByType.mouse,
];

const schema = {
  type: 'object',
  properties: {
    handlers: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    allowExpressionValues: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
} as const;

type StaticElementInteractionsOptions = {
  handlers?: string[];
  allowExpressionValues?: boolean;
};

/**
 * ESLint rule: enforce static elements do not carry interactive handlers.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that non-interactive, visible elements (such as `<div>`) that have click handlers use the role attribute.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/no-static-element-interactions.md',
    },
    schema: [schema],
    defaultOptions: [{ handlers: defaultInteractiveProps }],
    messages: {
      staticHandlers:
        'Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.',
    },
  },

  create(context) {
    const options = context.options;
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const { attributes } = opening;
        const type = elementType(opening);

        const config = (options[0] ?? {
          handlers: defaultInteractiveProps,
        }) as StaticElementInteractionsOptions;
        const allowExpressionValues = isPlainObject(config) && isBoolean(config.allowExpressionValues)
          ? config.allowExpressionValues
          : undefined;
        const handlers = isArray(config.handlers) ? config.handlers : defaultInteractiveProps;

        const hasInteractiveProps = handlers.some(
          prop =>
            hasProp(attributes, prop)
            && hasValue(getPropValue(getProp(attributes, prop))),
        );

        // Do not test higher level JSX components, as we do not know what
        // low-level DOM element this maps to.
        // Presentation is an intentional signal from the author that this
        // element is not meant to be perceivable. For example, a click screen
        // to close a dialog .
        // This rule has no opinion about abstract roles.
        if (
          !hasInteractiveProps
          || !dom.has(type)
          || isHiddenFromScreenReader(type, attributes)
          || isPresentationRole(type, attributes)
          || isInteractiveElement(type, attributes)
          || isInteractiveRole(type, attributes)
          || isNonInteractiveElement(type, attributes)
          || isNonInteractiveRole(type, attributes)
          || isAbstractRole(type, attributes)
        ) {
          return;
        }

        if (
          allowExpressionValues === true
          && isNonLiteralProperty(attributes, 'role')
        ) {
          // Special case if role is assigned using ternary with literals on both side
          const roleProp = getProp(attributes, 'role');
          if (
            hasValue(roleProp)
            && roleProp.type === 'JSXAttribute'
            && hasValue(roleProp.value)
            && roleProp.value.type === 'JSXExpressionContainer'
          ) {
            const { expression } = roleProp.value;
            if (expression.type === 'ConditionalExpression' && 
                expression.consequent.type === 'Literal'
                && expression.alternate.type === 'Literal'
              ) {
                return;
              }
          }
          return;
        }

        context.report({
          node: opening,
          messageId: 'staticHandlers',
        });
      },
    };
  },
};

export default rule;
