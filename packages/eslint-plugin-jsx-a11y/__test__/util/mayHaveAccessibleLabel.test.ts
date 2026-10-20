import { describe, expect, test } from 'vitest';

import { JSXAttributeMock, JSXElementMock, JSXExpressionContainerMock, JSXSpreadAttributeMock, JSXTextMock } from '../utils/jsxMocks';
import mayHaveAccessibleLabel from '../../src/util/mayHaveAccessibleLabel';


describe('mayHaveAccessibleLabel', () => {
  const spanA = JSXElementMock('span', [], []);
  const spanB = JSXElementMock('span', [], []);
  const spanC = JSXElementMock('span', [], [spanB]);
  const spanD = JSXElementMock('span', [], [spanA, spanC]);
  const nestedSpan = JSXElementMock('span', [], []);
  const nestedDiv = JSXElementMock('div', [], [nestedSpan, spanD]);
  const srcAttr = JSXAttributeMock('src', 'some/path');
  const img = JSXElementMock('img', [srcAttr]);
  const trailingSpan = JSXElementMock('span', [], []);
  const deepTree = JSXElementMock('div', [], [nestedDiv, trailingSpan, img]);
  expect(mayHaveAccessibleLabel(deepTree, 5)).toBe(false);

  test('label via attributes', () => {
    const labelAttr = JSXAttributeMock('aria-label', 'A delicate label');
    const labeledDiv = JSXElementMock('div', [labelAttr], []);
    expect(mayHaveAccessibleLabel(labeledDiv)).toBe(true);

    const emptyLabelAttr = JSXAttributeMock('aria-label', '');
    const emptyLabeledDiv = JSXElementMock('div', [emptyLabelAttr], []);
    expect(mayHaveAccessibleLabel(emptyLabeledDiv)).toBe(false);

    const spaceLabelAttr = JSXAttributeMock('aria-label', ' ');
    const spaceLabeledDiv = JSXElementMock('div', [spaceLabelAttr], []);
    expect(mayHaveAccessibleLabel(spaceLabeledDiv)).toBe(false);

    const newlineLabelAttr = JSXAttributeMock('aria-label', '\n');
    const newlineLabeledDiv = JSXElementMock('div', [newlineLabelAttr], []);
    expect(mayHaveAccessibleLabel(newlineLabeledDiv)).toBe(false);

    const labelledByAttr = JSXAttributeMock('aria-labelledby', 'elementId');
    const labelledByDiv = JSXElementMock('div', [labelledByAttr], []);
    expect(mayHaveAccessibleLabel(labelledByDiv)).toBe(true);

    const emptyLabelledByAttr = JSXAttributeMock('aria-labelledby', '');
    const emptyLabelledByDiv = JSXElementMock('div', [emptyLabelledByAttr], []);
    expect(mayHaveAccessibleLabel(emptyLabelledByDiv)).toBe(false);

    const labelledByExprAttr = JSXAttributeMock('aria-labelledby', 'elementId', true);
    const labelledByExprDiv = JSXElementMock('div', [labelledByExprAttr], []);
    expect(mayHaveAccessibleLabel(labelledByExprDiv)).toBe(true);
  });

  test('label via custom label attribute', () => {
    const customLabelProp = 'cowbell';

    const customLabelAttr = JSXAttributeMock(customLabelProp, 'A delicate label');
    const customLabeledDiv = JSXElementMock('div', [customLabelAttr], []);
    expect(mayHaveAccessibleLabel(customLabeledDiv, 1, [customLabelProp])).toBe(true);
  });

  test('text label', () => {
    const fancyLabel = JSXTextMock('A fancy label');
    const textDiv = JSXElementMock('div', [], [fancyLabel]);
    expect(mayHaveAccessibleLabel(textDiv)).toBe(true);

    const spaceText = JSXTextMock(' ');
    const spaceTextDiv = JSXElementMock('div', [], [spaceText]);
    expect(mayHaveAccessibleLabel(spaceTextDiv)).toBe(false);

    const newlineText = JSXTextMock('\n');
    const newlineTextDiv = JSXElementMock('div', [], [newlineText]);
    expect(mayHaveAccessibleLabel(newlineTextDiv)).toBe(false);

    const fancyLabelAgain = JSXTextMock('A fancy label');
    const textDivAgain = JSXElementMock('div', [], [fancyLabelAgain]);
    expect(mayHaveAccessibleLabel(textDivAgain)).toBe(true);

    const nestedLabel = JSXTextMock('A fancy label');
    const nestedText = JSXElementMock('div', [], [nestedLabel]);
    const divWithNestedText = JSXElementMock('div', [], [nestedText]);
    expect(mayHaveAccessibleLabel(divWithNestedText)).toBe(false);

    expect(mayHaveAccessibleLabel(divWithNestedText, 2)).toBe(true);

    const labelLeaf = JSXTextMock('A fancy label');
    const span1 = JSXElementMock('span', [], [labelLeaf]);
    const span2 = JSXElementMock('span', [], [span1]);
    const empty1 = JSXElementMock('span', [], []);
    const span3 = JSXElementMock('span', [], [empty1, span2]);
    const empty2 = JSXElementMock('span', [], []);
    const span4 = JSXElementMock('span', [], [empty2, span3]);
    const empty3 = JSXElementMock('span', [], []);
    const innerDiv = JSXElementMock('div', [], [empty3, span4]);
    const empty4 = JSXElementMock('span', [], []);
    const deepImg = JSXElementMock('img', [JSXAttributeMock('src', 'some/path')]);
    const deepLabelTree = JSXElementMock('div', [], [innerDiv, empty4, deepImg]);
    expect(mayHaveAccessibleLabel(deepLabelTree, 6)).toBe(true);
  });

  test('image content', () => {
    const bareSrc = JSXAttributeMock('src', 'some/path');
    const bareImg = JSXElementMock('img', [bareSrc]);
    const divWithBareImg = JSXElementMock('div', [], [bareImg]);
    expect(mayHaveAccessibleLabel(divWithBareImg)).toBe(false);

    const altSrc = JSXAttributeMock('src', 'some/path');
    const altAttr = JSXAttributeMock('alt', 'A sensible label');
    const imgWithAlt = JSXElementMock('img', [altSrc, altAttr]);
    const divWithAltImg = JSXElementMock('div', [], [imgWithAlt]);
    expect(mayHaveAccessibleLabel(divWithAltImg)).toBe(true);

    const ariaSrc = JSXAttributeMock('src', 'some/path');
    const imgAriaLabel = JSXAttributeMock('aria-label', 'A sensible label');
    const imgWithAriaLabel = JSXElementMock('img', [ariaSrc, imgAriaLabel]);
    const divWithAriaLabelImg = JSXElementMock('div', [], [imgWithAriaLabel]);
    expect(mayHaveAccessibleLabel(divWithAriaLabelImg)).toBe(true);
  });

  test('Intederminate situations', () => {
    const mysteryBox = JSXExpressionContainerMock('mysteryBox');
    const divWithMystery = JSXElementMock('div', [], [mysteryBox]);
    expect(mayHaveAccessibleLabel(divWithMystery)).toBe(true);

    const styleAttr = JSXAttributeMock('style', 'some-junk');
    const spreadAttr = JSXSpreadAttributeMock('props');
    const divWithSpread = JSXElementMock('div', [styleAttr, spreadAttr], []);
    expect(mayHaveAccessibleLabel(divWithSpread)).toBe(true);
  });
});
