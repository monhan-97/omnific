/**
 * @fileoverview Returns whether any indexed element schema matches JSX attributes.
 */

import { hasValue, isNil } from '@omnific/utils';
import type { JSXAttribute } from 'estree-jsx';

import type { ElementSchema } from './ariaTables';
import { attributesMatchMap, toAttributeMap } from './attributesComparator';
import type { JsxAttributes } from './jsxAst';

/**
 * Returns whether any schema for `tagName` matches attributes indexed by `byName`.
 * @param schemasByName - Schemas indexed by element name.
 * @param tagName - Element type name.
 * @param byName - JSX attributes indexed by prop name.
 * @returns Whether a matching schema exists.
 */
export function matchesAnySchemaMap(
  schemasByName: Map<string, ElementSchema[]>,
  tagName: string,
  byName: Map<string, JSXAttribute>,
): boolean {
  const schemas = schemasByName.get(tagName);
  if (isNil(schemas)) {
    return false;
  }
  for (const schema of schemas) {
    if (attributesMatchMap(schema.attributes ?? [], byName)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns whether any schema for `tagName` matches `attributes`.
 * @param schemasByName - Schemas indexed by element name.
 * @param tagName - Element type name.
 * @param attributes - JSX attributes.
 * @returns Whether a matching schema exists.
 */
export default function matchesAnySchema(
  schemasByName: Map<string, ElementSchema[]>,
  tagName: string,
  attributes: JsxAttributes,
): boolean {
  return hasValue(schemasByName.get(tagName))
    && matchesAnySchemaMap(schemasByName, tagName, toAttributeMap(attributes));
}
