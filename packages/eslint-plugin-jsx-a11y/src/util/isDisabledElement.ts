/**
 * @fileoverview Returns whether an element is disabled via HTML or ARIA.
 */

import { hasValue, isUndefined } from '@omnific/utils';

import { type JsxAttributes, getLiteralPropValue, getProp, getPropValue } from './jsxAst';

/**
 * Returns whether the element is disabled via `disabled` or `aria-disabled={true}`.
 * @param attributes - JSX attributes.
 * @returns `true` when the element should be treated as disabled.
 */
export default function isDisabledElement(
  attributes: JsxAttributes,
): boolean {
  const disabledAttr = getProp(attributes, 'disabled');
  // Upstream: attribute present and value is not `undefined` (null/false still count).
  if (hasValue(disabledAttr) && !isUndefined(getPropValue(disabledAttr))) {
    return true;
  }

  const ariaDisabledAttr = getProp(attributes, 'aria-disabled');
  return hasValue(ariaDisabledAttr) && getLiteralPropValue(ariaDisabledAttr) === true;
}
