/**
 * Returns true if a labelling element is found or if it cannot determine if a
 * label is present because of expression containers or spread attributes. A
 * false return value means that the node definitely does not have a label, but
 * a true return value means that the node may or may not have a label.
 *
 * @fileoverview Detects whether a node may have an accessible label.
 */

import { hasValue, isArrayEmpty, isObject, isString, isStringEmpty } from '@omnific/utils';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import { getPropValue, propName, elementType as rawElementType } from './jsxAst';
import { getPicomatch } from './picomatchCache';

const DEFAULT_LABELLING_PROPS = new Set([
  'alt', // Assume alt is used correctly on an image
  'aria-label',
  'aria-labelledby',
]);

/**
 * Trims string values; leaves other values unchanged.
 * @param value - Prop or text value.
 * @returns Trimmed string or original value.
 */
function tryTrim(value: unknown): unknown {
  return isString(value) ? value.trim() : value;
}

/**
 * Returns whether a trimmed value is non-empty / truthy for labelling purposes.
 * @param value - Value after tryTrim.
 * @returns Whether the value counts as a label.
 */
function isTruthyLabel(value: unknown): boolean {
  return isString(value) ? !isStringEmpty(value) : hasValue(value) && Boolean(value);
}

/**
 * Returns whether an opening element has a labelling prop with a non-empty value.
 * @param openingElement - JSX opening element.
 * @param additionalLabellingProps - Extra prop names treated as labels.
 * @returns `true` when a labelling prop is present.
 */
function hasLabellingProp(
  openingElement: JSXOpeningElement,
  additionalLabellingProps: readonly string[] = [],
): boolean {
  const labellingProps = isArrayEmpty(additionalLabellingProps)
    ? DEFAULT_LABELLING_PROPS
    : new Set([...DEFAULT_LABELLING_PROPS, ...additionalLabellingProps]);

  return openingElement.attributes.some(attribute => {
    // We must assume that a spread value contains a labelling prop.
    if (attribute.type !== 'JSXAttribute') {
      return true;
    }

    if (labellingProps.has(propName(attribute)) && isTruthyLabel(tryTrim(getPropValue(attribute)))) {
      return true;
    }

    return false;
  });
}

/**
 * JSX-like node shape used while walking children.
 */
type WalkNode = {
  /** AST node type. */
  type?: string;
  /** Literal / text value. */
  value?: unknown;
  /** Opening element when present. */
  openingElement?: JSXOpeningElement;
  /** Child nodes when present. */
  children?: JSXElement['children'];
};

/**
 * Returns whether a node may have an accessible label within `maxDepth`.
 * @param root - Root JSX element.
 * @param maxDepth - Maximum child depth to search.
 * @param additionalLabellingProps - Extra prop names treated as labels.
 * @param getElementType - Resolver for opening elements.
 * @param controlComponents - picomatch patterns for control components.
 * @returns `true` when a label may be present.
 */
export default function mayHaveAccessibleLabel(
  root: JSXElement,
  maxDepth = 1,
  additionalLabellingProps: readonly string[] = [],
  getElementType: (opening: JSXOpeningElement) => string = rawElementType,
  controlComponents: readonly string[] = [],
): boolean {
  const controlMatchers = controlComponents.map(pattern => getPicomatch(pattern));

  /**
   * Recursively checks a node for labelling content.
   * @param node - Current AST node.
   * @param depth - Current depth.
   * @returns Whether a label may exist.
   */
  function checkElement(node: unknown, depth: number): boolean {
    // Bail when maxDepth is exceeded or the node is not an object.
    // ESLint AST nodes use a custom `Node` prototype, so `isPlainObject` is too strict.
    if (depth > maxDepth || !isObject(node)) {
      return false;
    }

    const walkNode = node as WalkNode;

    // Check for literal text.
    if (walkNode.type === 'Literal' && isTruthyLabel(tryTrim(walkNode.value))) {
      return true;
    }

    // Assume an expression container renders a label. It is the best we can
    // do in this case.
    if (walkNode.type === 'JSXExpressionContainer') {
      return true;
    }

    // Check for JSXText.
    if (walkNode.type === 'JSXText' && isTruthyLabel(tryTrim(walkNode.value))) {
      return true;
    }

    // Check for labelling props.
    if (
      hasValue(walkNode.openingElement) &&
      hasLabellingProp(walkNode.openingElement, additionalLabellingProps)
    ) {
      return true;
    }

    if (
      walkNode.type === 'JSXElement' &&
      hasValue(walkNode.children) &&
      isArrayEmpty(walkNode.children) &&
      hasValue(walkNode.openingElement)
    ) {
      const name = getElementType(walkNode.openingElement);
      const firstChar = name.charAt(0);
      const isReactComponent = firstChar.length > 0 && firstChar === firstChar.toUpperCase();

      if (isReactComponent) {
        const matchesControl = controlMatchers.some(match => match(name));
        if (!matchesControl) {
          return true;
        }
      }
    }

    // Recurse into the child element nodes.
    if (hasValue(walkNode.children)) {
      for (const childNode of walkNode.children) {
        if (checkElement(childNode, depth + 1)) {
          return true;
        }
      }
    }

    return false;
  }

  return checkElement(root, 0);
}
