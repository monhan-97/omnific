/**
 * @fileoverview Returns whether an element has contentEditable="true".
 */

import { hasValue, isNil, isString } from '@omnific/utils';

import { type JsxAttributes, getProp } from './jsxAst';

/**
 * Returns whether the element is content-editable (`contentEditable="true"`).
 * @param _tagName - Element type (unused; kept for call-site symmetry).
 * @param attributes - JSX attributes.
 * @returns `true` when contentEditable is the literal `"true"`.
 */
export default function isContentEditable(
  _tagName: string,
  attributes: JsxAttributes,
): boolean {
  const prop = getProp(attributes, 'contentEditable');
  if (isNil(prop)) {
    return false;
  }

  const attributeValue = prop.value;
  return (
    hasValue(attributeValue) &&
    'raw' in attributeValue &&
    isString(attributeValue.raw) &&
    attributeValue.raw === '"true"'
  );
}
