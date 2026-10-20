import { describe, expect, test } from 'vitest';
import { elementType } from 'jsx-ast-utils-x';

import isInteractiveElement from '../../src/util/isInteractiveElement';
import {
  genIndeterminantInteractiveElements,
  genInteractiveElements,
  genInteractiveRoleElements,
  genNonInteractiveElements,
  genNonInteractiveRoleElements,
} from '../utils/genInteractives';


describe('isInteractiveElement', () => {
  expect(isInteractiveElement(undefined as unknown as string, [])).toBe(false);

  test('interactive elements', () => {
    for (const { openingElement } of genInteractiveElements()) {
      expect(
        isInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(true);
    }
  });

  test('interactive role elements', () => {
    for (const { openingElement } of genInteractiveRoleElements()) {
      expect(
        isInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(false);
    }
  });

  test('non-interactive elements', () => {
    for (const { openingElement } of genNonInteractiveElements()) {
      expect(
        isInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(false);
    }
  });

  test('non-interactive role elements', () => {
    for (const { openingElement } of genNonInteractiveRoleElements()) {
      expect(
        isInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(false);
    }
  });

  test('indeterminate elements', () => {
    for (const { openingElement } of genIndeterminantInteractiveElements()) {
      expect(
        isInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(false);
    }
  });

  expect(isInteractiveElement('CustomComponent', [])).toBe(false);
});
