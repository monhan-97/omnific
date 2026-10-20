import { expect, test } from 'vitest';
import { elementType } from 'jsx-ast-utils-x';

import { JSXAttributeMock, JSXElementMock, JSXExpressionContainerMock } from '../utils/jsxMocks';
import hasAccessibleChild from '../../src/util/hasAccessibleChild';


test('hasAccessibleChild', () => {
  const emptyDiv = JSXElementMock('div', []);
  expect(hasAccessibleChild(emptyDiv, elementType)).toBe(false);

  const dangerouslySetInnerHTML = JSXAttributeMock('dangerouslySetInnerHTML', true);
  const divWithInnerHTML = JSXElementMock('div', [dangerouslySetInnerHTML], []);
  expect(hasAccessibleChild(divWithInnerHTML, elementType)).toBe(true);

  const divWithLiteral = JSXElementMock(
    'div',
    [],
    [
      {
        type: 'Literal',
        value: 'foo',
      },
    ],
  );
  expect(hasAccessibleChild(divWithLiteral, elementType)).toBe(true);

  const childDiv = JSXElementMock('div', []);
  const divWithChild = JSXElementMock('div', [], [childDiv]);
  expect(hasAccessibleChild(divWithChild, elementType)).toBe(true);

  const divWithText = JSXElementMock(
    'div',
    [],
    [
      {
        type: 'JSXText',
        value: 'foo',
      },
    ],
  );
  expect(hasAccessibleChild(divWithText, elementType)).toBe(true);

  const ariaHidden = JSXAttributeMock('aria-hidden', true);
  const hiddenChild = JSXElementMock('div', [ariaHidden]);
  const divWithHiddenChild = JSXElementMock('div', [], [hiddenChild]);
  expect(hasAccessibleChild(divWithHiddenChild, elementType)).toBe(false);

  const fooExpr = JSXExpressionContainerMock({
    type: 'Identifier',
    name: 'foo',
  });
  const divWithFooExpr = JSXElementMock('div', [], [fooExpr]);
  expect(hasAccessibleChild(divWithFooExpr, elementType)).toBe(true);

  const undefinedExpr = JSXExpressionContainerMock({
    type: 'Identifier',
    name: 'undefined',
  });
  const divWithUndefinedExpr = JSXElementMock('div', [], [undefinedExpr]);
  expect(hasAccessibleChild(divWithUndefinedExpr, elementType)).toBe(false);

  const divWithUnknown = JSXElementMock(
    'div',
    [],
    [
      {
        type: 'Unknown',
      },
    ],
  );
  expect(hasAccessibleChild(divWithUnknown, elementType)).toBe(false);

  const childrenAttr = JSXAttributeMock('children', true);
  const divWithChildrenProp = JSXElementMock('div', [childrenAttr], []);
  expect(hasAccessibleChild(divWithChildrenProp, elementType)).toBe(true);

  const hiddenType = JSXAttributeMock('type', 'hidden');
  const hiddenInput = JSXElementMock('input', [hiddenType]);
  const divWithHiddenInput = JSXElementMock('div', [], [hiddenInput]);
  expect(hasAccessibleChild(divWithHiddenInput, elementType)).toBe(false);

  const customHiddenInput = JSXElementMock('CustomInput', [hiddenType]);
  const divWithCustomHiddenInput = JSXElementMock('div', [], [customHiddenInput]);
  expect(hasAccessibleChild(divWithCustomHiddenInput, elementType)).toBe(true);

  expect(hasAccessibleChild(divWithCustomHiddenInput, () => 'input')).toBe(false);
});
