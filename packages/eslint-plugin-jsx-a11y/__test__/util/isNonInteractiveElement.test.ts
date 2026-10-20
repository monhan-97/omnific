import { describe, expect, test } from 'vitest';
import { elementType } from 'jsx-ast-utils-x';

import isNonInteractiveElement from '../../src/util/isNonInteractiveElement';
import {
  genIndeterminantInteractiveElements,
  genInteractiveElements,
  genInteractiveRoleElements,
  genNonInteractiveElements,
  genNonInteractiveRoleElements,
} from '../utils/genInteractives';


describe('isNonInteractiveElement', () => {
  expect(isNonInteractiveElement(undefined as unknown as string, [])).toBe(false);

  test('non-interactive elements', () => {
    for (const { openingElement } of genNonInteractiveElements()) {
      expect(
        isNonInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(true);
    }
  });

  test('non-interactive role elements', () => {
    for (const { openingElement } of genNonInteractiveRoleElements()) {
      expect(
        isNonInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(false);
    }
  });

  test('interactive elements', () => {
    for (const { openingElement } of genInteractiveElements()) {
      expect(
        isNonInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(false);
    }
  });

  test('interactive role elements', () => {
    for (const { openingElement } of genInteractiveRoleElements()) {
      expect(
        isNonInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(false);
    }
  });

  test('indeterminate elements', () => {
    for (const { openingElement } of genIndeterminantInteractiveElements()) {
      expect(
        isNonInteractiveElement(
          elementType(openingElement),
          openingElement.attributes,
        ),
      ).toBe(false);
    }
  });
});
