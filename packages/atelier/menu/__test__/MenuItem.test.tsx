// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ListItemIcon, ListItemText } from '../../list';
import { listItemIconPrefixCls, listItemTextPrefixCls } from '../../list/constants';
import { menuItemPrefixCls } from '../constants';
import { MenuItem } from '../MenuItem';

afterEach(cleanup);

describe('MenuItem', () => {
  it('does not require a key', () => {
    render(<MenuItem>Home</MenuItem>);

    expect(screen.getByRole('menuitem', { name: 'Home' })).toBeInTheDocument();
  });

  it('composes icon and text children', () => {
    render(
      <MenuItem key='home' selected>
        <ListItemIcon>
          <span>icon</span>
        </ListItemIcon>
        <ListItemText>Home</ListItemText>
      </MenuItem>,
    );

    const item = screen.getByRole('menuitem', { name: /Home/ });

    expect(item.querySelector(`.${listItemIconPrefixCls}`)).toBeInTheDocument();
    expect(item.querySelector(`.${listItemTextPrefixCls}`)).toHaveTextContent('Home');
  });

  it('applies size and divider state classes', () => {
    render(
      <MenuItem divider key='home' size='small'>
        Home
      </MenuItem>,
    );

    const item = screen.getByRole('menuitem', { name: 'Home' });

    expect(item).toHaveClass(`${menuItemPrefixCls}-size-small`, `${menuItemPrefixCls}-divider`);
    expect(item).toHaveAttribute('data-size', 'small');
    expect(item).toHaveAttribute('data-divider', 'true');
  });

  it('defaults to default size', () => {
    render(<MenuItem key='home'>Home</MenuItem>);

    const item = screen.getByRole('menuitem', { name: 'Home' });

    expect(item).toHaveClass(`${menuItemPrefixCls}-size-default`);
    expect(item).toHaveAttribute('data-size', 'default');
  });

  it('keeps standalone buttons focusable by default', () => {
    render(<MenuItem key='home'>Home</MenuItem>);

    const item = screen.getByRole('menuitem', { name: 'Home' });

    expect(item).not.toHaveAttribute('tabindex');
    expect(item.tabIndex).toBe(0);
  });

  it('renders selected state and respects tabIndex', () => {
    render(
      <MenuItem key='home' selected tabIndex={0}>
        Home
      </MenuItem>,
    );

    const item = screen.getByRole('menuitem', { name: 'Home' });

    expect(item.tagName).toBe('BUTTON');
    expect(item).toHaveAttribute('type', 'button');
    expect(item).toHaveClass(`${menuItemPrefixCls}-selected`);
    expect(item).not.toHaveAttribute('aria-current');
    expect(item).toHaveAttribute('data-selected', 'true');
    expect(item).toHaveAttribute('tabindex', '0');
  });

  it('passes aria-current through for navigation semantics', () => {
    render(
      <MenuItem aria-current='page' key='home' selected>
        Home
      </MenuItem>,
    );

    expect(screen.getByRole('menuitem', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('supports checkable menu item roles', () => {
    render(
      <MenuItem key='home' role='menuitemradio' selected>
        Home
      </MenuItem>,
    );

    const item = screen.getByRole('menuitemradio', { name: 'Home' });

    expect(item).toHaveAttribute('aria-checked', 'true');
  });

  it('removes tabIndex when disabled', () => {
    render(
      <MenuItem disabled key='home' tabIndex={0}>
        Home
      </MenuItem>,
    );

    const item = screen.getByRole('menuitem', { name: 'Home' });

    expect(item).toBeDisabled();
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveClass(`${menuItemPrefixCls}-disabled`);
    expect(item).not.toHaveAttribute('tabindex');
  });

  it('forwards user focus and click handlers', () => {
    const onClick = vi.fn();
    const onFocus = vi.fn();

    render(
      <MenuItem onClick={onClick} onFocus={onFocus}>
        Home
      </MenuItem>,
    );

    const item = screen.getByRole('menuitem', { name: 'Home' });

    fireEvent.focus(item);
    fireEvent.click(item);

    expect(onFocus).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards ref to the native button', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <MenuItem key='home' ref={ref}>
        Home
      </MenuItem>,
    );

    expect(ref.current).toBe(screen.getByRole('menuitem', { name: 'Home' }));
  });
});
