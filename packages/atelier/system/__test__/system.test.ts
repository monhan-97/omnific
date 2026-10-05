/**
 * @vitest-environment jsdom
 */
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  applyCssVars,
  createSystem,
  defaultColors,
  defineColors,
  mergeColors,
} from '../index';

describe('createSystem', () => {
  it('merges color sets with later colors winning', () => {
    const system = createSystem(
      'merge',
      defineColors({
        bg: { value: '#fff' },
        'accent-solid': { value: '#111' },
      }),
      defineColors({
        'accent-solid': { value: '#2563eb' },
        'bg-muted': { value: '#f4f4f5' },
      }),
    );

    expect(system.name).toBe('merge');
    expect(system.colors).toEqual({
      bg: { value: '#fff' },
      'accent-solid': { value: '#2563eb' },
      'bg-muted': { value: '#f4f4f5' },
    });
    expect(system.cssVars['--color-bg']).toBe('#fff');
    expect(system.cssVars['--color-accent-solid']).toBe('#2563eb');
    expect(system.cssVars['--color-bg-muted']).toBe('#f4f4f5');
  });

  it('uses colors as the first argument with later colors winning', () => {
    const system = createSystem(
      defineColors({
        bg: { value: '#fff' },
        fg: { value: '#111' },
      }),
      defineColors({
        bg: { value: '#000' },
      }),
    );

    expect(system.name).toBe('default');
    expect(system.cssVars['--color-bg']).toBe('#000');
    expect(system.cssVars['--color-fg']).toBe('#111');
  });

  it('only exposes color css vars from defaultColors', () => {
    const system = createSystem('default-check', defaultColors);

    const { cssVars } = system;

    expect(cssVars['--color-bg']).toBe('#ffffff');
    expect(cssVars['--color-fg']).toBe('rgb(0 0 0 / 88%)');
    expect(cssVars['--color-accent-solid']).toBe('#1677ff');
    expect(cssVars['--color-danger-solid']).toBe('#ff4d4f');
    expect(cssVars['--color-border']).toBe('#d9d9d9');
    expect(cssVars).not.toHaveProperty('--space-4');
    expect(cssVars).not.toHaveProperty('--radius-md');
    expect(cssVars).not.toHaveProperty('--shadow-sm');
    expect(cssVars).not.toHaveProperty('--font-size-md');
    expect(cssVars).not.toHaveProperty('--control-height-md');
    expect(cssVars).not.toHaveProperty('--focus-ring-default');
    expect(cssVars).not.toHaveProperty('--color-primary');
    expect(cssVars).not.toHaveProperty('--atelier-colors-bg');
  });

  it('does not expose get methods or css/cva/sva style engine apis', () => {
    const system = createSystem('api-check', defaultColors);

    expect(system).not.toHaveProperty('_config');
    expect(system).not.toHaveProperty('token');
    expect(system).not.toHaveProperty('getTokenCss');
    expect(system).not.toHaveProperty('tokens');
    expect(system).not.toHaveProperty('utility');
    expect(system).not.toHaveProperty('getCssVars');
    expect(system).not.toHaveProperty('getUtilityCss');
    expect(system).not.toHaveProperty('css');
    expect(system).not.toHaveProperty('cva');
    expect(system).not.toHaveProperty('sva');
    expect(system).not.toHaveProperty('$$atelier');
    expect(system.name).toBe('api-check');
    expect(system.colors).toEqual(defaultColors);
  });

  it('infers color keys from defaultColors', () => {
    expectTypeOf<'bg-muted'>().toMatchTypeOf<keyof typeof defaultColors>();
    expectTypeOf<'accent-solid'>().toMatchTypeOf<keyof typeof defaultColors>();
  });
});

describe('mergeColors', () => {
  it('returns flat colors and color css vars', () => {
    expect(mergeColors({ bg: { value: '#abcdef' } })).toEqual({
      colors: {
        bg: { value: '#abcdef' },
      },
      cssVars: {
        '--color-bg': '#abcdef',
      },
    });
  });
});

