/**
 * @fileoverview Returns the tabIndex value from a JSX attribute.
 */

import { isBoolean, isNil, isNumber, isString, isStringEmpty } from '@omnific/utils';
import type { JSXAttribute } from 'estree-jsx';

import { getLiteralPropValue, getPropValue } from './jsxAst';

/**
 * Returns the numeric tabIndex value, or `undefined` when the attribute is invalid.
 * Non-literal expressions fall through to `getPropValue`.
 * @param tabIndex - `tabIndex` JSX attribute node.
 * @returns Integer tab index, expression value, or `undefined`.
 */
export default function getTabIndex(tabIndex: JSXAttribute | undefined): number | undefined {
  const literalValue = getLiteralPropValue(tabIndex);

  // String and number values.
  if (isString(literalValue) || isNumber(literalValue)) {
    // Empty string will convert to zero, so check for it explicitly.
    if (isString(literalValue) && isStringEmpty(literalValue)) {
      return undefined;
    }

    const value = Number(literalValue);
    if (Number.isNaN(value)) {
      return undefined;
    }

    return Number.isSafeInteger(value) ? value : undefined;
  }

  // Booleans are not valid values.
  if (isBoolean(literalValue)) {
    return undefined;
  }

  return isNil(tabIndex) ? undefined : (getPropValue(tabIndex) as number | undefined);
}
