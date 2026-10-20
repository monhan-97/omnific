/**
 * @fileoverview Returns whether a prop value is a non-literal AST node.
 */

import { isNil } from '@omnific/utils';

import { type JsxAttributes, getProp } from './jsxAst';

/**
 * Returns whether the given prop is specified with a non-literal AST node.
 * @param attributes - JSX attributes.
 * @param propName - Prop name to inspect.
 * @returns `true` when the prop value is non-literal.
 */
export default function isNonLiteralProperty(
  attributes: JsxAttributes,
  propName: string,
): boolean {
  const prop = getProp(attributes, propName);
  if (isNil(prop)) {
    return false;
  }

  const propValue = prop.value;
  if (isNil(propValue) || (propValue.type === 'Literal')) {
    return false;
  }

  if (propValue.type === 'JSXExpressionContainer') {
    const { expression } = propValue;
    if (expression.type === 'Identifier' && expression.name === 'undefined') {
      return false;
    }
  }

  return true;
}
