/**
 * Parses JSX snippets into estree-jsx nodes for util tests.
 */

import { hasValue, isArray, isBoolean, isNil, isNumber, isPlainObject, isString } from '@omnific/utils';
import * as parser from '@typescript-eslint/parser';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

const parserOptions = {
  ecmaFeatures: { jsx: true },
  sourceType: 'module' as const,
  ecmaVersion: 'latest' as const,
};

/**
 * Parses a JSX element expression and returns the root `JSXElement` node.
 * Accepts either a bare element (`<div />`) or a statement wrapping one.
 * @param code - JSX source snippet.
 * @returns Parsed JSX element.
 */
export function parseJSXElement(code: string): JSXElement {
  const wrapped = code.trimStart().startsWith('<') ? `(${code})` : code;
  const ast = parser.parse(wrapped, parserOptions);
  const element = findJSXElement(ast);
  if (isNil(element)) {
    throw new Error(`Unable to find JSXElement in: ${code}`);
  }
  return element;
}

/**
 * Parses a JSX element and returns its opening element.
 * @param code - JSX source snippet.
 * @returns Opening element node.
 */
export function parseJSXOpeningElement(code: string): JSXOpeningElement {
  return parseJSXElement(code).openingElement;
}

/**
 * Builds a self-closing JSX element string from a tag name and attributes.
 * @param tagName - Element / component name.
 * @param attributes - Attribute map (string values are quoted).
 * @returns JSX source string.
 */
export function jsxElementSource(
  tagName: string,
  attributes: ReadonlyArray<{ name: string; value?: string | number | boolean | null }> = [],
): string {
  const attrText = attributes
    .map(({ name, value }) => {
      if (value === undefined) {
        return name;
      }
      if (value === null) {
        const nullKeyword = 'null';
        return `${name}={${nullKeyword}}`;
      }
      if (isBoolean(value)) {
        const falseKeyword = 'false';
        return value ? name : `${name}={${falseKeyword}}`;
      }
      if (isNumber(value)) {
        return `${name}={${value}}`;
      }
      return isString(value) ? `${name}="${value}"` : name;
    })
    .join(' ');

  return attrText.length > 0 ? `<${tagName} ${attrText} />` : `<${tagName} />`;
}

/**
 * Depth-first search for the first JSXElement in an ESTree program.
 * @param node - AST node.
 * @returns First JSXElement or `undefined`.
 */
function findJSXElement(node: unknown): JSXElement | undefined {
  if (!isPlainObject(node)) {
    return undefined;
  }

  if (node.type === 'JSXElement') {
    return node as JSXElement;
  }

  for (const value of Object.values(node)) {
    if (isArray(value)) {
      for (const child of value) {
        const found = findJSXElement(child);
        if (hasValue(found)) {
          return found;
        }
      }
      continue;
    }

    const found = findJSXElement(value);
    if (hasValue(found)) {
      return found;
    }
  }

  return undefined;
}
