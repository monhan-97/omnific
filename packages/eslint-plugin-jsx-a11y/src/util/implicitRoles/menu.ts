/**
 * @fileoverview Implicit ARIA role for `menu`.
 */

import { hasValue, isString } from '@omnific/utils';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getLiteralPropValue, getProp } from '../jsxAst';

/**
 * Returns the implicit role for a menu tag.
 * @param attributes - JSX attributes.
 * @returns Implicit role or `null`.
 */
export default function getImplicitRoleForMenu(
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  const type = getProp(attributes, 'type');

  if (hasValue(type)) {
    const value = getLiteralPropValue(type);
    return isString(value) && value.toUpperCase() === 'TOOLBAR' ? 'toolbar' : null;
  }

  return null;
}
