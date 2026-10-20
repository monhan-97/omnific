/**
 * @fileoverview Returns whether an element is hidden from the screen reader.
 */

import { hasValue, isString } from '@omnific/utils';

import { type JsxAttributes, getLiteralPropValue, getProp, getPropValue } from './jsxAst';

/**
 * Returns whether `aria-hidden` is present/true, or the element is
 * `<input type="hidden" />`. Bare `<div aria-hidden />` is treated as true.
 * @param type - Element type name.
 * @param attributes - JSX attributes.
 * @returns `true` when the element is hidden from assistive tech.
 */
export default function isHiddenFromScreenReader(
  type: string,
  attributes: JsxAttributes,
): boolean {
  if (type.toUpperCase() === 'INPUT') {
    const hidden = getLiteralPropValue(getProp(attributes, 'type'));

    if (isString(hidden) && hidden.toUpperCase() === 'HIDDEN') {
      return true;
    }
  }

  const ariaHidden = getPropValue(getProp(attributes, 'aria-hidden'));
  return hasValue(ariaHidden) && ariaHidden === true;
}
