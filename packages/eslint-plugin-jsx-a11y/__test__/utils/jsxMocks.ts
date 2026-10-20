/**
 * Parser-backed stand-ins for upstream `__mocks__/JSX*Mock` helpers.
 */

import { hasValue, isBoolean, isFunction, isNil, isNumber, isPlainObject, isString } from '@omnific/utils';
import type { JSXAttribute, JSXElement, JSXOpeningElement, JSXSpreadAttribute } from 'estree-jsx';

import { jsxElementSource, parseJSXElement, parseJSXOpeningElement } from './parseJsx';

import type { JsxAttributeNode } from '../../src/util/jsxAst';

/**
 * Builds a JSX element via the TypeScript parser.
 * @param tagName - Element name.
 * @param attributes - Opening-element attributes (usually from {@link JSXAttributeMock}).
 * @param children - Child nodes.
 * @returns Element with the provided attributes and children.
 */
export function JSXElementMock(
  tagName: string,
  attributes: JsxAttributeNode[] = [],
  // Fixtures may include Babel-style Literal / unknown nodes beyond estree-jsx.
  children: JSXElement['children'] | ReadonlyArray<{ type: string; value?: unknown }> = [],
): JSXElement {
  const element = parseJSXElement(jsxElementSource(tagName));
  element.openingElement.attributes = attributes;
  element.children = children as JSXElement['children'];
  return element;
}

/**
 * Builds a JSX attribute via the TypeScript parser.
 * @param prop - Attribute name.
 * @param value - Literal value, or a pre-built expression-like object with `type`.
 * @param isExpressionContainer - Force `{value}` form for literals.
 * @returns Parsed JSXAttribute.
 */
export function JSXAttributeMock(
  prop: string,
  value: unknown,
  isExpressionContainer = false,
): JSXAttribute {
  let source: string;

  if (hasValue(value) && isPlainObject(value) && isString((value as { type?: string }).type)) {
    const node = value as { type: string; name?: string; value?: unknown };
    if (node.type === 'Identifier' && node.name === 'undefined') {
      const undefinedKeyword = 'undefined';
      source = `<div ${prop}={${undefinedKeyword}} />`;
    } else if (node.type === 'Literal') {
      source = isExpressionContainer
        ? `<div ${prop}={${JSON.stringify(node.value)}} />`
        : `<div ${prop}=${JSON.stringify(node.value)} />`;
    } else {
      source = `<div ${prop}={${JSON.stringify(node)}} />`;
    }
  } else if (value === undefined) {
    // Match upstream to-ast: undefined becomes an expression container.
    const undefinedKeyword = 'undefined';
    source = `<div ${prop}={${undefinedKeyword}} />`;
  } else if (isBoolean(value)) {
    source =
      isExpressionContainer || value === false ? `<div ${prop}={${String(value)}} />` : `<div ${prop} />`;
  } else if (isNumber(value)) {
    source = `<div ${prop}={${value}} />`;
  } else if (isString(value)) {
    source =
      isExpressionContainer || /[\n\r\t]/.test(value) || value.includes('"')
        ? // Expression form preserves whitespace / escapes the way to-ast literals did.
          `<div ${prop}={${JSON.stringify(value)}} />`
        : `<div ${prop}="${value}" />`;
  } else if (value === null) {
    const nullKeyword = 'null';
    source = `<div ${prop}={${nullKeyword}} />`;
  } else if (isFunction(value)) {
    source = `<div ${prop}={() => 0} />`;
  } else {
    source = `<div ${prop} />`;
  }

  const opening = parseJSXOpeningElement(source);
  const attr = opening.attributes.find(
    (attribute): attribute is JSXAttribute =>
      attribute.type === 'JSXAttribute' &&
      attribute.name.type === 'JSXIdentifier' &&
      attribute.name.name === prop,
  );

  if (isNil(attr)) {
    throw new Error(`Failed to mock attribute ${prop}`);
  }

  return attr;
}

/**
 * Builds a text child via parsing.
 * @param value - Text content.
 * @returns First child of a parsed wrapper element.
 */
export function JSXTextMock(value: string): JSXElement['children'][number] {
  const element = parseJSXElement(`<div>${value}</div>`);
  const [child] = element.children;
  if (isNil(child)) {
    throw new Error('Failed to mock JSXText');
  }
  return child;
}

/**
 * Builds a JSXExpressionContainer child.
 * @param expressionSource - Expression source string, or an Identifier-like object.
 * @returns Expression container child.
 */
export function JSXExpressionContainerMock(
  expressionSource: string | { type: string; name?: string },
): JSXElement['children'][number] {
  const source = isString(expressionSource)
    ? expressionSource
    : expressionSource.type === 'Identifier'
      ? (expressionSource.name ?? 'undefined')
      : 'undefined';
  const element = parseJSXElement(`<div>{${source}}</div>`);
  const [child] = element.children;
  if (isNil(child)) {
    throw new Error('Failed to mock JSXExpressionContainer');
  }
  return child;
}

/**
 * Identity helper for opening elements used in assertions.
 * @param openingElement - Opening element.
 * @returns The same opening element.
 */
export function asOpening(openingElement: JSXOpeningElement): JSXOpeningElement {
  return openingElement;
}


/**
 * Minimal Identifier node used as an attribute expression value.
 * @param name - Identifier name.
 * @returns Identifier-like object for {@link JSXAttributeMock}.
 */
export function IdentifierMock(name: string): { type: 'Identifier'; name: string } {
  return { type: 'Identifier', name };
}

/**
 * Builds a JSX spread attribute via the parser.
 * @param _name - Unused; kept for upstream call-site symmetry.
 * @returns JSXSpreadAttribute node.
 */
export function JSXSpreadAttributeMock(_name = 'props'): JSXSpreadAttribute {
  const opening = parseJSXOpeningElement('<div {...props} />');
  const spread = opening.attributes.find(attr => attr.type === 'JSXSpreadAttribute');
  if (isNil(spread) || spread.type !== 'JSXSpreadAttribute') {
    throw new Error('Failed to mock JSXSpreadAttribute');
  }
  return spread;
}
