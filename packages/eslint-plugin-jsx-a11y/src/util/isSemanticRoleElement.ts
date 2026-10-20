/**
 * @fileoverview Returns whether an element/role pair is a semantic AXObject match.
 */

import { hasValue, isNil } from '@omnific/utils';
import { AXObjectRoles, elementAXObjects } from 'axobject-query';

import type { BaseAttribute } from './attributesComparator';
import { attributesMatchMap, toAttributeMap } from './attributesComparator';
import { type JsxAttributes, getLiteralPropValue, getProp } from './jsxAst';

type ElementAXObjectEntry = [
  { name: string; attributes?: readonly BaseAttribute[] },
  Iterable<string>,
];

const elementAXObjectsByName = (() => {
  const map = new Map<string, ElementAXObjectEntry[]>();
  for (const [concept, axObjects] of elementAXObjects as Iterable<ElementAXObjectEntry>) {
    const list = map.get(concept.name);
    if (hasValue(list)) {
      list.push([concept, axObjects]);
    } else {
      map.set(concept.name, [[concept, axObjects]]);
    }
  }
  return map;
})();

/**
 * Returns whether the element type and attributes form a semantic AXObject role match.
 * @param elementType - Element type name.
 * @param attributes - JSX attributes.
 * @returns `true` when a matching AXObject role is found.
 */
export default function isSemanticRoleElement(
  elementType: string,
  attributes: JsxAttributes,
): boolean {
  const concepts = elementAXObjectsByName.get(elementType);
  if (isNil(concepts)) {
    return false;
  }

  const roleAttrValue = getLiteralPropValue(getProp(attributes, 'role'));
  const byName = toAttributeMap(attributes);

  for (const [concept, axObjects] of concepts) {
    if (!attributesMatchMap(concept.attributes ?? [], byName)) {
      continue;
    }

    for (const name of axObjects) {
      const axRoles = AXObjectRoles.get(name);
      if (isNil(axRoles)) {
        continue;
      }

      for (const role of axRoles) {
        if (role.name === roleAttrValue) {
          return true;
        }
      }
    }
  }

  return false;
}
