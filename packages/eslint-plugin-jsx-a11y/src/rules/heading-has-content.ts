/**
 * @file Enforce heading (h1, h2, etc) elements contain accessible content.
 * @author Ethan Cohen
 */

import type { Rule } from 'eslint';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import hasAccessibleChild from '../util/hasAccessibleChild';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import { asRuleNode } from '../util/jsxAst';
import readRuleOptions from '../util/readRuleOptions';

const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

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

type HeadingHasContentOptions = {
  components: string[];
};

const DEFAULT_OPTIONS: HeadingHasContentOptions = { components: [] };

/**
 * ESLint rule: enforce headings contain accessible content.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce heading (`h1`, `h2`, etc) elements contain accessible content.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/heading-has-content.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      missingContent:
        'Headings must have content and the content must be accessible by a screen reader.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    const { components } = readRuleOptions(context, DEFAULT_OPTIONS);
    const typeCheck = new Set([...headings, ...components]);

    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const nodeType = elementType(opening);

        // Only check 'h*' elements and custom types.
        if (
          !typeCheck.has(nodeType)
          || hasAccessibleChild(asRuleNode(opening).parent as JSXElement, elementType)
          || isHiddenFromScreenReader(nodeType, opening.attributes)
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
