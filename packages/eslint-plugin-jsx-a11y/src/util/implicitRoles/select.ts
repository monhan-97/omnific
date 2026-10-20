/**
 * @fileoverview Implicit ARIA role for `select`.
 * @see https://www.w3.org/TR/html-aria/#el-select
 */

import { hasValue } from '@omnific/utils';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getLiteralPropValue, getProp } from '../jsxAst';

/**
 * Returns the implicit role for a select tag depending on attributes.
 * @param attributes - JSX attributes.
 * @returns Implicit role.
 */
export default function getImplicitRoleForSelect(
  attributes: JsxAttributes,
): ARIARoleDefinitionKey {
  const multiple = getProp(attributes, 'multiple');
  if (hasValue(multiple)) {
    const multipleValue = getLiteralPropValue(multiple);
    // Upstream treats any truthy literal as enabling listbox.
    if (multipleValue) {
      return 'listbox';
    }
  }

  const size = getProp(attributes, 'size');
  const sizeValue = hasValue(size) ? getLiteralPropValue(size) : undefined;

  // Upstream uses loose `>` comparison (coerces strings / null).
  return (sizeValue as number) > 1 ? 'listbox' : 'combobox';
}
