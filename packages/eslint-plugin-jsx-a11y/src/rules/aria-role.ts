/**
 * @file Enforce aria role attribute is valid.
 * @author Ethan Cohen
 */

import { hasValue, isBoolean, isNil } from '@omnific/utils';
import { dom, roles } from 'aria-query';
import type { ARIARoleDefinitionKey } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXAttribute, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import { asRuleNode, getLiteralPropValue, propName } from '../util/jsxAst';

/** JSX attribute with ESLint-attached parent opening element. */
type JsxAttributeWithParent = JSXAttribute & { parent: JSXOpeningElement };

const errorMessage =
  'Elements with ARIA roles must use a valid, non-abstract ARIA role.';

const schema = {
  type: 'object',
  properties: {
    allowedInvalidRoles: {
      items: {
        type: 'string',
      },
      type: 'array',
      uniqueItems: true,
    },
    ignoreNonDOM: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
} as const;

const validRoles = new Set(
  roles.keys().filter(role => {
    const definition = roles.get(role);
    return hasValue(definition) && definition.abstract === false;
  }),
);

type AriaRoleOptions = {
  /** Roles that should be accepted even when not in the ARIA role set. */
  allowedInvalidRoles?: string[];
  /** When true, skip non-DOM elements. */
  ignoreNonDOM?: boolean;
};

/**
 * Enforce that elements with ARIA roles must use a valid, non-abstract ARIA role.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that elements with ARIA roles must use a valid, non-abstract ARIA role.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/aria-role.md',
    },
    schema: [schema],
    defaultOptions: [{ allowedInvalidRoles: [], ignoreNonDOM: false }],
    messages: {
      invalidRole: errorMessage,
    },
  },

  create(context: Rule.RuleContext) {
    const options = (context.options[0] ?? {
      allowedInvalidRoles: [],
      ignoreNonDOM: false,
    }) as AriaRoleOptions;
    const ignoreNonDOM = isBoolean(options.ignoreNonDOM) ? options.ignoreNonDOM : false;
    const allowedInvalidRoles = new Set(options.allowedInvalidRoles);
    const elementType = getElementType(context);

    return {
      JSXAttribute(attribute: JSXAttribute) {
        // If ignoreNonDOM and the parent isn't DOM, don't run rule.
        if (ignoreNonDOM) {
          // ESLint attaches `parent` at runtime; estree-jsx types omit it.
          const parent = (attribute as JsxAttributeWithParent).parent;
          const type = elementType(parent);
          if (isNil(dom.get(type))) {
            return;
          }
        }

        // Get prop name
        const name = propName(attribute).toUpperCase();

        if (name !== 'ROLE') {
          return;
        }

        const value = getLiteralPropValue(attribute);

        // If value is undefined, then the role attribute will be dropped in the DOM.
        // If value is null, then getLiteralAttributeValue is telling us that the
        // value isn't in the form of a literal.
        if (isNil(value)) {
          return;
        }

        const values = String(value).split(' ');
        const isValid = values.every(
          val =>
            allowedInvalidRoles.has(val)
            || validRoles.has(val as ARIARoleDefinitionKey),
        );

        if (isValid) {
          return;
        }

        context.report({
          node: asRuleNode(attribute),
          messageId: 'invalidRole',
        });
      },
    };
  },
};

export default rule;
