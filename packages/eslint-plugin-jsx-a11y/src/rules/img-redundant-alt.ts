/**
 * @file Enforce img alt attribute does not have the word image, picture, or
 *   photo.
 * @author Ethan Cohen
 */

import { isNil, isString } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import { getLiteralPropValue, getProp } from '../util/jsxAst';
import readRuleOptions from '../util/readRuleOptions';

const REDUNDANT_WORDS = ['image', 'photo', 'picture'] as const;

const schema = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    words: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
} as const;

const ASCII_REGEXP = /[\u{20}-\u{7F}]+/u;

type ImgRedundantAltOptions = {
  components: string[];
  words: string[];
};

const DEFAULT_OPTIONS: ImgRedundantAltOptions = { components: [], words: [] };

/**
 * Returns whether `value` contains a redundant alt word.
 * @param value - Alt text.
 * @param redundantWords - Lowercased words treated as redundant.
 * @returns `true` when a redundant word is present.
 */
function containsRedundantWord(value: string, redundantWords: ReadonlySet<string>): boolean {
  if (ASCII_REGEXP.test(value)) {
    return value.split(/\s+/).some(valueWord => redundantWords.has(valueWord.toLowerCase()));
  }

  const lower = value.toLowerCase();
  for (const redundantWord of redundantWords) {
    if (lower.includes(redundantWord)) {
      return true;
    }
  }
  return false;
}

/**
 * ESLint rule: enforce img alt text does not contain redundant words.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce `<img>` alt prop does not contain the word "image", "picture", or "photo".',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/img-redundant-alt.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      redundant:
        'Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt prop.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    const options = readRuleOptions(context, DEFAULT_OPTIONS);
    const typeCheck = new Set(['img', ...options.components]);
    const redundantWords = new Set(
      [...REDUNDANT_WORDS, ...options.words].map(word => word.toLowerCase()),
    );

    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const nodeType = elementType(opening);

        // Only check img elements and custom types.
        if (!typeCheck.has(nodeType)) {
          return;
        }

        const altProp = getProp(opening.attributes, 'alt');
        // Return if alt prop is not present.
        if (isNil(altProp)) {
          return;
        }

        const value = getLiteralPropValue(altProp);
        const isVisible = !isHiddenFromScreenReader(nodeType, opening.attributes);

        if (!isVisible || !isString(value)) {
          return;
        }

        if (containsRedundantWord(value, redundantWords)) {
          context.report({
            node: opening,
            messageId: 'redundant',
          });
        }
      },
    };
  },
};

export default rule;
