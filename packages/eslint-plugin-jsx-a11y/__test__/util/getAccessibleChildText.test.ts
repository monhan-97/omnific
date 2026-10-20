import { expect, test } from 'vitest';
import { elementType } from 'jsx-ast-utils-x';

import { JSXAttributeMock, JSXElementMock } from '../utils/jsxMocks';
import getAccessibleChildText from '../../src/util/getAccessibleChildText';


test('getAccessibleChildText', () => {
  const ariaLabelAttr = JSXAttributeMock('aria-label', 'foo');
  const labeledLink = JSXElementMock('a', [ariaLabelAttr]);
  expect(getAccessibleChildText(labeledLink, elementType)).toBe('foo');

  const labeledLinkWithText = JSXElementMock(
    'a',
    [ariaLabelAttr],
    [{ type: 'JSXText', value: 'bar' }],
  );
  expect(getAccessibleChildText(labeledLinkWithText, elementType)).toBe('foo');

  const ariaHiddenAttr = JSXAttributeMock('aria-hidden', 'true');
  const hiddenLink = JSXElementMock('a', [ariaHiddenAttr]);
  expect(getAccessibleChildText(hiddenLink, elementType)).toBe('');

  const textLink = JSXElementMock('a', [], [{ type: 'JSXText', value: 'bar' }]);
  expect(getAccessibleChildText(textLink, elementType)).toBe('bar');

  const srcAttr = JSXAttributeMock('src', 'some/path');
  const altAttr = JSXAttributeMock('alt', 'a sensible label');
  const labeledImg = JSXElementMock('img', [srcAttr, altAttr]);
  const linkWithImg = JSXElementMock('a', [], [labeledImg]);
  expect(getAccessibleChildText(linkWithImg, elementType)).toBe('a sensible label');

  const spanAltAttr = JSXAttributeMock('alt', 'a sensible label');
  const spanWithAlt = JSXElementMock('span', [spanAltAttr]);
  const linkWithSpanAlt = JSXElementMock('a', [], [spanWithAlt]);
  expect(getAccessibleChildText(linkWithSpanAlt, elementType)).toBe('');

  const literalBar = JSXElementMock('a', [], [{ type: 'Literal', value: 'bar' }]);
  expect(getAccessibleChildText(literalBar, elementType)).toBe('bar');

  const literalPadded = JSXElementMock('a', [], [{ type: 'Literal', value: ' bar   ' }]);
  expect(getAccessibleChildText(literalPadded, elementType)).toBe('bar');

  const literalSpaces = JSXElementMock('a', [], [{ type: 'Literal', value: 'foo         bar' }]);
  expect(getAccessibleChildText(literalSpaces, elementType)).toBe('foo bar');

  const literalPunctuation = JSXElementMock(
    'a',
    [],
    [{ type: 'Literal', value: 'foo, bar. baz? foo; bar:' }],
  );
  expect(getAccessibleChildText(literalPunctuation, elementType)).toBe('foo bar baz foo bar');

  const nestedSpanText = JSXElementMock('span', [], [{ type: 'Literal', value: 'bar' }]);
  const linkWithNestedSpan = JSXElementMock('a', [], [nestedSpanText]);
  expect(getAccessibleChildText(linkWithNestedSpan, elementType)).toBe('bar');

  const hiddenNestedSpan = JSXElementMock('span', [ariaHiddenAttr]);
  const spanWrappingHidden = JSXElementMock('span', [], [hiddenNestedSpan]);
  const linkWithHiddenNested = JSXElementMock('a', [], [spanWrappingHidden]);
  expect(getAccessibleChildText(linkWithHiddenNested, elementType)).toBe('');

  const twoLiterals = JSXElementMock(
    'a',
    [],
    [
      { type: 'Literal', value: 'foo' },
      { type: 'Literal', value: 'bar' },
    ],
  );
  expect(getAccessibleChildText(twoLiterals, elementType)).toBe('foo bar');

  const twoPaddedLiterals = JSXElementMock(
    'a',
    [],
    [
      { type: 'Literal', value: ' foo ' },
      { type: 'Literal', value: ' bar ' },
    ],
  );
  expect(getAccessibleChildText(twoPaddedLiterals, elementType)).toBe('foo bar');

  const literalsWithUnknown = JSXElementMock(
    'a',
    [],
    [
      { type: 'Literal', value: 'foo' },
      { type: 'Unknown' },
      { type: 'Literal', value: 'bar' },
    ],
  );
  expect(getAccessibleChildText(literalsWithUnknown, elementType)).toBe('foo bar');
});
