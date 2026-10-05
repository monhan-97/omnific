import { describe, expect, expectTypeOf, it } from 'vitest';

import { extractProps } from '../extractProps';
import type { MarginValue } from '../../props/margin.props';
import type { PaddingValue } from '../../props/padding.props';

describe('extractProps', () => {
  it('extracts class props, merges className, and keeps native props', () => {
    const result = extractProps({
      className: 'custom',
      id: 'box',
      mx: '2',
      p: '4',
    });

    expect(result.className).toBe('atelier-mx-2 atelier-p-4 custom');
    expect(result.id).toBe('box');
  });

  it('generates negative class names for negative margin values', () => {
    const result = extractProps({ m: '-2' });

    expect(result.className).toBe('-atelier-m-2');
  });

  it('extracts style props and lets user style win', () => {
    const result = extractProps({
      bg: 'bg-muted',
      style: { background: 'red' },
    });

    expect(result.style).toEqual({
      background: 'red',
    });
  });

  it('generates kebab-case layout classes and normalized sizing suffixes', () => {
    const result = extractProps({
      flexBasis: '100%',
      overflowX: 'hidden',
      right: '-2',
      rowGap: '3',
    });

    expect(result.className).toBe(
      'atelier-flex-basis-100 atelier-overflow-x-hidden -atelier-right-2 atelier-row-gap-3',
    );
  });

  it('infers prop value types', () => {
    expectTypeOf<PaddingValue | undefined>().toEqualTypeOf<
      '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | undefined
    >();
    expectTypeOf<MarginValue | undefined>().toEqualTypeOf<
      | '0'
      | '1'
      | '2'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '-1'
      | '-2'
      | '-3'
      | '-4'
      | '-5'
      | '-6'
      | '-7'
      | '-8'
      | '-9'
      | undefined
    >();
  });
});
