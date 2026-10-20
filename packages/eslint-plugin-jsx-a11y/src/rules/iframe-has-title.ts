/**
 * @file Enforce iframe elements have a title attribute.
 * @author Ethan Cohen
 */

import { hasValue, isString } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { getProp, getPropValue } from '../util/jsxAst';

/**
 * ESLint rule: require a string `title` on `<iframe>` elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce iframe elements have a title attribute.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/iframe-has-title.md',
    },
    schema: [],
    defaultOptions: [],
    messages: {
      missingTitle: '<iframe> elements must have a unique title property.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const type = elementType(opening);

        if (type !== 'iframe' && hasValue(type)) {
          return;
        }

        const title = getPropValue(getProp(opening.attributes, 'title'));

        // Upstream: truthy string only — empty string must still report.
        if (title && isString(title)) {
          return;
        }

        context.report({
          node: opening,
          messageId: 'missingTitle',
        });
      },
    };
  },
};

export default rule;
