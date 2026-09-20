// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buttonPrefixCls } from '../constants';
import { Button } from '../Button';

afterEach(cleanup);

describe('Button', () => {
  it('renders a native button with type and disabled', () => {
    render(
      <Button disabled type='submit'>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(buttonPrefixCls);
  });

  it.each([
    ['small', `${buttonPrefixCls}-size-small`],
    ['default', `${buttonPrefixCls}-size-default`],
    ['large', `${buttonPrefixCls}-size-large`],
  ] as const)('applies the %s size class', (size, expectedClass) => {
    render(
      <Button size={size}>
        Size
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Size' })).toHaveClass(expectedClass);
  });

  it.each([
    ['primary', `${buttonPrefixCls}-primary`],
    ['secondary', `${buttonPrefixCls}-secondary`],
    ['dashed', `${buttonPrefixCls}-dashed`],
    ['outline', `${buttonPrefixCls}-outline`],
    ['danger', `${buttonPrefixCls}-danger`],
  ] as const)('applies the %s variant class', (variant, expectedClass) => {
    render(
      <Button variant={variant}>
        Variant
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Variant' })).toHaveClass(expectedClass);
  });

  it.each([
    ['circle', `${buttonPrefixCls}-shape-circle`],
    ['round', `${buttonPrefixCls}-shape-round`],
  ] as const)('applies the %s shape class', (shape, expectedClass) => {
    render(
      <Button shape={shape}>
        Shape
      </Button>,
    );

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

  it('keeps the variant class while disabled', () => {
    render(
      <Button disabled variant='danger'>
        Delete
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(`${buttonPrefixCls}-danger`);
  });

  it('marks icon-only without forcing shape-circle', () => {
    render(<Button aria-label='View' icon={<span>icon</span>} />);

    const button = screen.getByRole('button', { name: 'View' });

    expect(button).toHaveClass(`${buttonPrefixCls}-icon-only`);
    expect(button).not.toHaveClass(`${buttonPrefixCls}-shape-circle`);
  });
});
