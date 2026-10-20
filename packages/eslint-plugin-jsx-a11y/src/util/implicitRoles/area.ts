/**
 * @fileoverview Implicit ARIA role for `area`.
 */

import { hasValue } from '@omnific/utils';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getProp } from '../jsxAst';

/**
 * Returns the implicit role for an area tag.
 * @param attributes - JSX attributes.
 * @returns Implicit role or `null`.
 */
export default function getImplicitRoleForArea(
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  return hasValue(getProp(attributes, 'href')) ? 'link' : null;
}
