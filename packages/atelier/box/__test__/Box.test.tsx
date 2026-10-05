// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';

import { boxPrefixCls } from '../constants';
import { Box } from '../Box';
import type { BoxProps } from '../types';
import type { HeightValue } from '../../props/height.props';
import type { ScalingValue } from '../../props/scaling.props';
import type { WidthValue } from '../../props/width.props';

afterEach(cleanup);

describe('Box', () => {
  it('renders with the box class and no style modifiers by default', () => {
    render(<Box>内容</Box>);

    const node = screen.getByText('内容');

    expect(node.tagName).toBe('DIV');
    expect(node).toHaveClass(boxPrefixCls);
    expect(node.className).toBe(boxPrefixCls);
  });

  it('applies layout and appearance classes', () => {
    render(
      <Box bg='bg-muted' border borderColor='accent-border' display='block' mx='2' p='4' radius='md' shadow='md'>
        内容
      </Box>,
    );

    const node = screen.getByText('内容');

    expect(node).toHaveClass(
      boxPrefixCls,
      'atelier-border',
      'atelier-p-4',
      'atelier-mx-2',
      'atelier-display-block',
      'atelier-radius-md',
      'atelier-shadow-md',
    );
    expect(node.style.background).toBe('var(--color-bg-muted)');
    expect(node.style.getPropertyValue('--color-border')).toBe('var(--color-accent-border)');
    expect(node.style.padding).toBe('');
    expect(node.style.borderRadius).toBe('');
    expect(node.style.boxShadow).toBe('');
  });

  it('applies shared sizing classes', () => {
    render(
      <Box height='4' maxHeight='8' maxWidth='9' minHeight='2' minWidth='4' width='50%'>
        内容
      </Box>,
    );

    const node = screen.getByText('内容');

    expect(node).toHaveClass(
      'atelier-width-50',
      'atelier-min-width-4',
      'atelier-max-width-9',
      'atelier-height-4',
      'atelier-min-height-2',
      'atelier-max-height-8',
    );
    expect(node.style.width).toBe('');
    expect(node.style.height).toBe('');
  });

  it('applies flex display classes', () => {
    render(
      <>
        <Box display='flex'>flex 内容</Box>
        <Box display='inline-flex'>inline-flex 内容</Box>
      </>,
    );

    expect(screen.getByText('flex 内容')).toHaveClass('atelier-display-flex');
    expect(screen.getByText('inline-flex 内容')).toHaveClass('atelier-display-inline-flex');
  });

  it('applies positioning, overflow, flex and alignment classes', () => {
    render(
      <Box
        alignContent='space-between'
        alignItems='center'
        alignSelf='end'
        bottom='-2'
        columnGap='2'
        display='flex'
        flexBasis='100%'
        flexDirection='column'
        flexGrow='1'
        flexShrink='0'
        flexWrap='wrap'
        gap='4'
        inset='1'
        justifyContent='space-between'
        justifyItems='center'
        justifySelf='end'
        left='auto'
        overflow='hidden'
        overflowX='auto'
        overflowY='scroll'
        placeContent='space-around'
        placeItems='center'
        position='relative'
        right='-1'
        rowGap='3'
        top='0'
      >
        内容
      </Box>,
    );

    const node = screen.getByText('内容');

    expect(node).toHaveClass(
      'atelier-display-flex',
      'atelier-position-relative',
      'atelier-inset-1',
      'atelier-top-0',
      '-atelier-right-1',
      '-atelier-bottom-2',
      'atelier-left-auto',
      'atelier-overflow-hidden',
      'atelier-overflow-x-auto',
      'atelier-overflow-y-scroll',
      'atelier-flex-basis-100',
      'atelier-flex-grow-1',
      'atelier-flex-shrink-0',
      'atelier-flex-direction-column',
      'atelier-flex-wrap-wrap',
      'atelier-align-items-center',
      'atelier-align-content-space-between',
      'atelier-align-self-end',
      'atelier-justify-items-center',
      'atelier-justify-content-space-between',
      'atelier-justify-self-end',
      'atelier-place-items-center',
      'atelier-place-content-space-around',
      'atelier-gap-4',
      'atelier-column-gap-2',
      'atelier-row-gap-3',
    );
  });

  it('applies the scaling data attribute', () => {
    render(<Box scaling='110%'>内容</Box>);

    expect(screen.getByText('内容')).toHaveAttribute('data-scaling', '110%');
  });

  it('merges className and style', () => {
    render(
      <Box className='custom-box' p='2' style={{ color: 'red' }}>
        内容
      </Box>,
    );

    const node = screen.getByText('内容');

    expect(node).toHaveClass(boxPrefixCls, 'custom-box', 'atelier-p-2');
    expect(node.style.color).toBe('red');
  });

  it('infers layout and appearance prop keys from prop defs', () => {
    expectTypeOf<BoxProps['p']>().toEqualTypeOf<
      '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | undefined
    >();
    expectTypeOf<BoxProps['display']>().toEqualTypeOf<
      'none' | 'inline' | 'inline-block' | 'block' | 'flex' | 'inline-flex' | 'contents' | undefined
    >();
    expectTypeOf<BoxProps['width']>().toEqualTypeOf<WidthValue | undefined>();
    expectTypeOf<BoxProps['height']>().toEqualTypeOf<HeightValue | undefined>();
    expectTypeOf<BoxProps['scaling']>().toEqualTypeOf<ScalingValue | undefined>();
    expectTypeOf<BoxProps['border']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<'bg-muted'>().toMatchTypeOf<NonNullable<BoxProps['bg']>>();
  });
});