describe('applyCssVars', () => {
  it('reuses one style tag per system name and refcounts mounts', () => {
    const system = createSystem(
      'shared',
      defineColors({
        bg: { value: '#abcdef' },
        fg: { value: '#123456' },
      }),
    );

    const dispose = applyCssVars(system, document.documentElement);

    const style = document.querySelector(
      'head > style[data-atelier-css-vars]',
    ) as HTMLStyleElement | null;
    expect(style?.parentElement).toBe(document.head);
    expect(style?.dataset.atelierSystem).toBe('shared');
    expect(style?.textContent).toContain('[data-atelier-theme="shared"]');
    expect(style?.textContent).toContain('--color-bg: #abcdef;');
    expect(style?.textContent).toContain('--color-fg: #123456;');
    expect(style?.textContent).not.toContain('--space-');
    expect(document.documentElement.dataset.atelierTheme).toBe('shared');
    expect(document.querySelectorAll('style[data-atelier-css-vars]')).toHaveLength(1);

    const disposeAgain = applyCssVars(system, document.documentElement);
    expect(document.querySelectorAll('style[data-atelier-css-vars]')).toHaveLength(1);
    expect(document.querySelector('style[data-atelier-css-vars]')).toBe(style);

    dispose();
    expect(document.querySelector('style[data-atelier-css-vars]')).toBe(style);

    disposeAgain();
    expect(document.querySelector('style[data-atelier-css-vars]')).toBeNull();
    expect(Object.hasOwn(document.documentElement.dataset, 'atelierTheme')).toBe(false);
  });

  it('shares one style when multiple containers use the same system name', () => {
    const system = createSystem(
      'multi-host',
      defineColors({
        bg: { value: '#112233' },
      }),
    );
    const hostA = document.createElement('div');
    const hostB = document.createElement('div');
    document.body.append(hostA, hostB);

    const disposeA = applyCssVars(system, hostA);
    const disposeB = applyCssVars(system, hostB);

    const style = document.querySelector('style[data-atelier-css-vars]');
    expect(document.querySelectorAll('style[data-atelier-css-vars]')).toHaveLength(1);
    expect(style?.textContent).toContain('[data-atelier-theme="multi-host"]');
    expect(hostA.dataset.atelierTheme).toBe('multi-host');
    expect(hostB.dataset.atelierTheme).toBe('multi-host');

    disposeA();

    expect(Object.hasOwn(hostA.dataset, 'atelierTheme')).toBe(false);
    expect(hostB.dataset.atelierTheme).toBe('multi-host');
    expect(style?.textContent).toContain('[data-atelier-theme="multi-host"]');

    disposeB();
    expect(document.querySelector('style[data-atelier-css-vars]')).toBeNull();
    hostA.remove();
    hostB.remove();
  });

  it('scopes a different system name on its own style tag', () => {
    const rootSystem = createSystem(
      'root-theme',
      defineColors({
        bg: { value: '#112233' },
      }),
    );
    const localSystem = createSystem(
      'local-theme',
      defineColors({
        bg: { value: '#445566' },
      }),
    );
    const host = document.createElement('div');
    document.body.append(host);

    const disposeRoot = applyCssVars(rootSystem, document.documentElement);
    const disposeLocal = applyCssVars(localSystem, host);

    expect(document.querySelectorAll('style[data-atelier-css-vars]')).toHaveLength(2);
    expect(document.documentElement.dataset.atelierTheme).toBe('root-theme');
    expect(host.dataset.atelierTheme).toBe('local-theme');
    expect(host.getAttribute('style')).toBeNull();
    expect(
      [...document.querySelectorAll('style[data-atelier-css-vars]')].some((node) =>
        node.textContent?.includes('[data-atelier-theme="local-theme"]'),
      ),
    ).toBe(true);

    disposeLocal();

    expect(Object.hasOwn(host.dataset, 'atelierTheme')).toBe(false);
    expect(document.querySelectorAll('style[data-atelier-css-vars]')).toHaveLength(1);

    disposeRoot();
    expect(document.querySelector('style[data-atelier-css-vars]')).toBeNull();
    host.remove();
  });
});
