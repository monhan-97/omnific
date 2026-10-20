import { describe, expect, test } from 'vitest';
import { elementType } from 'jsx-ast-utils-x';

import { JSXAttributeMock } from '../utils/jsxMocks';
import isFocusable from '../../src/util/isFocusable';
import type { JsxAttributes } from '../../src/util/jsxAst';
import {
  genInteractiveElements,
  genNonInteractiveElements,
} from '../utils/genInteractives';


/**
 * Appends a tabIndex attribute to an attribute list.
 * @param index - tabIndex value.
 * @param attributes - Existing attributes.
 * @returns Attributes with tabIndex appended.
 */
function mergeTabIndex(
  index: number | string | boolean | undefined,
  attributes: JsxAttributes,
) {
  return [...attributes, JSXAttributeMock('tabIndex', index)];
}

describe('isFocusable', () => {
  test('interactive elements', () => {
    for (const { openingElement } of genInteractiveElements()) {
      expect(
        isFocusable(elementType(openingElement), openingElement.attributes),
      ).toBe(true);

      expect(
        isFocusable(
          elementType(openingElement),
          mergeTabIndex(-1, openingElement.attributes),
        ),
      ).toBe(false);

      expect(
        isFocusable(
          elementType(openingElement),
          mergeTabIndex(0, openingElement.attributes),
        ),
      ).toBe(true);

      expect(
        isFocusable(
          elementType(openingElement),
          mergeTabIndex(1, openingElement.attributes),
        ),
      ).toBe(true);
    }
  });

  test('non-interactive elements', () => {
    for (const { openingElement } of genNonInteractiveElements()) {
      expect(
        isFocusable(elementType(openingElement), openingElement.attributes),
      ).toBe(false);

      expect(
        isFocusable(
          elementType(openingElement),
          mergeTabIndex(-1, openingElement.attributes),
        ),
      ).toBe(false);

      expect(
        isFocusable(
          elementType(openingElement),
          mergeTabIndex(0, openingElement.attributes),
        ),
      ).toBe(true);

      expect(
        isFocusable(
          elementType(openingElement),
          mergeTabIndex(1, openingElement.attributes),
        ),
      ).toBe(true);

      expect(
        isFocusable(
          elementType(openingElement),
          mergeTabIndex('bogus', openingElement.attributes),
        ),
      ).toBe(false);
    }
  });
});
