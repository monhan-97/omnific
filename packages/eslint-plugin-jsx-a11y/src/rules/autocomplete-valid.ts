/**
 * @file Ensure autocomplete attribute is correct.
 * @author Wilco Fiers
 */

import { isArray, isString } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import { isValidAutocomplete } from '../util/autocomplete';
import getElementType from '../util/getElementType';
import { getLiteralPropValue, getProp } from '../util/jsxAst';
import readRuleOptions from '../util/readRuleOptions';

const schema = {
  type: 'object',
  properties: {
    inputComponents: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
} as const;

type AutocompleteValidOptions = {
  inputComponents: string[];
};

const DEFAULT_OPTIONS: AutocompleteValidOptions = { inputComponents: [] };

/**
 * ESLint rule: validate `autocomplete` attributes against the WHATWG autofill grammar.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that autocomplete attributes are used correctly.',
      url: 'https://github.com/monhan-97/omnific/blob/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/autocomplete-valid.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      invalidAutocomplete: 'the autocomplete attribute is incorrectly formatted',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    const { inputComponents } = readRuleOptions(context, DEFAULT_OPTIONS, raw => ({
      inputComponents: isArray(raw.inputComponents)
        ? raw.inputComponents.filter(isString)
        : DEFAULT_OPTIONS.inputComponents,
    }));
    const inputTypes = new Set(['input', ...inputComponents]);

    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const elType = elementType(opening);
        const autocomplete = getLiteralPropValue(getProp(opening.attributes, 'autocomplete'));

        if (!isString(autocomplete) || !inputTypes.has(elType)) {
          return;
        }

        const type = getLiteralPropValue(getProp(opening.attributes, 'type'));
        const inputType = isString(type) ? type : undefined;

        if (isValidAutocomplete(autocomplete, inputType)) {
          return;
        }

        context.report({
          node: opening,
          messageId: 'invalidAutocomplete',
        });
      },
    };
  },
};

export default rule;
