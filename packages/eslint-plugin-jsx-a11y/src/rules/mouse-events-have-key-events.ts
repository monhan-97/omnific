/**
 * @file Enforce onmouseover/onmouseout are accompanied by onfocus/onblur.
 * @author Ethan Cohen
 */

import { hasValue, isNil } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import { getProp, getPropValue } from '../util/jsxAst';

const schema = {
  type: 'object',
  properties: {
    hoverInHandlers: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
      description: 'An array of events that need to be accompanied by `onFocus`',
    },
    hoverOutHandlers: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
      description: 'An array of events that need to be accompanied by `onBlur`',
    },
  },
  additionalProperties: false,
} as const;

// Use `onMouseOver` and `onMouseOut` by default if no config is
// passed in for backwards compatibility
const DEFAULT_HOVER_IN_HANDLERS = ['onMouseOver'] as const;
const DEFAULT_HOVER_OUT_HANDLERS = ['onMouseOut'] as const;

type MouseEventsOptions = {
  hoverInHandlers?: string[];
  hoverOutHandlers?: string[];
};

/**
 * ESLint rule: pair mouse hover handlers with keyboard focus handlers.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that `onMouseOver`/`onMouseOut` are accompanied by `onFocus`/`onBlur` for keyboard-only users.',
      url: 'https://github.com/monhan-97/omnific/tree/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/mouse-events-have-key-events.md',
    },
    schema: [schema],
    defaultOptions: [
      {
        hoverInHandlers: [...DEFAULT_HOVER_IN_HANDLERS],
        hoverOutHandlers: [...DEFAULT_HOVER_OUT_HANDLERS],
      },
    ],
    messages: {
      missingFocus: '{{handler}} must be accompanied by onFocus for accessibility.',
      missingBlur: '{{handler}} must be accompanied by onBlur for accessibility.',
    },
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        if (opening.name.type !== 'JSXIdentifier') {
          return;
        }

        const { name } = opening.name;
        if (!dom.get(name)) {
          return;
        }

        const options = (context.options[0] ?? {}) as MouseEventsOptions;
        const hoverInHandlers = options.hoverInHandlers ?? [...DEFAULT_HOVER_IN_HANDLERS];
        const hoverOutHandlers = options.hoverOutHandlers ?? [...DEFAULT_HOVER_OUT_HANDLERS];
        const { attributes } = opening;

        // Check hover in / onfocus pairing
        const firstHoverInHandlerWithValue = hoverInHandlers.find(handler => {
          const prop = getProp(attributes, handler);
          const propValue = getPropValue(prop);
          return hasValue(propValue);
        });

        if (hasValue(firstHoverInHandlerWithValue)) {
          const onFocusProp = getProp(attributes, 'onFocus');
          const onFocusValue = getPropValue(onFocusProp);

          if (isNil(onFocusValue)) {
            context.report({
              node: getProp(attributes, firstHoverInHandlerWithValue) ?? opening,
              messageId: 'missingFocus',
              data: { handler: firstHoverInHandlerWithValue },
            });
          }
        }

        // Check hover out / onblur pairing
        const firstHoverOutHandlerWithValue = hoverOutHandlers.find(handler => {
          const prop = getProp(attributes, handler);
          const propValue = getPropValue(prop);
          return hasValue(propValue);
        });

        if (isNil(firstHoverOutHandlerWithValue)) {
          return;
        }

        const onBlurProp = getProp(attributes, 'onBlur');
        const onBlurValue = getPropValue(onBlurProp);

        if (isNil(onBlurValue)) {
          context.report({
            node: getProp(attributes, firstHoverOutHandlerWithValue) ?? opening,
            messageId: 'missingBlur',
            data: { handler: firstHoverOutHandlerWithValue },
          });
        }
      },
    };
  },
};

export default rule;
