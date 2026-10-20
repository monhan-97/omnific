/**
 * @fileoverview Returns whether an element is interactive on the DOM.
 */

import { dom } from 'aria-query';

import {
  interactiveElementAXObjectSchemasByName,
  interactiveElementRoleSchemasByNameForIE,
  nonInteractiveElementRoleSchemasByNameForIE,
} from './ariaTables';
import { toAttributeMap } from './attributesComparator';
import type { JsxAttributes } from './jsxAst';
import matchesInherent from './matchesInherent';

/**
 * Returns whether the given element is interactive on the DOM.
 * Usually used when an element has a dynamic handler and we need to discern
 * whether its intention is to be interacted with on the DOM.
 * @param tagName - Element type name.
 * @param attributes - JSX attributes.
 * @returns `true` when the element is interactive.
 */
export default function isInteractiveElement(
  tagName: string,
  attributes: JsxAttributes,
): boolean {
  // Do not test higher level JSX components, as we do not know what
  // low-level DOM element this maps to.
  return (
    dom.has(tagName)
    && matchesInherent(
      tagName,
      toAttributeMap(attributes),
      interactiveElementRoleSchemasByNameForIE,
      nonInteractiveElementRoleSchemasByNameForIE,
      interactiveElementAXObjectSchemasByName,
    )
  );
}
