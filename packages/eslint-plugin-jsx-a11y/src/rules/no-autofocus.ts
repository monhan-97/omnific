/**
 * @file Enforce autoFocus prop is not used.
 * @author Ethan Cohen <@evcohen>
 */

import { hasValue, isPlainObject } from '@omnific/utils';
import { dom } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXAttribute, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { getPropValue, propName } from '../util/jsxAst';

const schema = {
  type: 'object',
  properties: {
    ignoreNonDOM: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
} as const;

type NoAutofocusOptions = {
  ignoreNonDOM: boolean;
};

const DEFAULT_OPTIONS: NoAutofocusOptions = { ignoreNonDOM: false };

/**
 * ESLint rule: disallow enabling the `autoFocus` prop.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce autoFocus prop is not enabled.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/no-autofocus.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      noAutofocus:
        'The autoFocus prop should not be enabled, as it can reduce usability and accessibility for users.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXAttribute(node) {
        const attribute = node as JSXAttribute;
        const raw = context.options[0];
        const options: NoAutofocusOptions =
          hasValue(raw) && isPlainObject(raw)
            ? {
                ignoreNonDOM:
                  (raw as Partial<NoAutofocusOptions>).ignoreNonDOM === true,
              }
            : DEFAULT_OPTIONS;

        if (options.ignoreNonDOM) {
          // ESLint attaches `parent` at runtime; estree-jsx types omit it.
          const parent = (attribute as JSXAttribute & { parent: JSXOpeningElement }).parent;
          const type = elementType(parent);
          if (!dom.get(type)) {
            return;
          }
        }

        // Fail if autoFocus is used and the value is anything other than false
        // (either via an expression or string literal).
        const value = getPropValue(attribute);
        if (value !== false && value !== 'false' && propName(attribute) === 'autoFocus') {
          context.report({
            node: attribute,
            messageId: 'noAutofocus',
          });
        }
      },
    };
  },
};

export default rule;
