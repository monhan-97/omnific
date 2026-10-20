/**
 * @file Enforce html element has lang prop.
 * @author Ethan Cohen
 */

import { hasValue } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { getProp, getPropValue } from '../util/jsxAst';

/**
 * ESLint rule: require `lang` on `<html>` elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce `<html>` element has `lang` prop.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/html-has-lang.md',
    },
    schema: [],
    defaultOptions: [],
    messages: {
      missingLang: '<html> elements must have the lang prop.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const type = elementType(opening);

        if (type !== 'html' && hasValue(type)) {
          return;
        }

        const lang = getPropValue(getProp(opening.attributes, 'lang'));

        // Upstream uses a truthy check: empty string / false / 0 must still report.
        if (lang) {
          return;
        }

        context.report({
          node: opening,
          messageId: 'missingLang',
        });
      },
    };
  },
};

export default rule;
