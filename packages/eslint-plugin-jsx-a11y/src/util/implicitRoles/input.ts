/**
 * @fileoverview Implicit ARIA role for `input`.
 */

import { hasValue, isString } from '@omnific/utils';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getLiteralPropValue, getProp } from '../jsxAst';

/**
 * Returns the implicit role for an input tag.
 * @param attributes - JSX attributes.
 * @returns Implicit role.
 */
export default function getImplicitRoleForInput(
  attributes: JsxAttributes,
): ARIARoleDefinitionKey {
  const type = getProp(attributes, 'type');

  if (hasValue(type)) {
    const rawValue = getLiteralPropValue(type);
    const value = isString(rawValue) ? rawValue : '';

    switch (value.toUpperCase()) {
      case 'BUTTON':
      case 'IMAGE':
      case 'RESET':
      case 'SUBMIT': {
        return 'button';
      }
      case 'CHECKBOX': {
        return 'checkbox';
      }
      case 'RADIO': {
        return 'radio';
      }
      case 'RANGE': {
        return 'slider';
      }
      // EMAIL / PASSWORD / SEARCH / TEL / URL (with [list] → combobox) → textbox
      default: {
        return 'textbox';
      }
    }
  }

  return 'textbox';
}
