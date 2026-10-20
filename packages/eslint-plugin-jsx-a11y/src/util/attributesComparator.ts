/**
 * @fileoverview Returns true if all items in baseAttributes are found in attributes.
 * @author openjdl
 */

import { hasValue, isArrayEmpty, isNil } from '@omnific/utils';
import type { JSXAttribute } from 'estree-jsx';

import { type JsxAttributes, getLiteralPropValue, propName } from './jsxAst';

/**
 * Attribute constraint used by aria-query / axobject-query element schemas.
 */
export type BaseAttribute = {
  /** Attribute name to match. */
  name: string;
  /** Optional literal value to match. */
  value?: string | number | boolean;
};

/**
 * Builds a name → JSXAttribute map, ignoring spreads.
 * @param attributes - JSX opening-element attributes.
 * @returns Attribute map keyed by prop name.
 */
export function toAttributeMap(attributes: JsxAttributes): Map<string, JSXAttribute> {
  const map = new Map<string, JSXAttribute>();
  for (const attribute of attributes) {
    if (attribute.type === 'JSXAttribute') {
      map.set(propName(attribute), attribute);
    }
  }
  return map;
}

/**
 * Returns whether every entry in `baseAttributes` is satisfied by a prebuilt attribute map.
 * @param baseAttributes - Required attribute constraints.
 * @param byName - JSX attributes indexed by prop name.
 * @returns Whether all base attributes are satisfied.
 */
export function attributesMatchMap(
  baseAttributes: readonly BaseAttribute[],
  byName: Map<string, JSXAttribute>,
): boolean {
  if (isArrayEmpty(baseAttributes)) {
    return true;
  }

  for (const baseAttr of baseAttributes) {
    const attribute = byName.get(baseAttr.name);
    if (isNil(attribute)) {
      return false;
    }
    if (hasValue(baseAttr.value) && baseAttr.value !== getLiteralPropValue(attribute)) {
      return false;
    }
  }

  return true;
}

/**
 * Returns true if every entry in `baseAttributes` is present on `attributes`.
 * Always returns true when `baseAttributes` is empty.
 * @param baseAttributes - Required attribute constraints.
 * @param attributes - JSX opening-element attributes.
 * @returns Whether all base attributes are satisfied.
 */
export default function attributesComparator(
  baseAttributes: readonly BaseAttribute[] = [],
  attributes: JsxAttributes = [],
): boolean {
  return attributesMatchMap(baseAttributes, toAttributeMap(attributes));
}
