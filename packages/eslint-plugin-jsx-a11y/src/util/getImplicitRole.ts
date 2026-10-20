/**
 * @fileoverview Returns an element's implicit ARIA role.
 */

import { hasValue } from '@omnific/utils';
import { roles as rolesMap } from 'aria-query';
import type { ARIARoleDefinitionKey } from 'aria-query';

import implicitRoles from './implicitRoles/index';
import type { JsxAttributes } from './jsxAst';

/**
 * HTML element names that have an implicit-role resolver.
 */
type HTMLElementTagNames = keyof typeof implicitRoles;

/**
 * Returns an element's implicit role given its attributes and type.
 * Some elements only have an implicit role when certain props are defined.
 * @param type - Element type name.
 * @param attributes - JSX attributes.
 * @returns Implicit role or `null`.
 */
export default function getImplicitRole(
  type: string,
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  let implicitRole: ARIARoleDefinitionKey | null = null;

  if (Object.hasOwn(implicitRoles, type)) {
    const resolver = implicitRoles[type as HTMLElementTagNames];
    implicitRole = resolver(attributes);
  }

  return hasValue(implicitRole) && rolesMap.has(implicitRole) ? implicitRole : null;
}
