/**
 * @fileoverview Implicit ARIA role for `link`.
 */

import { hasValue } from '@omnific/utils';
import type { ARIARoleDefinitionKey } from 'aria-query';

import { type JsxAttributes, getProp } from '../jsxAst';

/**
 * Returns the implicit role for a link tag.
 * @param attributes - JSX attributes.
 * @returns Implicit role or `null`.
 */
export default function getImplicitRoleForLink(
  attributes: JsxAttributes,
): ARIARoleDefinitionKey | null {
  return hasValue(getProp(attributes, 'href')) ? 'link' : null;
}
