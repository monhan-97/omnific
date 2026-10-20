/**
 * @fileoverview Returns an element's explicit ARIA role when valid.
 */

import { isString } from '@omnific/utils';
import { roles as rolesMap } from 'aria-query';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getLiteralPropValue, getProp } from './jsxAst';

/**
 * Returns the valid explicit `role` attribute value, or `null` when absent/invalid.
 * @param _tag - Element type (unused; kept for call-site symmetry).
 * @param attributes - JSX attributes.
 * @returns Normalized role name or `null`.
 */
export default function getExplicitRole(
  _tag: string,
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  const roleValue = getLiteralPropValue(getProp(attributes, 'role'));
  const explicitRole = isString(roleValue) ? roleValue.toLowerCase() : null;

  // aria-query MapLike key typing is wider than string; narrow after has().
  return isString(explicitRole) && rolesMap.has(explicitRole as ARIARoleDefinitionKey) ? (explicitRole as ARIARoleDefinitionKey) : null;
}
