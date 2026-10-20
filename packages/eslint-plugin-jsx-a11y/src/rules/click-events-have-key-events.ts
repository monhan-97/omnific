/**
 * @file Enforce a clickable non-interactive element has at least 1 keyboard
 *   event listener.
 * @author Ethan Cohen
 */

import { isNil } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import isInteractiveElement from '../util/isInteractiveElement';
import isPresentationRole from '../util/isPresentationRole';
import { getProp, hasAnyProp } from '../util/jsxAst';

const REQUIRED_KEY_PROPS = ['onkeydown', 'onkeyup', 'onkeypress'] as const;

/**
 * ESLint rule: click handlers on non-interactive elements need a keyboard listener.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce a clickable non-interactive element has at least one keyboard event listener.',
      url: 'https://github.com/monhan-97/omnific/tree/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/click-events-have-key-events.md',
    },
    schema: [],
    defaultOptions: [],
    messages: {
      missingKeyHandler:
        'Visible, non-interactive elements with click handlers must have at least one keyboard listener.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const props = opening.attributes;
        if (isNil(getProp(props, 'onclick'))) {
          return;
        }

        const type = elementType(opening);

        // Do not test higher level JSX components, as we do not know what
        // low-level DOM element this maps to.
        if (!dom.has(type) || isHiddenFromScreenReader(type, props) || isPresentationRole(type, props) || isInteractiveElement(type, props) || hasAnyProp(props, [...REQUIRED_KEY_PROPS])) {
          return;
        }

        // Visible, non-interactive elements with click handlers require one keyboard event listener.
        context.report({
          node: opening,
          messageId: 'missingKeyHandler',
        });
      },
    };
  },
};

export default rule;
