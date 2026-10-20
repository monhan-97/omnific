import type { Rule } from 'eslint';
import { describe, expect, test } from 'vitest';

import getElementType from '../../src/util/getElementType';
import { JSXAttributeMock, JSXElementMock } from '../utils/jsxMocks';

/**
 * Builds a minimal rule context with the given settings.
 * @param settings - ESLint settings object.
 * @returns Rule context stub.
 */
function contextWithSettings(settings: Rule.RuleContext['settings']): Rule.RuleContext {
  return { settings } as Rule.RuleContext;
}

describe('getElementType', () => {
  test('no settings in context', () => {
    const elementType = getElementType(contextWithSettings({}));

    const input = JSXElementMock('input');
    expect(elementType(input.openingElement)).toBe('input');

    const customInput = JSXElementMock('CustomInput');
    expect(elementType(customInput.openingElement)).toBe('CustomInput');

    const toStringEl = JSXElementMock('toString');
    expect(elementType(toStringEl.openingElement)).toBe('toString');

    const asAttr = JSXAttributeMock('as', 'h1');
    const spanAs = JSXElementMock('span', [asAttr]);
    expect(elementType(spanAs.openingElement)).toBe('span');
  });

  test('components settings in context', () => {
    const elementType = getElementType(
      contextWithSettings({
        'jsx-a11y': {
          components: {
            CustomInput: 'input',
          },
        },
      }),
    );

    const input = JSXElementMock('input');
    expect(elementType(input.openingElement)).toBe('input');

    const customInput = JSXElementMock('CustomInput');
    expect(elementType(customInput.openingElement)).toBe('input');

    const cityInput = JSXElementMock('CityInput');
    expect(elementType(cityInput.openingElement)).toBe('CityInput');

    const asAttr = JSXAttributeMock('as', 'h1');
    const spanAs = JSXElementMock('span', [asAttr]);
    expect(elementType(spanAs.openingElement)).toBe('span');
  });

  test('polymorphicPropName settings in context', () => {
    const elementType = getElementType(
      contextWithSettings({
        'jsx-a11y': {
          polymorphicPropName: 'asChild',
          components: {
            CustomButton: 'button',
          },
        },
      }),
    );

    const asChildH1 = JSXAttributeMock('asChild', 'h1');
    const spanAsChild = JSXElementMock('span', [asChildH1]);
    expect(elementType(spanAsChild.openingElement)).toBe('h1');

    const asChildA = JSXAttributeMock('asChild', 'a');
    const customButtonAsChild = JSXElementMock('CustomButton', [asChildA]);
    expect(elementType(customButtonAsChild.openingElement)).toBe('a');

    const asA = JSXAttributeMock('as', 'a');
    const customButtonAs = JSXElementMock('CustomButton', [asA]);
    expect(elementType(customButtonAs.openingElement)).toBe('button');
  });

  test('polymorphicPropName settings and explicitly defined polymorphicAllowList in context', () => {
    const elementType = getElementType(
      contextWithSettings({
        'jsx-a11y': {
          polymorphicPropName: 'asChild',
          polymorphicAllowList: ['Box', 'Icon'],
          components: {
            Box: 'div',
            Icon: 'svg',
          },
        },
      }),
    );

    const spinnerAsChild = JSXAttributeMock('asChild', 'img');
    const spinner = JSXElementMock('Spinner', [spinnerAsChild]);
    expect(elementType(spinner.openingElement)).toBe('Spinner');

    const iconAsChild = JSXAttributeMock('asChild', 'img');
    const icon = JSXElementMock('Icon', [iconAsChild]);
    expect(elementType(icon.openingElement)).toBe('img');

    const boxAsChild = JSXAttributeMock('asChild', 'span');
    const box = JSXElementMock('Box', [boxAsChild]);
    expect(elementType(box.openingElement)).toBe('span');

    const boxAs = JSXAttributeMock('as', 'a');
    const boxWithAs = JSXElementMock('Box', [boxAs]);
    expect(elementType(boxWithAs.openingElement)).toBe('div');
  });
});
