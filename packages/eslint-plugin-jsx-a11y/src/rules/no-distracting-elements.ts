/**
 * @file Enforce distracting elements are not used.
 * @author Ethan Cohen
 */

import { hasValue, isArray, isPlainObject, isString } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';

const DEFAULT_ELEMENTS = ['marquee', 'blink'] as const;

const schema = {
  type: 'object',
  properties: {
    elements: {
      type: 'array',
      items: { type: 'string', enum: DEFAULT_ELEMENTS },
      uniqueItems: true,
      additionalItems: false,
      minItems: 0,
    },
  },
  additionalProperties: false,
} as const;

type NoDistractingElementsOptions = {
  elements: string[];
};

const DEFAULT_OPTIONS: NoDistractingElementsOptions = {
  elements: [...DEFAULT_ELEMENTS],
};

/**
 * ESLint rule: disallow distracting deprecated elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce distracting elements are not used.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/no-distracting-elements.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      distracting:
        'Do not use <{{element}}> elements as they can create visual accessibility issues and are deprecated.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const raw = context.options[0];
        const elementOptions =
          hasValue(raw) &&
          isPlainObject(raw) &&
          isArray((raw as Partial<NoDistractingElementsOptions>).elements)
            ? (raw as NoDistractingElementsOptions).elements.filter(isString)
            : DEFAULT_OPTIONS.elements;
        const type = elementType(opening);
        const distractingElement = elementOptions.find(element => type === element);

        if (hasValue(distractingElement)) {
          context.report({
            node: opening,
            messageId: 'distracting',
            data: { element: distractingElement },
          });
        }
      },
    };
  },
};

export default rule;
