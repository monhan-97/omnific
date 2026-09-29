/**
 * @vitest-environment jsdom
 */
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  applyCssVars,
  createSystem,
  defaultConfig,
  defineTokens,
  styleFromTokens,
} from '../index';
import type { ColorToken, SpacingToken } from '../defaults';

describe('createSystem', () => {
  it('merges token sets with later tokens winning', () => {
    const system = createSystem(
      'merge',
      defineTokens({
        colors: {
          bg: { value: '#fff' },
          'blue.solid': { value: '#111' },
        },
      }),
      defineTokens({
        colors: {
          'blue.solid': { value: '#2563eb' },
          'bg.muted': { value: '#f4f4f5' },
        },
      }),
    );

    expect(system.name).toBe('merge');
    expect(system.cssVars['--color-bg']).toBe('#fff');
    expect(system.cssVars['--color-blue-solid']).toBe('#2563eb');
    expect(system.cssVars['--color-bg-muted']).toBe('#f4f4f5');
  });

  it('uses tokens as the first argument with later tokens winning', () => {
    const system = createSystem(
      defineTokens({
        colors: {
          bg: { value: '#fff' },
          fg: { value: '#111' },
        },
      }),
      defineTokens({
        colors: {
          bg: { value: '#000' },
        },
      }),
    );

    expect(system.name).toBe('default');
    expect(system.cssVars['--color-bg']).toBe('#000');
    expect(system.cssVars['--color-fg']).toBe('#111');
  });

  it('exposes flat css vars as a cached property', () => {
    const system = createSystem('default-check', defaultConfig);

    const { cssVars } = system;

    expect(cssVars['--color-bg']).toBe('#ffffff');
    expect(cssVars['--color-fg']).toBe('rgb(0 0 0 / 88%)');
    expect(cssVars['--color-blue-solid']).toBe('#1677ff');
    expect(cssVars['--color-red-solid']).toBe('#ff4d4f');
    expect(cssVars['--color-border']).toBe('#d9d9d9');
    expect(cssVars['--space-4']).toBe('16px');
    expect(cssVars['--radius-md']).toBe('6px');
    expect(cssVars['--shadow-sm']).toBe(
      '0px 2px 4px rgb(24 24 27 / 0.1), 0px 0px 1px rgb(24 24 27 / 0.3)',
    );
    expect(cssVars['--focus-ring-default']).toBe('rgb(21 112 239 / 25%)');
    expect(cssVars['--font-size-md']).toBe('14px');
    expect(cssVars['--control-height-md']).toBe('32px');
    expect(cssVars).not.toHaveProperty('--color-primary');
    expect(cssVars).not.toHaveProperty('--atelier-colors-bg');
  });

  it('does not expose get methods or css/cva/sva style engine apis', () => {
    const system = createSystem('api-check', defaultConfig);

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
    expect(system._config).toEqual(defaultConfig);
  });

  it('exports category key unions from default tokens', () => {
    expectTypeOf<'bg.muted'>().toMatchTypeOf<ColorToken>();
    expectTypeOf<'blue.solid'>().toMatchTypeOf<ColorToken>();
    expectTypeOf<4>().toMatchTypeOf<SpacingToken>();
    expectTypeOf<0.5>().toMatchTypeOf<SpacingToken>();
  });
});

describe('styleFromTokens', () => {
  it('maps present tokens to css var styles and skips empty values', () => {
    expect(
      styleFromTokens([
        ['padding', 4],
        ['background', 'bg.muted'],
        ['borderRadius', undefined],
      ]),
    ).toEqual({
      padding: 'var(--space-4)',
      background: 'var(--color-bg-muted)',
    });
  });

  it('merges the style argument after token styles', () => {
    expect(
      styleFromTokens(
        [
          ['padding', 4],
          ['background', 'bg.muted'],
        ],
        { color: 'red', background: 'blue' },
      ),
    ).toEqual({
      padding: 'var(--space-4)',
      background: 'blue',
      color: 'red',
    });
  });
});

describe('applyCssVars', () => {
  it('reuses one style tag per system name and refcounts mounts', () => {
    const system = createSystem(
      'shared',
      defineTokens({
        colors: {
          bg: { value: '#abcdef' },
          fg: { value: '#123456' },
        },
      }),
    );

    const dispose = applyCssVars(system, document.documentElement);

    const style = document.querySelector('head > style[data-atelier-css-vars]') as HTMLStyleElement | null;
    expect(style?.parentElement).toBe(document.head);
    expect(style?.dataset.atelierSystem).toBe('shared');
    expect(style?.textContent).toContain('[data-atelier-theme="shared"]');
    expect(style?.textContent).toContain('--color-bg: #abcdef;');
    expect(style?.textContent).toContain('--color-fg: #123456;');
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
      defineTokens({
        colors: {
          bg: { value: '#112233' },
        },
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
      defineTokens({
        colors: {
          bg: { value: '#112233' },
        },
      }),
    );
    const localSystem = createSystem(
      'local-theme',
      defineTokens({
        colors: {
          bg: { value: '#445566' },
        },
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
