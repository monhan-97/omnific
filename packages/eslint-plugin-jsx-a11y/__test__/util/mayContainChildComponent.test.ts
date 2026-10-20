import { describe, expect, test } from 'vitest';

import { JSXAttributeMock, JSXElementMock, JSXExpressionContainerMock } from '../utils/jsxMocks';
import mayContainChildComponent from '../../src/util/mayContainChildComponent';

describe('mayContainChildComponent', () => {
  const spanA = JSXElementMock('span', [], []);
  const spanB = JSXElementMock('span', [], []);
  const spanC = JSXElementMock('span', [], [spanB]);
  const spanD = JSXElementMock('span', [], [spanA, spanC]);
  const nestedLeadingSpan = JSXElementMock('span', [], []);
  const nestedDiv = JSXElementMock('div', [], [nestedLeadingSpan, spanD]);
  const imgSrc = JSXAttributeMock('src', 'some/path');
  const img = JSXElementMock('img', [imgSrc]);
  const trailingSpan = JSXElementMock('span', [], []);
  const deepTree = JSXElementMock('div', [], [nestedDiv, trailingSpan, img]);
  expect(mayContainChildComponent(deepTree, 'FancyComponent', 5)).toBe(false);

  test('contains an indicated component', () => {
    const input = JSXElementMock('input');
    const divWithInput = JSXElementMock('div', [], [input]);
    expect(mayContainChildComponent(divWithInput, 'input')).toBe(true);

    const fancy = JSXElementMock('FancyComponent');
    const divWithFancy = JSXElementMock('div', [], [fancy]);
    expect(mayContainChildComponent(divWithFancy, 'FancyComponent')).toBe(true);

    const nestedFancyChild = JSXElementMock('FancyComponent');
    const nestedFancy = JSXElementMock('div', [], [nestedFancyChild]);
    const divWithNestedFancy = JSXElementMock('div', [], [nestedFancy]);
    expect(mayContainChildComponent(divWithNestedFancy, 'FancyComponent')).toBe(false);

    expect(mayContainChildComponent(divWithNestedFancy, 'FancyComponent', 2)).toBe(true);

    const fancyLeaf = JSXElementMock('FancyComponent');
    const span1 = JSXElementMock('span', [], [fancyLeaf]);
    const span2 = JSXElementMock('span', [], [span1]);
    const empty1 = JSXElementMock('span', [], []);
    const span3 = JSXElementMock('span', [], [empty1, span2]);
    const empty2 = JSXElementMock('span', [], []);
    const span4 = JSXElementMock('span', [], [empty2, span3]);
    const empty3 = JSXElementMock('span', [], []);
    const innerDiv = JSXElementMock('div', [], [empty3, span4]);
    const empty4 = JSXElementMock('span', [], []);
    const deepImg = JSXElementMock('img', [JSXAttributeMock('src', 'some/path')]);
    const deepFancyTree = JSXElementMock('div', [], [innerDiv, empty4, deepImg]);
    expect(mayContainChildComponent(deepFancyTree, 'FancyComponent', 6)).toBe(true);
  });

  const mysteryBox = JSXExpressionContainerMock('mysteryBox');
  const divWithMystery = JSXElementMock('div', [], [mysteryBox]);
  expect(mayContainChildComponent(divWithMystery, 'FancyComponent')).toBe(true);

  describe('Glob name matching - component name contains question mark ? - match any single character', () => {
    const fancy = JSXElementMock('FancyComponent');
    const divWithFancy = JSXElementMock('div', [], [fancy]);

    expect(mayContainChildComponent(divWithFancy, 'Fanc?Co??onent')).toBe(true);

    expect(mayContainChildComponent(divWithFancy, 'FancyComponent?')).toBe(false);

    test('component name contains asterisk * - match zero or more characters', () => {
      expect(mayContainChildComponent(divWithFancy, 'Fancy*')).toBe(true);

      expect(mayContainChildComponent(divWithFancy, '*Component')).toBe(true);

      expect(mayContainChildComponent(divWithFancy, 'Fancy*C*t')).toBe(true);
    });
  });

  test('using a custom elementType function', () => {
    const customInput = JSXElementMock('CustomInput');
    const divWithCustomInput = JSXElementMock('div', [], [customInput]);

    expect(
      mayContainChildComponent(divWithCustomInput, 'input', 2, () => 'input'),
    ).toBe(true);

    expect(
      mayContainChildComponent(divWithCustomInput, 'input', 2, () => 'button'),
    ).toBe(false);
  });

  describe('picomatch / minimatch equivalence', () => {
    const fancy = JSXElementMock('FancyComponent');
    const divWithFancy = JSXElementMock('div', [], [fancy]);
    const input = JSXElementMock('CustomInput');
    const divWithInput = JSXElementMock('div', [], [input]);

    test('brace expansion', () => {
      expect(mayContainChildComponent(divWithFancy, '{Fancy,Plain}Component')).toBe(true);
      expect(mayContainChildComponent(divWithFancy, '{Plain,Other}Component')).toBe(false);
    });

    test('extglob', () => {
      expect(mayContainChildComponent(divWithFancy, '+(Fancy)Component')).toBe(true);
      expect(mayContainChildComponent(divWithFancy, '!(Fancy)Component')).toBe(false);
    });

    test('literal equality', () => {
      expect(mayContainChildComponent(divWithFancy, 'FancyComponent')).toBe(true);
      expect(mayContainChildComponent(divWithFancy, 'FancyComponents')).toBe(false);
      expect(mayContainChildComponent(divWithInput, 'CustomInput')).toBe(true);
    });

    test('case sensitivity', () => {
      expect(mayContainChildComponent(divWithFancy, 'fancycomponent')).toBe(false);
      expect(mayContainChildComponent(divWithFancy, 'FancyComponent')).toBe(true);
    });
  });
});
