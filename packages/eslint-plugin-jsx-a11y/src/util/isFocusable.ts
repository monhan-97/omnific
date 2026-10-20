/**
 * @fileoverview Returns whether an element appears in tab focus.
 */

import { isNil, isNumber } from '@omnific/utils';

import { type JsxAttributes, getProp } from './jsxAst';
import getTabIndex from './getTabIndex';
import isInteractiveElement from './isInteractiveElement';

/**
 * Returns whether an element appears in tab focus.
 * Identifies an element as focusable if it is an interactive element, or an
 * element with a tabIndex greater than or equal to 0.
 * @param type - Element type name.
 * @param attributes - JSX attributes.
 * @returns `true` when the element is focusable.
 */
export default function isFocusable(
  type: string,
  attributes: JsxAttributes,
): boolean {
  const tabIndex = getTabIndex(getProp(attributes, 'tabIndex'));
  return isInteractiveElement(type, attributes) ? isNil(tabIndex) || (isNumber(tabIndex) && tabIndex >= 0) : isNumber(tabIndex) && tabIndex >= 0;
}
