/**
 * Thin wrappers around `jsx-ast-utils-x` that accept missing props / readonly arrays.
 *
 * Import helpers only through this module: Node ESM cannot named-import from the
 * underlying CommonJS package.
 */

import { hasValue } from '@omnific/utils';
import type { Rule } from 'eslint';
import type { JSXAttribute, JSXOpeningElement, JSXOpeningFragment, JSXSpreadAttribute } from 'estree-jsx';
import jsxAstUtils from 'jsx-ast-utils-x';

const {
  elementType: elementTypeUnsafe,
  eventHandlersByType: eventHandlersByTypeUnsafe,
  getLiteralPropValue: getLiteralPropValueUnsafe,
  getProp: getPropUnsafe,
  getPropValue: getPropValueUnsafe,
  hasAnyProp: hasAnyPropUnsafe,
  hasProp: hasPropUnsafe,
  propName: propNameUnsafe,
} = jsxAstUtils;

/**
 * A single JSX opening-element attribute or spread.
 */
export type JsxAttributeNode = JSXAttribute | JSXSpreadAttribute;

/**
 * Attribute list accepted by util helpers.
 */
export type JsxAttributes = ReadonlyArray<JsxAttributeNode>;

/**
 * Common event handler props grouped by event category.
 */
export const eventHandlersByType = eventHandlersByTypeUnsafe;

/**
 * Casts an AST node to the type expected by `context.report({ node })`.
 * @param node - Any ESTree / JSX node.
 * @returns Node typed as ESLint `Rule.Node`.
 */
export function asRuleNode(node: unknown): Rule.Node {
  return node as Rule.Node;
}

/**
 * Returns the tag name associated with a JSX opening element or fragment.
 * @param node - JSX opening element or fragment.
 * @returns Element tag name.
 */
export function elementType(node: JSXOpeningElement | JSXOpeningFragment): string {
  return elementTypeUnsafe(node);
}

/**
 * Returns the name associated with a JSX attribute.
 * @param prop - JSX attribute.
 * @returns Attribute name.
 */
export function propName(prop: JSXAttribute): string {
  return propNameUnsafe(prop);
}

/**
 * Returns a named prop from an attribute list.
 * @param attributes - JSX attributes (readonly allowed).
 * @param name - Prop name.
 * @returns Matching attribute or `undefined`.
 */
export function getProp(attributes: JsxAttributes, name: string): JSXAttribute | undefined {
  return getPropUnsafe(attributes as JsxAttributeNode[], name);
}

/**
 * Returns the literal value of a prop, or `undefined` when the prop is absent.
 * @param prop - JSX attribute or `undefined`.
 * @returns Literal prop value.
 */
export function getLiteralPropValue(
  prop: JSXAttribute | undefined,
): ReturnType<typeof getLiteralPropValueUnsafe> | undefined {
  return hasValue(prop) ? getLiteralPropValueUnsafe(prop) : undefined;
}

/**
 * Returns the evaluated prop value, or `undefined` when the prop is absent.
 * @param prop - JSX attribute or `undefined`.
 * @returns Prop value.
 */
export function getPropValue(prop: JSXAttribute | undefined): unknown {
  return hasValue(prop) ? getPropValueUnsafe(prop) : undefined;
}

/**
 * Returns whether `name` is present on `attributes`.
 * @param attributes - JSX attributes (readonly allowed).
 * @param name - Prop name.
 * @returns Whether the prop exists.
 */
export function hasProp(attributes: JsxAttributes, name: string): boolean {
  return hasPropUnsafe(attributes as JsxAttributeNode[], name);
}

/**
 * Returns whether any of `names` is present on `attributes`.
 * @param attributes - JSX attributes (readonly allowed).
 * @param names - Prop names.
 * @returns Whether any listed prop exists.
 */
export function hasAnyProp(attributes: JsxAttributes, names: readonly string[]): boolean {
  return hasAnyPropUnsafe(attributes as JsxAttributeNode[], [...names]);
}
