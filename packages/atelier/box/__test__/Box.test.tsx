// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';

import type { ColorToken, SpacingToken } from '../../system';
import { boxPrefixCls } from '../constants';
import { Box } from '../Box';
import type { BoxProps } from '../types';

afterEach(cleanup);

describe('Box', () => {
  it('renders with the box class and no style modifiers by default', () => {
    render(<Box>内容</Box>);

    const node = screen.getByText('内容');

    expect(node).toHaveClass(boxPrefixCls);
    expect(node.className).toBe(boxPrefixCls);
  });

  it('applies token styles and optional border class', () => {
    render(
      <Box bg='bg.muted' border borderColor='blue.border' p={4} rounded='md' shadow='md'>
        内容
      </Box>,
    );

    const node = screen.getByText('内容');

    expect(node).toHaveClass(boxPrefixCls, `${boxPrefixCls}-border`);
    expect(node.style.padding).toBe('var(--space-4)');
    expect(node.style.background).toBe('var(--color-bg-muted)');
    expect(node.style.borderRadius).toBe('var(--radius-md)');
    expect(node.style.borderColor).toBe('var(--color-blue-border)');
    expect(node.style.boxShadow).toBe('var(--shadow-md)');
  });

  it('merges className and style', () => {
    render(
      <Box className='custom-box' p={2} style={{ color: 'red' }}>
        内容
      </Box>,
    );

    const node = screen.getByText('内容');

    expect(node).toHaveClass(boxPrefixCls, 'custom-box');
    expect(node.style.padding).toBe('var(--space-2)');
    expect(node).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('uses system token unions on style props', () => {
    expectTypeOf<BoxProps['p']>().toEqualTypeOf<SpacingToken | undefined>();
    expectTypeOf<BoxProps['bg']>().toEqualTypeOf<ColorToken | undefined>();
    expectTypeOf<'bg.muted'>().toMatchTypeOf<NonNullable<BoxProps['bg']>>();
    expectTypeOf<0.5>().toMatchTypeOf<NonNullable<BoxProps['p']>>();
  });
});
