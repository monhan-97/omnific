/**
 * @file Performs validity check on anchor hrefs. Warns when anchors are used as
 *   buttons.
 * @author Almero Steyn
 */

import { hasValue, isString } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { getProp, getPropValue } from '../util/jsxAst';
import readRuleOptions from '../util/readRuleOptions';

const allAspects = ['noHref', 'invalidHref', 'preferButton'] as const;

const schema = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    specialLink: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    aspects: {
      type: 'array',
      items: { type: 'string', enum: [...allAspects] },
      uniqueItems: true,
      additionalItems: false,
      minItems: 1,
    },
  },
  additionalProperties: false,
} as const;

type Aspect = (typeof allAspects)[number];

type AnchorIsValidOptions = {
  components: string[];
  specialLink: string[];
  aspects: Aspect[];
};

const DEFAULT_OPTIONS: AnchorIsValidOptions = {
  components: [],
  specialLink: [],
  aspects: [...allAspects],
};

/**
 * ESLint rule: enforce anchors are valid, navigable elements.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce all anchors are valid, navigable elements.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/anchor-is-valid.md',
    },
    schema: [schema],
    defaultOptions: [DEFAULT_OPTIONS],
    messages: {
      preferButton:
        'Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/blob/HEAD/docs/rules/anchor-is-valid.md',
      noHref:
        'The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/blob/HEAD/docs/rules/anchor-is-valid.md',
      invalidHref:
        'The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value. If you cannot provide a valid href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/blob/HEAD/docs/rules/anchor-is-valid.md',
    },
  },

  create(context) {
    const elementType = getElementType(context);
    const jsHrefRegexp = /^\W*?javascript:/;
    const options = readRuleOptions(context, DEFAULT_OPTIONS);
    const typeCheck = new Set(['a', ...options.components]);
    const aspects = new Set(options.aspects);
    const propsToValidate = ['href', ...options.specialLink];
    const activeAspects = {
      noHref: aspects.has('noHref'),
      invalidHref: aspects.has('invalidHref'),
      preferButton: aspects.has('preferButton'),
    };

    return {
      JSXOpeningElement(node) {
        const opening = node as JSXOpeningElement;
        const { attributes } = opening;
        const nodeType = elementType(opening);

        // Only check anchor elements and custom types.
        if (!typeCheck.has(nodeType)) {
          return;
        }

        const values = propsToValidate.map(prop => getPropValue(getProp(opening.attributes, prop)));
        // Checks if any actual or custom href prop is provided.
        const hasAnyHref = values.some(value => hasValue(value));
        // Need to check for spread operator as props can be spread onto the element
        // leading to an incorrect validation error.
        const hasSpreadOperator = attributes.some(prop => prop.type === 'JSXSpreadAttribute');
        const onClick = getProp(attributes, 'onClick');

        // When there is no href at all, specific scenarios apply:
        if (!hasAnyHref) {
          // If no spread operator is found and no onClick event is present
          // it is a link without href.
          if (
            !hasSpreadOperator
            && activeAspects.noHref
            && (!onClick || (onClick && !activeAspects.preferButton))
          ) {
            context.report({
              node: opening,
              messageId: 'noHref',
            });
          }
          // If no spread operator is found but an onClick is preset it should be a button.
          if (!hasSpreadOperator && onClick && activeAspects.preferButton) {
            context.report({
              node: opening,
              messageId: 'preferButton',
            });
          }
          return;
        }

        // Hrefs have been found, now check for validity.
        const invalidHrefValues = values.filter(
          value =>
            hasValue(value)
            && isString(value)
            && (value.length === 0 || value === '#' || jsHrefRegexp.test(value)),
        );
        if (invalidHrefValues.length > 0) {
          // If an onClick is found it should be a button, otherwise it is an invalid link.
          if (onClick && activeAspects.preferButton) {
            context.report({
              node: opening,
              messageId: 'preferButton',
            });
          } else if (activeAspects.invalidHref) {
            context.report({
              node: opening,
              messageId: 'invalidHref',
            });
          }
        }
      },
    };
  },
};

export default rule;
