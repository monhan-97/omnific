/**
 * @fileoverview Shared inherent interactive / non-interactive schema matching.
 */

import type { JSXAttribute } from 'estree-jsx';

import type { ElementSchema } from './ariaTables';
import { matchesAnySchemaMap } from './matchesAnySchema';

/**
 * Role-association win, else AX Tree fallback unless blocked by the opposite role set.
 * @param tagName - Element type name.
 * @param byName - JSX attributes indexed by prop name.
 * @param winSchemas - Schemas that immediately decide the result.
 * @param blockSchemas - Schemas that block the AX Tree fallback.
 * @param axSchemas - AXObject schemas used as fallback.
 * @returns Whether the inherent concept matches.
 */
export default function matchesInherent(
  tagName: string,
  byName: Map<string, JSXAttribute>,
  winSchemas: Map<string, ElementSchema[]>,
  blockSchemas: Map<string, ElementSchema[]>,
  axSchemas: Map<string, ElementSchema[]>,
): boolean {
  return (
    matchesAnySchemaMap(winSchemas, tagName, byName)
    || (
      !matchesAnySchemaMap(blockSchemas, tagName, byName)
      && matchesAnySchemaMap(axSchemas, tagName, byName)
    )
  );
}
