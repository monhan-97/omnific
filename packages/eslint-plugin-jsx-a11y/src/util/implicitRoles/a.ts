/**
 * @fileoverview Implicit ARIA role for `a`.
 */

import { hasValue } from '@omnific/utils';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getProp } from '../jsxAst';

/**
 * Returns the implicit role for an anchor tag.
 * @param attributes - JSX attributes.
 * @returns Implicit role or `null`.
 */
export default function getImplicitRoleForAnchor(
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  return hasValue(getProp(attributes, 'href')) ? 'link' : null;
}
