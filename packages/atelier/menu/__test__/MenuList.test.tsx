// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MenuItem } from '../MenuItem';
import { MenuList } from '../MenuList';

afterEach(cleanup);

const getMenu = () => screen.getByRole('menu');
const getItem = (name: string) => screen.getByRole('menuitem', { name });

const focusItemFromContainer = async (name: string) => {
  getMenu().focus();
  await waitFor(() => expect(getItem(name)).toHaveFocus());
};

describe('MenuList', () => {
  it('renders menu semantics', () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
      </MenuList>,
    );

    expect(getMenu()).toHaveAttribute('role', 'menu');
    expect(getMenu()).toHaveAttribute('aria-orientation', 'vertical');
    expect(getMenu()).toHaveAttribute('tabindex', '-1');
  });

  it('forwards role, aria-orientation and tabIndex overrides', () => {
    render(<MenuList aria-orientation='horizontal' role='listbox' tabIndex={0} />);

    const list = screen.getByRole('listbox');

    expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    expect(list).toHaveAttribute('tabindex', '0');
  });

  it('exposes the list size as a data attribute', () => {
    const { rerender } = render(
      <MenuList size='small'>
        <MenuItem>One</MenuItem>
      </MenuList>,
    );

    expect(getMenu()).toHaveAttribute('data-size', 'small');

    rerender(
      <MenuList>
        <MenuItem>One</MenuItem>
      </MenuList>,
    );

    expect(getMenu()).toHaveAttribute('data-size', 'default');
  });

  it('activates the clicked item', () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </MenuList>,
    );

    fireEvent.click(getItem('Two'));

    expect(getItem('One')).toHaveAttribute('tabindex', '-1');
    expect(getItem('Two')).toHaveAttribute('tabindex', '0');
  });

  it('uses defaultSelectedKey as the initial uncontrolled selection', () => {
    render(
      <MenuList defaultSelectedKey='one'>
        <MenuItem value='one'>One</MenuItem>
        <MenuItem value='two'>Two</MenuItem>
      </MenuList>,
    );

    expect(getItem('One')).toHaveAttribute('data-selected', 'true');
    expect(getItem('Two')).not.toHaveAttribute('data-selected');
  });

  it('selects an item and reports the next selected key in uncontrolled mode', async () => {
    const onSelect = vi.fn();

    render(
      <MenuList onSelect={onSelect}>
        <MenuItem value='one'>One</MenuItem>
        <MenuItem value='two'>Two</MenuItem>
      </MenuList>,
    );

    await waitFor(() => expect(getItem('Two')).toHaveAttribute('tabindex', '-1'));

    fireEvent.click(getItem('Two'));

    await waitFor(() => expect(getItem('Two')).toHaveAttribute('data-selected', 'true'));
    expect(getItem('One')).not.toHaveAttribute('data-selected');
    expect(onSelect).toHaveBeenCalledWith('two');
  });

  it('keeps the controlled selection until selectedKey changes', async () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <MenuList selectedKey='one' onSelect={onSelect}>
        <MenuItem value='one'>One</MenuItem>
        <MenuItem value='two'>Two</MenuItem>
      </MenuList>,
    );

    await waitFor(() => expect(getItem('Two')).toHaveAttribute('tabindex', '-1'));

    fireEvent.click(getItem('Two'));

    expect(onSelect).toHaveBeenCalledWith('two');
    expect(getItem('One')).toHaveAttribute('data-selected', 'true');
    expect(getItem('Two')).not.toHaveAttribute('data-selected');

    rerender(
      <MenuList selectedKey='two' onSelect={onSelect}>
        <MenuItem value='one'>One</MenuItem>
        <MenuItem value='two'>Two</MenuItem>
      </MenuList>,
    );

    expect(getItem('One')).not.toHaveAttribute('data-selected');
    expect(getItem('Two')).toHaveAttribute('data-selected', 'true');
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('does not fire onSelect for the already selected item', async () => {
    const onSelect = vi.fn();

    render(
      <MenuList defaultSelectedKey='one' onSelect={onSelect}>
        <MenuItem value='one'>One</MenuItem>
        <MenuItem value='two'>Two</MenuItem>
      </MenuList>,
    );

    await waitFor(() => expect(getItem('One')).toHaveAttribute('tabindex', '-1'));

    fireEvent.click(getItem('One'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('maps the selected key to aria-checked for checkable items', () => {
    render(
      <MenuList defaultSelectedKey='one'>
        <MenuItem value='one' role='menuitemradio'>
          One
        </MenuItem>
        <MenuItem value='two' role='menuitemradio'>
          Two
        </MenuItem>
      </MenuList>,
    );

    expect(screen.getByRole('menuitemradio', { name: 'One' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Two' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('starts without an active item and activates the first enabled item on container focus', async () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </MenuList>,
    );

    expect(getItem('One')).toHaveAttribute('tabindex', '-1');
    expect(getItem('Two')).toHaveAttribute('tabindex', '-1');

    getMenu().focus();

    await waitFor(() => expect(getItem('One')).toHaveFocus());
    expect(getItem('One')).toHaveAttribute('tabindex', '0');
  });

  it('moves focus with arrow keys', async () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
        <MenuItem>Three</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 'ArrowDown' });

    expect(getItem('Two')).toHaveFocus();
  });

  it('uses horizontal arrow keys when aria-orientation is horizontal', async () => {
    render(
      <MenuList aria-orientation='horizontal'>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 'ArrowRight' });

    expect(getItem('Two')).toHaveFocus();

    fireEvent.keyDown(getMenu(), { key: 'ArrowDown' });

    expect(getItem('Two')).toHaveFocus();
  });

  it('preserves item DOM nodes during arrow-key navigation', async () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </MenuList>,
    );

    const menu = getMenu();
    const one = getItem('One');
    const two = getItem('Two');

    await focusItemFromContainer('One');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });

    expect(getMenu()).toBe(menu);
    expect(getItem('One')).toBe(one);
    expect(getItem('Two')).toBe(two);
    expect(getItem('Two')).toHaveFocus();
  });

  it('skips disabled items', async () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem disabled>Two</MenuItem>
        <MenuItem>Three</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 'ArrowDown' });

    expect(getItem('Three')).toHaveFocus();
  });

  it('skips disabled items during typeahead', async () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem disabled>Two</MenuItem>
        <MenuItem>Three</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 't' });

    expect(getItem('One')).toHaveAttribute('tabindex', '-1');
    expect(getItem('Three')).toHaveFocus();
    expect(getItem('Three')).toHaveAttribute('tabindex', '0');
  });

  it('wraps focus by default', async () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 'ArrowUp' });

    expect(getItem('Two')).toHaveFocus();
  });

  it('forwards refs to the native button', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <MenuList>
        <MenuItem ref={ref}>One</MenuItem>
      </MenuList>,
    );

    expect(ref.current).toBe(getItem('One'));
  });

  it('keeps user keydown handlers observable', async () => {
    const onKeyDown = vi.fn();

    render(
      <MenuList onKeyDown={onKeyDown}>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 'ArrowDown' });

    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it('keeps user keyup handlers observable', async () => {
    const onKeyUp = vi.fn();

    render(
      <MenuList onKeyUp={onKeyUp}>
        <MenuItem>One</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyUp(getMenu(), { key: ' ' });

    expect(onKeyUp).toHaveBeenCalledOnce();
  });

  it('updates internal activeIndex', async () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 'ArrowDown' });

    expect(getItem('Two')).toHaveFocus();
    expect(getItem('Two')).toHaveAttribute('tabindex', '0');
  });

  it('registers items added after mount', async () => {
    const { rerender } = render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem>Three</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    rerender(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
        <MenuItem>Three</MenuItem>
      </MenuList>,
    );

    fireEvent.keyDown(getMenu(), { key: 'ArrowDown' });

    expect(getItem('Two')).toHaveFocus();
  });

  it('merges user item handlers with navigation handlers', async () => {
    const onClick = vi.fn();
    const onFocus = vi.fn();

    render(
      <MenuList>
        <MenuItem onClick={onClick} onFocus={onFocus}>
          One
        </MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');
    fireEvent.click(getItem('One'));

    expect(onFocus).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not handle Escape', async () => {
    const onKeyDown = vi.fn();

    render(
      <MenuList onKeyDown={onKeyDown}>
        <MenuItem>One</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 'Escape' });

    expect(getItem('One')).toHaveFocus();
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it('moves focus with typeahead text', async () => {
    render(
      <MenuList>
        <MenuItem>Alpha</MenuItem>
        <MenuItem>Beta</MenuItem>
        <MenuItem>Gamma</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('Alpha');

    fireEvent.keyDown(getMenu(), { key: 'g' });

    expect(getItem('Gamma')).toHaveFocus();
  });

  it('uses the item label for typeahead text', async () => {
    render(
      <MenuList>
        <MenuItem>One</MenuItem>
        <MenuItem label='Home'>
          <span aria-hidden='true'>★</span>首页
        </MenuItem>
        <MenuItem>Three</MenuItem>
      </MenuList>,
    );

    await focusItemFromContainer('One');

    fireEvent.keyDown(getMenu(), { key: 'h' });

    expect(getItem('首页')).toHaveFocus();
  });
});
