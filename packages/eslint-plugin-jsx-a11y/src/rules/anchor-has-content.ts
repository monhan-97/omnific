/**
 * @file Enforce anchor elements to contain accessible content.
 * @author Lisa Ring & Niklas Holmberg
 */

import type { Rule } from 'eslint';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import hasAccessibleChild from '../util/hasAccessibleChild';
import { asRuleNode, hasAnyProp } from '../util/jsxAst';
import readRuleOptions from '../util/readRuleOptions';

const schema = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
} as const;

type AnchorHasContentOptions = {
  components: string[];
};

const DEFAULT_OPTIONS: AnchorHasContentOptions = { components: [] };

/**
 * ESLint rule: enforce anchors contain accessible content.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce all anchors to contain accessible content.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/anchor-has-content.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      missingContent:
        'Anchors must have content and the content must be accessible by a screen reader.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    const { components } = readRuleOptions(context, DEFAULT_OPTIONS);
    const typeCheck = new Set(['a', ...components]);

    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const nodeType = elementType(opening);

        // Only check anchor elements and custom types.
        if (
          !typeCheck.has(nodeType)
          || hasAccessibleChild(asRuleNode(opening).parent as JSXElement, elementType)
          || hasAnyProp(opening.attributes, ['title', 'aria-label'])
        ) {
          return;
        }

        context.report({
          node: opening,
          messageId: 'missingContent',
        });
      },
    };
  },
};

export default rule;
