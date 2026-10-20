/**
 * @fileoverview Returns whether a JSX element has accessible children.
 */

import { hasValue, isNumber, isString } from '@omnific/utils';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import isHiddenFromScreenReader from './isHiddenFromScreenReader';
import { hasAnyProp } from './jsxAst';

/**
 * Returns whether `node` has an accessible child or children prop.
 * @param node - JSX element.
 * @param elementType - Resolver for child opening elements.
 * @returns `true` when an accessible child is present.
 */
export default function hasAccessibleChild(
  node: JSXElement,
  elementType: (opening: JSXOpeningElement) => string,
): boolean {
  const hasChild = node.children.some(child => {
    // Babel-style Literal text nodes appear in some fixtures; estree-jsx uses JSXText.
    const childType = (child as { type: string }).type;
    if (childType === 'Literal' || childType === 'JSXText') {
      const value = (child as { value?: unknown }).value;
      if (isString(value)) {
        return value.length > 0;
      }
      return isNumber(value) ? value !== 0 : hasValue(value);
    }

    switch (child.type) {
      case 'JSXElement': {
        return !isHiddenFromScreenReader(
            elementType(child.openingElement),
            child.openingElement.attributes,
          );
      }
      case 'JSXExpressionContainer': {
        return child.expression.type !== 'Identifier' || child.expression.name !== 'undefined';
      }
      default: {
        return false;
      }
    }
  });

  return hasChild || hasAnyProp(node.openingElement.attributes, ['dangerouslySetInnerHTML', 'children']);
}
