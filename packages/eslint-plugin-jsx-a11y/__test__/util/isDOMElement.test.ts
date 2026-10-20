import { describe, expect, test } from 'vitest';
import { dom } from 'aria-query';
import { elementType } from 'jsx-ast-utils-x';

import { JSXElementMock } from '../utils/jsxMocks';
import isDOMElement from '../../src/util/isDOMElement';


describe('isDOMElement', () => {
  test('DOM elements', () => {
    for (const el of dom.keys()) {
      const element = JSXElementMock(el);

      expect(isDOMElement(elementType(element.openingElement))).toBe(true);
    }
  });

  const customElement = JSXElementMock('CustomElement');
  expect(isDOMElement(elementType(customElement.openingElement))).toBe(false);
});
