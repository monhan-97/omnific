/**
 * @file Enforce that elements with ARIA roles must have all required attributes
 *   for that role.
 * @author Ethan Cohen
 */

import { hasValue, isArrayEmpty, isNil } from '@omnific/utils';
import { dom, roles } from 'aria-query';
import type { ARIARoleDefinitionKey } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXAttribute, JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import isSemanticRoleElement from '../util/isSemanticRoleElement';
import { asRuleNode, getLiteralPropValue, getProp, propName } from '../util/jsxAst';

const roleKeys = new Set(roles.keys());

/** JSX attribute with ESLint-attached parent opening element. */
type JsxAttributeWithParent = JSXAttribute & { parent: JSXOpeningElement };

/**
 * Enforce that elements with ARIA roles must have all required attributes for that role.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that elements with ARIA roles must have all required attributes for that role.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/role-has-required-aria-props.md',
    },
    schema: [],
    messages: {
      missingRequired:
        'Elements with the ARIA role "{{role}}" must have the following attributes defined: {{requiredProps}}',
    },
  },

  create(context: Rule.RuleContext) {
    const elementType = getElementType(context);

    return {
      JSXAttribute(attribute: JSXAttribute) {
        const name = propName(attribute).toLowerCase();

        if (name !== 'role') {
          return;
        }

        // ESLint attaches `parent` at runtime; estree-jsx types omit it.
        const parent = (attribute as JsxAttributeWithParent).parent;
        const type = elementType(parent);
        if (isNil(dom.get(type))) {
          return;
        }

        const roleAttrValue = getLiteralPropValue(attribute);
        const { attributes } = parent;

        // If value is undefined, then the role attribute will be dropped in the DOM.
        // If value is null, then getLiteralAttributeValue is telling us
        // that the value isn't in the form of a literal.
        if (isNil(roleAttrValue)) {
          return;
        }

        const normalizedValues = String(roleAttrValue).toLowerCase().split(' ');
        const validRoles = normalizedValues.filter(val =>
          roleKeys.has(val as ARIARoleDefinitionKey),
        );

        // Check semantic DOM elements
        // For example, <input type="checkbox" role="switch" />
        if (isSemanticRoleElement(type, attributes)) {
          return;
        }

        // Check arbitrary DOM elements
        for (const role of validRoles) {
          const roleDefinition = roles.get(role as ARIARoleDefinitionKey);
          if (isNil(roleDefinition)) {
            continue;
          }

          const { requiredProps: requiredPropKeyValues } = roleDefinition;
          const requiredProps = Object.keys(requiredPropKeyValues);

          if (isArrayEmpty(requiredProps)) {
            continue;
          }

          const hasRequiredProps = requiredProps.every(prop =>
            hasValue(getProp(attributes, prop)),
          );
          if (hasRequiredProps) {
            continue;
          }

          context.report({
            node: asRuleNode(attribute),
            messageId: 'missingRequired',
            data: {
              role: role.toLowerCase(),
              requiredProps: String(requiredProps).toLowerCase(),
            },
          });
        }
      },
    };
  },
};

export default rule;
