/**
 * @fileoverview Returns the first aria-query-valid role token from a role attribute value.
 */

import { roles } from 'aria-query';
import type { ARIARoleDefinitionKey } from 'aria-query';

/**
 * Returns the first space-separated role token that exists in aria-query.
 * @param value - Raw `role` attribute literal (or other coercible value).
 * @returns First valid role name, or `undefined` when none match.
 */
export default function firstValidRole(value: unknown): ARIARoleDefinitionKey | undefined {
  for (const name of String(value).toLowerCase().split(' ')) {
    if (roles.has(name as ARIARoleDefinitionKey)) {
      return name as ARIARoleDefinitionKey;
    }
  }
}
