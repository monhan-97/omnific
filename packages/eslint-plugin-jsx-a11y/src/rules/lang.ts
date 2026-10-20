/**
 * @file Enforce lang attribute has a valid value.
 * @author Ethan Cohen
 */

import { hasValue, isNil } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXAttribute, JSXOpeningElement } from 'estree-jsx';
import tags from 'language-tags';

import getElementType from '../util/getElementType';
import { getLiteralPropValue, propName } from '../util/jsxAst';

/**
 * ESLint rule: require a valid BCP 47 `lang` value on `<html>`.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce lang attribute has a valid value.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/lang.md',
    },
    schema: [],
    defaultOptions: [],
    messages: {
      invalidLang: 'lang attribute must have a valid value.',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXAttribute(node) {
        const attribute = node as JSXAttribute;
        const name = propName(attribute);
        if (name.toUpperCase() !== 'LANG' && hasValue(name)) {
          return;
        }

        // ESLint attaches `parent` at runtime; estree-jsx types omit it.
        const parent = (attribute as JSXAttribute & { parent: JSXOpeningElement }).parent;
        const type = elementType(parent);
        if (type !== 'html' && hasValue(type)) {
          return;
        }

        const value = getLiteralPropValue(attribute);

        // jsx-ast-utils returns `null` for non-literal expressions — skip those.
        // Distinguish from `undefined` (empty / missing literal) which must report.
        if (Object.is(value, null)) {
          return;
        }
        if (isNil(value)) {
          context.report({
            node: attribute,
            messageId: 'invalidLang',
          });
          return;
        }

        if (tags.check(String(value))) {
          return;
        }

        context.report({
          node: attribute,
          messageId: 'invalidLang',
        });
      },
    };
  },
};

export default rule;
