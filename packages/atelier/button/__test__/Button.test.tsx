// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import { buttonPrefixCls } from '../constants';
import { Button } from '../Button';
import type { ButtonProps } from '../types';

afterEach(cleanup);

describe('Button', () => {
  it('renders a native button with default color and variant', () => {
    render(
      <Button disabled type='submit'>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(buttonPrefixCls, `${buttonPrefixCls}-variant-outlined`);
    expect(button).toHaveAttribute('data-color', 'default');
  });

  it.each([
    ['small', `${buttonPrefixCls}-size-small`],
    ['default', `${buttonPrefixCls}-size-default`],
    ['large', `${buttonPrefixCls}-size-large`],
  ] as const)('applies the %s size class', (size, expectedClass) => {
    render(<Button size={size}>Size</Button>);

    expect(screen.getByRole('button', { name: 'Size' })).toHaveClass(expectedClass);
  });

  it.each([
    ['solid', `${buttonPrefixCls}-variant-solid`],
    ['outlined', `${buttonPrefixCls}-variant-outlined`],
    ['dashed', `${buttonPrefixCls}-variant-dashed`],
  ] as const)('applies the %s variant class', (variant, expectedClass) => {
    render(<Button variant={variant}>Variant</Button>);

    expect(screen.getByRole('button', { name: 'Variant' })).toHaveClass(expectedClass);
  });

  it.each(['default', 'primary', 'danger'] as const)('applies the %s color role', color => {
    render(<Button color={color}>Color</Button>);

    expect(screen.getByRole('button', { name: 'Color' })).toHaveAttribute('data-color', color);
  });

  it('applies color and variant independently', () => {
    render(
      <Button color='danger' variant='solid'>
        Delete
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Delete' });

    expect(button).toHaveAttribute('data-color', 'danger');
    expect(button).toHaveClass(`${buttonPrefixCls}-variant-solid`);
  });

  it.each([
    ['circle', `${buttonPrefixCls}-shape-circle`],
    ['round', `${buttonPrefixCls}-shape-round`],
  ] as const)('applies the %s shape class', (shape, expectedClass) => {
    render(<Button shape={shape}>Shape</Button>);

    expect(screen.getByRole('button', { name: 'Shape' })).toHaveClass(expectedClass);
  });

  it('renders a loading indicator and blocks click events while loading', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Button loading onClick={handleClick}>
        Save
      </Button>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector(`.${buttonPrefixCls}-loading-icon svg`)).toBeInTheDocument();
  });

  it('mounts the loading indicator only while loading', () => {
    const { container, rerender } = render(<Button>Save</Button>);

    expect(container.querySelector(`.${buttonPrefixCls}-loading-icon`)).not.toBeInTheDocument();

    rerender(<Button loading>Save</Button>);

    expect(container.querySelector(`.${buttonPrefixCls}-loading-icon`)).toBeInTheDocument();
  });

  it('keeps color and variant while disabled', () => {
    render(
      <Button color='danger' disabled variant='solid'>
        Delete
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Delete' });

    expect(button).toHaveAttribute('data-color', 'danger');
    expect(button).toHaveClass(`${buttonPrefixCls}-variant-solid`);
  });

  it('marks icon-only without forcing shape-circle', () => {
    render(<Button aria-label='View' icon={<span>icon</span>} />);

    const button = screen.getByRole('button', { name: 'View' });

    expect(button).toHaveClass(`${buttonPrefixCls}-icon-only`);
    expect(button).not.toHaveClass(`${buttonPrefixCls}-shape-circle`);
  });

  it('infers color and variant values from props', () => {
    expectTypeOf<ButtonProps['color']>().toEqualTypeOf<
      'default' | 'primary' | 'danger' | undefined
    >();
    expectTypeOf<ButtonProps['variant']>().toEqualTypeOf<
      'solid' | 'outlined' | 'dashed' | undefined
    >();
  });
});
