/**
 * @fileoverview Returns whether an element has an interactive ARIA role.
 */

import { hasValue, isNil } from '@omnific/utils';

import { interactiveRolesForRoleAttr } from './ariaTables';
import firstValidRole from './firstValidRole';
import { type JsxAttributes, getLiteralPropValue, getProp } from './jsxAst';

/**
 * Returns whether the element has a role associated with an interactive component.
 * @param _tagName - Element type (unused; kept for call-site symmetry).
 * @param attributes - JSX attributes.
 * @returns `true` when a valid interactive role is present.
 */
export default function isInteractiveRole(
  _tagName: string,
  attributes: JsxAttributes,
): boolean {
  const value = getLiteralPropValue(getProp(attributes, 'role'));

  // If value is undefined, then the role attribute will be dropped in the DOM.
  // If value is null, then getLiteralAttributeValue is telling us that the
  // value isn't in the form of a literal.
  if (isNil(value)) {
    return false;
  }

  // The first valid role value in a series takes precedence.
  const role = firstValidRole(value);
  return hasValue(role) && interactiveRolesForRoleAttr.has(role);
}
