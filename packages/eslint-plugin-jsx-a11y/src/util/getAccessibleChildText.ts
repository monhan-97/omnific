/**
 * @fileoverview Returns standardized accessible child text for a JSX element.
 */

import { isString } from '@omnific/utils';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import { getLiteralPropValue, getProp } from './jsxAst';
import isHiddenFromScreenReader from './isHiddenFromScreenReader';

/**
 * Returns a standardized string: whitespace collapsed, punctuation stripped, lowercased.
 * @param input - Raw text.
 * @returns Normalized text.
 */
function standardizeSpaceAndCase(input: string): string {
  return input
    .trim()
    .replaceAll(/[,.?¿!‽¡;:]/g, '')
    .replaceAll(/\s\s+/g, ' ')
    .toLowerCase();
}

/**
 * Returns the recursively-defined accessible child text of a node.
 * @param node - JSX element to traverse.
 * @param elementType - Resolver for opening elements.
 * @returns Accessible child text.
 */
export default function getAccessibleChildText(
  node: JSXElement,
  elementType: (opening: JSXOpeningElement) => string,
): string {
  const ariaLabel = getLiteralPropValue(getProp(node.openingElement.attributes, 'aria-label'));
  if (isString(ariaLabel) && ariaLabel.length > 0) {
    return standardizeSpaceAndCase(ariaLabel);
  }

  const altTag = getLiteralPropValue(getProp(node.openingElement.attributes, 'alt'));
  if (elementType(node.openingElement) === 'img' && isString(altTag) && altTag.length > 0) {
    return standardizeSpaceAndCase(altTag);
  }

  if (isHiddenFromScreenReader(elementType(node.openingElement), node.openingElement.attributes)) {
    return '';
  }

  const rawChildText = node.children
    .map(currentNode => {
      // estree-jsx uses JSXText; Babel-style Literal text nodes are handled the same way.
      if (currentNode.type === 'JSXText' || (currentNode as { type: string }).type === 'Literal') {
        return String((currentNode as { value: unknown }).value);
      }
      return currentNode.type === 'JSXElement'
        ? getAccessibleChildText(currentNode, elementType)
        : '';
    })
    .join(' ');

  return standardizeSpaceAndCase(rawChildText);
}
