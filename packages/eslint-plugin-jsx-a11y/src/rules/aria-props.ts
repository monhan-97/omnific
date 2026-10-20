/**
 * @file Enforce all aria-* properties are valid.
 * @author Ethan Cohen
 */

import { isArrayEmpty } from '@omnific/utils';
import { aria } from 'aria-query';
import type { ARIAProperty } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXAttribute } from 'estree-jsx';

import getSuggestion from '../util/getSuggestion';
import { asRuleNode, propName } from '../util/jsxAst';

const ariaAttributes = aria.keys();

/**
 * Enforce all `aria-*` props are valid.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce all `aria-*` props are valid.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/aria-props.md',
    },
    schema: [],
    messages: {
      invalidAriaProp: '{{name}}: This attribute is an invalid ARIA attribute.',
      invalidAriaPropSuggestion:
        '{{name}}: This attribute is an invalid ARIA attribute. Did you mean to use {{suggestions}}?',
    },
  },

  create(context: Rule.RuleContext) {
    return {
      JSXAttribute(attribute: JSXAttribute) {
        const name = propName(attribute);

        // `aria` needs to be prefix of property.
        if (!name.startsWith('aria-') || aria.has(name as ARIAProperty)) {
          return;
        }

        const suggestions = getSuggestion(name, ariaAttributes);
        if (isArrayEmpty(suggestions)) {
          context.report({
            node: asRuleNode(attribute),
            messageId: 'invalidAriaProp',
            data: { name },
          });
          return;
        }

        context.report({
          node: asRuleNode(attribute),
          messageId: 'invalidAriaPropSuggestion',
          data: { name, suggestions: String(suggestions) },
        });
      },
    };
  },
};

export default rule;
