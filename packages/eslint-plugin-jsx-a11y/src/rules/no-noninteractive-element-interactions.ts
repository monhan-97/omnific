/**
 * @file Enforce non-interactive elements have no interactive handlers.
 * @author Jese Beach
 */

import { hasValue, isArray, isPlainObject } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import isAbstractRole from '../util/isAbstractRole';
import isContentEditable from '../util/isContentEditable';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import isInteractiveElement from '../util/isInteractiveElement';
import isInteractiveRole from '../util/isInteractiveRole';
import isNonInteractiveElement from '../util/isNonInteractiveElement';
import isNonInteractiveRole from '../util/isNonInteractiveRole';
import isPresentationRole from '../util/isPresentationRole';
import {
  type JsxAttributes,
  eventHandlersByType,
  getProp,
  getPropValue,
  hasProp,
  propName,
} from '../util/jsxAst';

const defaultInteractiveProps = [
  ...eventHandlersByType.focus,
  ...eventHandlersByType.image,
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
  },
  additionalProperties: {
    type: 'array',
    items: { type: 'string' },
    uniqueItems: true,
  },
} as const;

type NoninteractiveElementInteractionsOptions = {
  handlers?: string[];
} & Record<string, string[] | undefined>;

/**
 * ESLint rule: disallow interactive handlers on non-interactive elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow non-interactive elements being assigned mouse or keyboard event listeners.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/no-noninteractive-element-interactions.md',
    },
    schema: [schema],
    defaultOptions: [{ handlers: defaultInteractiveProps }],
    messages: {
      noninteractiveHandlers:
        'Non-interactive elements should not be assigned mouse or keyboard event listeners.',
    },
  },

  create(context) {
    const options = context.options;
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        let attributes: JsxAttributes = opening.attributes;
        const type = elementType(opening);
        const config = (options[0] ?? {
          handlers: defaultInteractiveProps,
        }) as NoninteractiveElementInteractionsOptions;
        const interactiveProps = isArray(config.handlers)
          ? config.handlers
          : defaultInteractiveProps;
        // Allow overrides from rule configuration for specific elements and roles.
        if (isPlainObject(config) && Object.hasOwn(config, type) && isArray(config[type])) {
          const allowedHandlers = config[type];
          attributes = attributes.filter(
            attr =>
              attr.type !== 'JSXSpreadAttribute'
              && !allowedHandlers.includes(propName(attr)),
          );
        }

        const hasInteractiveProps = interactiveProps.some(
          prop =>
            hasProp(attributes, prop)
            && hasValue(getPropValue(getProp(attributes, prop))),
        );

        // Do not test higher level JSX components, as we do not know what
        // low-level DOM element this maps to.
        // Presentation is an intentional signal from the author that this
        // element is not meant to be perceivable. For example, a click screen
        // to close a dialog .
        if (
          !hasInteractiveProps
          || !dom.has(type)
          || isContentEditable(type, attributes)
          || isHiddenFromScreenReader(type, attributes)
          || isPresentationRole(type, attributes)
        ) {
          return;
        }
        if (
          isInteractiveElement(type, attributes)
          || isInteractiveRole(type, attributes)
          || (
            !isNonInteractiveElement(type, attributes)
            && !isNonInteractiveRole(type, attributes)
          )
          || isAbstractRole(type, attributes)
        ) {
          // This rule has no opinion about abstract roles.
          return;
        }

        context.report({
          node: opening,
          messageId: 'noninteractiveHandlers',
        });
      },
    };
  },
};

export default rule;
