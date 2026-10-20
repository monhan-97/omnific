/**
 * @fileoverview Returns whether an element has a non-interactive ARIA role.
 */

import { hasValue } from '@omnific/utils';
import { dom } from 'aria-query';

import { nonInteractiveRolesForRoleAttr } from './ariaTables';
import firstValidRole from './firstValidRole';
import { type JsxAttributes, getLiteralPropValue, getProp } from './jsxAst';

/**
 * Returns whether the element has a role associated with a non-interactive component.
 * Elements without a role return false — determination cannot be made.
 * @param tagName - Element type name.
 * @param attributes - JSX attributes.
 * @returns `true` when a valid non-interactive role is present.
 */
export default function isNonInteractiveRole(
  tagName: string,
  attributes: JsxAttributes,
): boolean {
  // Do not test higher level JSX components, as we do not know what
  // low-level DOM element this maps to.
  if (dom.has(tagName)) {
    const role = firstValidRole(getLiteralPropValue(getProp(attributes, 'role')));
    // The first valid role value in a series takes precedence.
    return hasValue(role) && nonInteractiveRolesForRoleAttr.has(role);
  }

  return false;
}
