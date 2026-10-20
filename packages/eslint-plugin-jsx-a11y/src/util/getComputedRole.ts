/**
 * @fileoverview Returns an element's computed ARIA role.
 */

import type { ARIARoleDefinitionKey } from 'aria-query';

import getExplicitRole from './getExplicitRole';
import getImplicitRole from './getImplicitRole';
import type { JsxAttributes } from './jsxAst';

/**
 * Returns an element's computed role, which is
 * 1. The valid value of its explicit role attribute; or
 * 2. The implicit value of its tag.
 * @param tag - Element type name.
 * @param attributes - JSX attributes.
 * @returns Computed role or `null`.
 */
export default function getComputedRole(
  tag: string,
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  return getExplicitRole(tag, attributes) || getImplicitRole(tag, attributes);
}
