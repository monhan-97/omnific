// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useInteractions } from '../useInteractions';

afterEach(cleanup);

describe('useInteractions', () => {
  it('merges container handlers in order', () => {
    const calls: string[] = [];
    const firstDown = vi.fn(() => {
      calls.push('first down');
    });
    const secondDown = vi.fn(() => {
      calls.push('second down');
    });
    const userDown = vi.fn(() => {
      calls.push('user down');
    });
    const firstUp = vi.fn(() => {
      calls.push('first up');
    });
    const secondUp = vi.fn(() => {
      calls.push('second up');
    });
    const userUp = vi.fn(() => {
      calls.push('user up');
    });

    const Component = () => {
      const interactions = useInteractions([
        { onKeyDown: firstDown, onKeyUp: firstUp },
        { onKeyDown: secondDown, onKeyUp: secondUp },
      ]);

      return createElement('div', {
        'data-testid': 'container',
        ...interactions.getFloatingProps({
          onKeyDown: userDown,
          onKeyUp: userUp,
        }),
      });
    };

    render(createElement(Component));

    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowDown' });
    expect(calls).toEqual(['first down', 'second down', 'user down']);

    calls.length = 0;

    fireEvent.keyUp(screen.getByTestId('container'), { key: ' ' });
    expect(calls).toEqual(['first up', 'second up', 'user up']);
  });

  it('merges focus and click handlers in order', () => {
    const calls: string[] = [];
    const firstFocus = vi.fn(() => {
      calls.push('first focus');
    });
    const secondFocus = vi.fn(() => {
      calls.push('second focus');
    });
    const userFocus = vi.fn(() => {
      calls.push('user focus');
    });
    const firstClick = vi.fn(() => {
      calls.push('first click');
    });
    const secondClick = vi.fn(() => {
      calls.push('second click');
    });
    const userClick = vi.fn(() => {
      calls.push('user click');
    });

    const Component = () => {
      const interactions = useInteractions([
        { onFocus: firstFocus, onClick: firstClick },
        { onFocus: secondFocus, onClick: secondClick },
      ]);

      return createElement('button', {
        'data-testid': 'item',
        ...interactions.getFloatingProps({
          onFocus: userFocus,
          onClick: userClick,
        }),
      });
    };

    render(createElement(Component));

    fireEvent.focus(screen.getByTestId('item'));
    expect(calls).toEqual(['first focus', 'second focus', 'user focus']);

    calls.length = 0;

    fireEvent.click(screen.getByTestId('item'));
    expect(calls).toEqual(['first click', 'second click', 'user click']);
  });
});
