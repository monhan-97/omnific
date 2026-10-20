/**
 * @fileoverview Implicit ARIA role for `menuitem`.
 */

import { hasValue, isString } from '@omnific/utils';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getLiteralPropValue, getProp } from '../jsxAst';

/**
 * Returns the implicit role for a menuitem tag.
 * @param attributes - JSX attributes.
 * @returns Implicit role or `null`.
 */
export default function getImplicitRoleForMenuitem(
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  const type = getProp(attributes, 'type');

  if (hasValue(type)) {
    const rawValue = getLiteralPropValue(type);
    const value = isString(rawValue) ? rawValue : '';

    switch (value.toUpperCase()) {
      case 'COMMAND': {
        return 'menuitem';
      }
      case 'CHECKBOX': {
        return 'menuitemcheckbox';
      }
      case 'RADIO': {
        return 'menuitemradio';
      }
      default: {
        return null;
      }
    }
  }

  return null;
}
