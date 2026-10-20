/**
 * @fileoverview Returns whether an element is a non-interactive DOM element.
 */

import { dom } from 'aria-query';
import type { JSXAttribute } from 'estree-jsx';

import {
  type ElementSchema,
  interactiveElementRoleSchemasByNameForNIE,
  nonInteractiveElementAXObjectSchemasByName,
  nonInteractiveElementRoleSchemasByNameForNIE,
} from './ariaTables';
import { toAttributeMap } from './attributesComparator';
import type { JsxAttributes } from './jsxAst';
import { matchesAnySchemaMap } from './matchesAnySchema';

/**
 * Returns whether any schema for `tagName` matches attributes indexed by `byName`.
 * Upstream quirk: `td` never matches for non-interactive checks.
 * @param schemasByName - Schemas indexed by element name.
 * @param tagName - Element type name.
 * @param byName - JSX attributes indexed by prop name.
 * @returns Whether a matching schema exists.
 */
function matchesAnyExceptTd(
  schemasByName: Map<string, ElementSchema[]>,
  tagName: string,
  byName: Map<string, JSXAttribute>,
): boolean {
  // TODO: investigate why `td` is excluded for non-interactive matching.
  return tagName === 'td' ? false : matchesAnySchemaMap(schemasByName, tagName, byName);
}

/**
 * Returns whether the given element is a non-interactive element.
 * Elements that lack either an explicitly assigned role or an inherent role
 * are not considered — this utility returns false because a positive
 * determination cannot be made.
 * @param tagName - Element type name.
 * @param attributes - JSX attributes.
 * @returns `true` when the element is non-interactive.
 */
export default function isNonInteractiveElement(
  tagName: string,
  attributes: JsxAttributes,
): boolean {
  // Do not test higher level JSX components, as we do not know what
  // low-level DOM element this maps to.
  // <header> elements do not technically have semantics, unless the
  // element is a direct descendant of <body>, and this plugin cannot
  // reliably test that.
  // @see https://www.w3.org/TR/wai-aria-practices/examples/landmarks/banner.html
  if (tagName === 'header' || !dom.has(tagName)) {
    return false;
  }

  const byName = toAttributeMap(attributes);
  // Non-interactive role association wins; otherwise interactive role blocks AX Tree fallback.
  return (
    matchesAnyExceptTd(nonInteractiveElementRoleSchemasByNameForNIE, tagName, byName)
    || (
      !matchesAnyExceptTd(interactiveElementRoleSchemasByNameForNIE, tagName, byName)
      && matchesAnyExceptTd(nonInteractiveElementAXObjectSchemasByName, tagName, byName)
    )
  );
}
