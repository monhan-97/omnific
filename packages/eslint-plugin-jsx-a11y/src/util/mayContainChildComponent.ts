/**
 * Returns true if it can positively determine that the element lacks an
 * accessible label. If no determination is possible, it returns false. Treat
 * false as an unknown value. The element might still have an accessible label,
 * but this module cannot determine it positively.
 *
 * @fileoverview Detects whether a child component matching a pattern may exist.
 */

import { hasValue, isNil } from '@omnific/utils';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import { elementType as rawElementType } from './jsxAst';
import { getPicomatch } from './picomatchCache';

/**
 * Returns whether a descendant matching `componentName` may exist within `maxDepth`.
 * @param root - Root JSX element.
 * @param componentName - picomatch pattern for the component name.
 * @param maxDepth - Maximum child depth to search.
 * @param elementType - Resolver for opening elements.
 * @returns `true` when a matching child (or expression container) is found.
 */
export default function mayContainChildComponent(
  root: JSXElement,
  componentName: string,
  maxDepth = 1,
  elementType: (opening: JSXOpeningElement) => string = rawElementType,
): boolean {
  const matchComponent = getPicomatch(componentName);

  /**
   * Walks children looking for a matching component.
   * @param node - Current node.
   * @param depth - Current depth.
   * @returns Whether a match was found.
   */
  function traverseChildren(node: { children?: JSXElement['children'] }, depth: number): boolean {
    // Bail when maxDepth is exceeded or children are missing.
    if (depth > maxDepth || isNil(node.children)) {
      return false;
    }

    for (const childNode of node.children) {
      // Assume an expression container renders a label. It is the best we can
      // do in this case.
      if (childNode.type === 'JSXExpressionContainer') {
        return true;
      }
      // Check for components with the provided name.
      if (
        childNode.type === 'JSXElement' &&
        hasValue(childNode.openingElement) &&
        matchComponent(elementType(childNode.openingElement))
      ) {
        return true;
      }
      if (traverseChildren(childNode as { children?: JSXElement['children'] }, depth + 1)) {
        return true;
      }
    }

    return false;
  }

  return traverseChildren(root, 1);
}
