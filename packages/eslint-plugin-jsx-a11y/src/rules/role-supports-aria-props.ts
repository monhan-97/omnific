/**
 * @file Enforce that elements with explicit or implicit roles defined contain
 *   only `aria-*` properties supported by that `role`.
 * @author Ethan Cohen
 */

import { hasValue, isNil, isString } from '@omnific/utils';
import { aria, roles } from 'aria-query';
import type { ARIAProperty, ARIARoleDefinitionKey } from 'aria-query';
import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';

import getElementType from '../util/getElementType';
import getImplicitRole from '../util/getImplicitRole';
import { asRuleNode, getLiteralPropValue, getProp, getPropValue, propName } from '../util/jsxAst';

const invalidAriaPropsByRole = new Map<ARIARoleDefinitionKey, Set<ARIAProperty>>();

/**
 * Returns ARIA attributes that are not supported by `roleValue`.
 * @param roleValue - Concrete ARIA role name.
 * @param propKeyValues - Role property map from aria-query.
 * @returns Set of unsupported aria-* attribute names.
 */
function getInvalidAriaPropsForRole(
  roleValue: ARIARoleDefinitionKey,
  propKeyValues: Record<string, unknown>,
): Set<ARIAProperty> {
  const cached = invalidAriaPropsByRole.get(roleValue);
  if (hasValue(cached)) {
    return cached;
  }
  const invalid = new Set(
    aria.keys().filter(attribute => !Object.hasOwn(propKeyValues, attribute)),
  );
  invalidAriaPropsByRole.set(roleValue, invalid);
  return invalid;
}

/**
 * Enforce that elements with explicit or implicit roles defined contain only
 * `aria-*` properties supported by that `role`.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that elements with explicit or implicit roles defined contain only `aria-*` properties supported by that `role`.',
      url: 'https://github.com/monhan-97/omnific/blob/main/packages/eslint-plugin-jsx-a11y/docs/rules/role-supports-aria-props.md',
    },
    schema: [],
    messages: {
      unsupported:
        'The attribute {{attr}} is not supported by the role {{role}}.',
      unsupportedImplicit:
        'The attribute {{attr}} is not supported by the role {{role}}. This role is implicit on the element {{tag}}.',
    },
  },

  create(context: Rule.RuleContext) {
    const elementType = getElementType(context);

    return {
      JSXOpeningElement(node: JSXOpeningElement) {
        // If role is not explicitly defined, then try and get its implicit role.
        const type = elementType(node);
        const role = getProp(node.attributes, 'role');
        const roleValue = hasValue(role)
          ? getLiteralPropValue(role)
          : getImplicitRole(type, node.attributes);
        const isImplicit = hasValue(roleValue) && isNil(role);

        // If there is no explicit or implicit role, then assume that the element
        // can handle the global set of aria-* properties.
        // This actually isn't true - should fix in future release.
        if (!isString(roleValue)) {
          return;
        }

        const roleDefinition = roles.get(roleValue as ARIARoleDefinitionKey);
        if (isNil(roleDefinition)) {
          return;
        }

        // Make sure it has no aria-* properties defined outside its property set.
        const invalidAriaPropsForRole = getInvalidAriaPropsForRole(
          roleValue as ARIARoleDefinitionKey,
          roleDefinition.props as Record<string, unknown>,
        );

        for (const prop of node.attributes) {
          // Ignore the attribute if its value is null or undefined.
          // Ignore the attribute if it's a spread.
          if (prop.type === 'JSXSpreadAttribute' || isNil(getPropValue(prop))) {
            continue;
          }

          const name = propName(prop);
          if (invalidAriaPropsForRole.has(name as ARIAProperty)) {
            context.report({
              node: asRuleNode(node),
              messageId: isImplicit ? 'unsupportedImplicit' : 'unsupported',
              data: {
                attr: name,
                role: roleValue,
                tag: type,
              },
            });
          }
        }
      },
    };
  },
};

export default rule;
