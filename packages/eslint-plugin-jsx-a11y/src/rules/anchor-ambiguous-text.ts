/**
 * @file Enforce anchor text to not exactly match 'click here', 'here', 'link',
 *   'learn more', and user-specified words.
 * @author Matt Wang
 */

import type { Rule } from 'eslint';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import getAccessibleChildText from '../util/getAccessibleChildText';
import getElementType from '../util/getElementType';
import { asRuleNode } from '../util/jsxAst';
import readRuleOptions from '../util/readRuleOptions';

const DEFAULT_AMBIGUOUS_WORDS = [
  'click here',
  'here',
  'link',
  'a link',
  'learn more',
] as const;

const schema = {
  type: 'object',
  properties: {
    words: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
} as const;

type AnchorAmbiguousTextOptions = {
  words: string[];
};

const DEFAULT_OPTIONS: AnchorAmbiguousTextOptions = {
  words: [...DEFAULT_AMBIGUOUS_WORDS],
};

/**
 * ESLint rule: enforce anchor text is not ambiguous.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce `<a>` text to not exactly match "click here", "here", "link", or "a link".',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/anchor-ambiguous-text.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      ambiguous:
        'Ambiguous text within anchor. Screen reader users rely on link text for context; the words "{{wordsList}}" are ambiguous and do not provide enough context.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    const typesToValidate = new Set(['a']);
    const { words } = readRuleOptions(context, DEFAULT_OPTIONS);
    const ambiguousWords = new Set(words);

    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const nodeType = elementType(opening);

        // Only check anchor elements and custom types.
        if (!typesToValidate.has(nodeType)) {
          return;
        }

        const nodeText = getAccessibleChildText(
          asRuleNode(opening).parent as JSXElement,
          elementType,
        );

        if (!ambiguousWords.has(nodeText)) {
          // check the value
          return;
        }

        context.report({
          node: opening,
          messageId: 'ambiguous',
          data: {
            wordsList: words.join('", "'),
          },
        });
      },
    };
  },
};

export default rule;
