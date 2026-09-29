// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { createSystem, defineTokens, useTheme } from '../index';

afterEach(() => {
  cleanup();
  for (const node of document.querySelectorAll('style[data-atelier-css-vars]')) {
    node.remove();
  }
  delete document.documentElement.dataset.atelierTheme;
});

describe('useTheme', () => {
  it('registers css vars on documentElement when ref is not bound', () => {
    const system = createSystem(
      'root-probe',
      defineTokens({
        colors: {
          bg: { value: '#ffffff' },
        },
      }),
    );

    const Probe = () => {
      useTheme(system);
      return <div>probe</div>;
    };

    render(<Probe />);

    expect(document.documentElement.dataset.atelierTheme).toBe('root-probe');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()).toBe(
      '#ffffff',
    );
    expect(document.querySelectorAll('head > style[data-atelier-css-vars]')).toHaveLength(1);
  });

  it('scopes css vars to the bound element via attribute selector', () => {
    const system = createSystem(
      'scoped-probe',
      defineTokens({
        colors: {
          bg: { value: '#111111' },
        },
      }),
    );

    const Probe = () => {
      const themeRef = useTheme<HTMLDivElement>(system);
      return <div data-testid="host" ref={themeRef} />;
    };

    const { getByTestId } = render(<Probe />);
    const host = getByTestId('host');

    expect(host.dataset.atelierTheme).toBe('scoped-probe');
    expect(host.getAttribute('style')).toBeNull();
    expect(document.querySelector('style[data-atelier-css-vars]')?.textContent).toContain(
      'data-atelier-theme',
    );
    expect(getComputedStyle(host).getPropertyValue('--color-bg').trim()).toBe('#111111');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()).toBe(
      '',
    );
  });
});
