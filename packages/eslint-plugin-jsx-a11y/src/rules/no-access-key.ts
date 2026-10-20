/**
 * @file Enforce no accesskey attribute on element.
 * @author Ethan Cohen
 */

import { hasValue } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import { getProp, getPropValue } from '../util/jsxAst';

/**
 * ESLint rule: disallow the `accessKey` prop.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that the `accessKey` prop is not used on any element to avoid complications with keyboard commands used by a screen reader.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/no-access-key.md',
    },
    schema: [],
    defaultOptions: [],
    messages: {
      noAccessKey:
        'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screen readers and keyboard-only users create a11y complications.',
    },
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const accessKey = getProp(opening.attributes, 'accesskey');
        const accessKeyValue = getPropValue(accessKey);

        // Upstream uses truthy checks on both the prop node and its value.
        if (accessKeyValue && hasValue(accessKey)) {
          context.report({
            node: opening,
            messageId: 'noAccessKey',
          });
        }
      },
    };
  },
};

export default rule;
