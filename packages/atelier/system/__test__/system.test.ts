/**
 * @vitest-environment jsdom
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, expectTypeOf, it } from 'vitest';

import * as systemApi from '../index';
import {
  applyCssVars,
  createTheme,
  defaultColors,
  defaultSystem,
  defaultTheme,
  defaultTokens,
} from '../index';
import type { DefaultColorKey } from '../index';
import { createSystem } from '../create-system';

describe('public API', () => {
  it('does not export internal system builders', () => {
    expect(systemApi).not.toHaveProperty('createSystem');
    expect(systemApi).not.toHaveProperty('extendTheme');
  });
});

const createInvalidSystems = () => {
  // @ts-expect-error ThemeConfig does not accept mode
  createSystem({ mode: 'dark' });
  // @ts-expect-error ThemeConfig does not accept colorMode
  createSystem({ colorMode: 'dark' });
  // @ts-expect-error ThemeConfig does not accept themes
  createSystem({ themes: {} });
  // @ts-expect-error ThemeConfig does not accept currentTheme
  createSystem({ currentTheme: 'light' });
  // @ts-expect-error ThemeConfig does not accept setTheme
  createSystem({ setTheme: () => {} });
};

describe('createSystem', () => {
  it('rejects theme switching state in ThemeConfig types', () => {
    expect(createInvalidSystems).toBeTypeOf('function');
  });

  it('keeps the defaultColors property set unchanged', () => {
    expect(Object.keys(defaultColors)).toEqual([
      'bg',
      'fg',
      'border',
      'accent',
      'danger',
      'warning',
      'success',
      'info',
    ]);

    expect(Object.keys(defaultColors.bg)).toEqual([
      'base',
      'subtle',
      'muted',
      'emphasized',
      'inverted',
      'panel',
      'disabled',
      'danger',
      'warning',
      'success',
      'info',
    ]);

    expect(Object.keys(defaultColors.fg)).toEqual([
      'base',
      'muted',
      'subtle',
      'inverted',
      'disabled',
      'danger',
      'warning',
      'success',
      'info',
    ]);

    expect(Object.keys(defaultColors.border)).toEqual([
      'base',
      'muted',
      'subtle',
      'emphasized',
      'inverted',
      'danger',
      'warning',
      'success',
      'info',
    ]);

    const paletteKeys = [
      'contrast',
      'fg',
      'subtle',
      'muted',
      'emphasized',
      'solid',
      'hover',
      'active',
      'focus-ring',
      'border',
    ];

    for (const palette of ['accent', 'danger', 'warning', 'success', 'info'] as const) {
      expect(Object.keys(defaultColors[palette])).toEqual(paletteKeys);
    }
  });

  it('merges nested semantic color configs with later colors winning', () => {
    const system = createSystem(
      {
        semanticTokens: {
          colors: {
            bg: { base: '#fff', muted: '#f4f4f5' },
            accent: { solid: '#111' },
          },
        },
      },
      {
        semanticTokens: {
          colors: {
            accent: { solid: '#2563eb' },
          },
        },
      },
    );

    expect(system.colors).toEqual({
      bg: '#fff',
      'bg-muted': '#f4f4f5',
      'accent-solid': '#2563eb',
    });
    expect(system.cssVars['--color-bg']).toBe('#fff');
    expect(system.cssVars['--color-bg-muted']).toBe('#f4f4f5');
    expect(system.cssVars['--color-accent-solid']).toBe('#2563eb');
  });

  it('merges nested token groups before resolving colors', () => {
    const system = createSystem({
        tokens: {
          colors: {
            accent: {
              500: '#111111',
              600: '#222222',
            },
          },
        },
        semanticTokens: {
          colors: {
            accent: {
              solid: '{colors.accent.500}',
              active: '{colors.accent.600}',
            },
          },
        },
      },
      {
        tokens: {
          colors: {
            accent: {
              500: '#333333',
            },
          },
        },
      },
    );

    expect(system.colors['accent-solid']).toBe('#333333');
    expect(system.colors['accent-active']).toBe('#222222');
  });

  it('resolves primitive token references', () => {
    const system = createSystem({
      tokens: {
        colors: {
          white: '#ffffff',
          gray: {
            100: '#f4f4f5',
          },
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            base: '{colors.white}',
            muted: '{colors.gray.100}',
          },
        },
      },
    });

    expect(system.colors).toEqual({
      bg: '#ffffff',
      'bg-muted': '#f4f4f5',
    });
    expect(system.cssVars['--color-bg']).toBe('#ffffff');
    expect(system.cssVars['--color-bg-muted']).toBe('#f4f4f5');
  });

  it('throws for unknown primitive token references', () => {
    expect(() => {
      createSystem({
        semanticTokens: {
          colors: {
            bg: {
              base: '{colors.missing.500}',
            },
          },
        },
      });
    }).toThrow('Unknown color token reference');
  });

  it('only exposes color css vars from defaultTheme', () => {
    const { cssVars } = createSystem(defaultTheme);

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

  it('keeps info palette independent from accent overrides', () => {
    const system = createSystem(defaultTheme, {
      tokens: {
        colors: {
          accent: {
            500: '#7c3aed',
          },
        },
      },
    });

    expect(system.colors['accent-solid']).toBe('#7c3aed');
    expect(system.colors['info-solid']).toBe('#1677ff');
  });

  it('does not expose get methods or css/cva/sva style engine apis', () => {
    const system = createSystem(defaultTheme);

    expect(system).not.toHaveProperty('_config');
    expect(system).not.toHaveProperty('token');
    expect(system).not.toHaveProperty('getTokenCss');
    expect(system).not.toHaveProperty('utility');
    expect(system).not.toHaveProperty('getCssVars');
    expect(system).not.toHaveProperty('getUtilityCss');
    expect(system).not.toHaveProperty('css');
    expect(system).not.toHaveProperty('cva');
    expect(system).not.toHaveProperty('sva');
    expect(system).not.toHaveProperty('$$atelier');
    expect(system).not.toHaveProperty('tokens');
    expect(system.colors.bg).toBe('#ffffff');
    expect(system.colors['accent-solid']).toBe('#1677ff');
  });

  it('keeps theme switching outside ThemeConfig', () => {
    expect(Object.hasOwn(defaultTheme, 'mode')).toBe(false);
    expect(Object.hasOwn(defaultTheme, 'colorMode')).toBe(false);
    expect(Object.hasOwn(defaultTheme, 'themes')).toBe(false);
    expect(Object.hasOwn(defaultTheme, 'currentTheme')).toBe(false);
    expect(Object.hasOwn(defaultTheme, 'setTheme')).toBe(false);
  });

  it('keeps generated color keys in sync with defaultSystem', () => {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const generatedPath = path.resolve(currentDir, '../defaults/color-keys.gen.ts');
    const generated = readFileSync(generatedPath, 'utf8');
    const colorKeys = Object.keys(defaultSystem.colors);

    for (const key of colorKeys) {
      expect(generated).toContain(`| '${key}'`);
    }
  });

  it('preserves the existing resolved default colors', () => {
    expect(defaultSystem.colors['bg-danger']).toBe('#fef2f2');
    expect(defaultSystem.colors['danger-subtle']).toBe('#fff1f0');
    expect(defaultSystem.colors['accent-emphasized']).toBe('#69b1ff');
    expect(defaultSystem.colors['info-emphasized']).toBe('#69b1ff');
  });

  it('only keeps primitive tokens used by the default semantic palette', () => {
    expect(Object.hasOwn(defaultTokens, 'current')).toBe(false);
    expect(Object.hasOwn(defaultTokens.gray, '900')).toBe(false);
    expect(Object.hasOwn(defaultTokens, 'transparent')).toBe(false);
    expect(defaultTokens.gray[100]).toBe('#f4f4f5');
    expect(defaultTokens.accent[200]).toBe('#69b1ff');
    expect(defaultTokens.danger[25]).toBe('#fef2f2');
    expect(defaultTokens.danger[50]).toBe('#fff1f0');
    expect(defaultTokens.info[200]).toBe('#69b1ff');
  });

  it('infers generated color keys', () => {
    expectTypeOf<'bg-muted'>().toMatchTypeOf<DefaultColorKey>();
    expectTypeOf<'accent-solid'>().toMatchTypeOf<DefaultColorKey>();
  });
});

describe('defaultSystem', () => {
  it('resolves the default theme into flat colors and css vars', () => {
    expect(defaultSystem.colors.bg).toBe('#ffffff');
    expect(defaultSystem.colors['bg-muted']).toBe('#f4f4f5');
    expect(defaultSystem.colors['accent-solid']).toBe('#1677ff');
    expect(defaultSystem.cssVars['--color-bg']).toBe('#ffffff');
  });
});

describe('createTheme', () => {
  it('records only the provided vars', () => {
    const system = createTheme('app', {
      semanticTokens: {
        colors: {
          accent: {
            solid: '#7c3aed',
          },
        },
      },
    });

    expect(system.name).toBe('app');
    expect(system.cssVars['--color-accent-solid']).toBe('#7c3aed');
    expect(system.cssVars).not.toHaveProperty('--color-bg');
  });

  it('keeps explicitly configured vars even when they equal the default value', () => {
    const system = createTheme('pinned', {
      semanticTokens: {
        colors: {
          bg: { base: '#ffffff' },
        },
      },
    });

    expect(system.cssVars['--color-bg']).toBe('#ffffff');
  });

  it('produces empty cssVars when no override is provided', () => {
    const system = createTheme('light');

    expect(system.cssVars).toEqual({});
  });
});

describe('applyCssVars', () => {
  it('reuses one style tag per system name and refcounts mounts', () => {
    const system = {
      name: 'shared',
      ...createSystem({
        semanticTokens: {
          colors: {
            bg: { base: '#abcdef' },
            fg: { base: '#123456' },
          },
        },
      }),
    };

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
    expect(style?.textContent).not.toContain('--radius-');
    expect(style?.textContent).not.toContain('--control-height-');
    expect(style?.textContent).not.toContain('--shadow-');
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
    const system = {
      name: 'multi-host',
      ...createSystem({
        semanticTokens: {
          colors: {
            bg: { base: '#112233' },
          },
        },
      }),
    };
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
    const rootSystem = {
      name: 'root-theme',
      ...createSystem({
        semanticTokens: {
          colors: {
            bg: { base: '#112233' },
          },
        },
      }),
    };
    const localSystem = {
      name: 'local-theme',
      ...createSystem({
        semanticTokens: {
          colors: {
            bg: { base: '#445566' },
          },
        },
      }),
    };
    const host = document.createElement('div');
    document.body.append(host);

    const disposeRoot = applyCssVars(rootSystem, document.documentElement);
    const disposeLocal = applyCssVars(localSystem, host);

    expect(document.querySelectorAll('style[data-atelier-css-vars]')).toHaveLength(2);
    expect(document.documentElement.dataset.atelierTheme).toBe('root-theme');
    expect(host.dataset.atelierTheme).toBe('local-theme');
    expect(host.getAttribute('style')).toBeNull();
    expect(
      [...document.querySelectorAll('style[data-atelier-css-vars]')].some(node =>
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

  it('emits system css vars for root-level themes', () => {
    const system = createTheme('override-root', {
      semanticTokens: {
        colors: {
          bg: { base: '#000000' },
        },
      },
    });

    const dispose = applyCssVars(system, document.documentElement);
    const themeStyle = document.querySelector<HTMLStyleElement>(
      'style[data-atelier-system="override-root"]',
    );

    expect(document.querySelectorAll('style[data-atelier-css-vars]')).toHaveLength(1);
    expect(themeStyle?.textContent).toContain('[data-atelier-theme="override-root"]');
    expect(themeStyle?.textContent).toContain('--color-bg: #000000;');
    expect(themeStyle?.textContent).not.toContain('--color-fg:');

    dispose();
    expect(document.querySelectorAll('style[data-atelier-css-vars]')).toHaveLength(0);
  });

  it('emits only configured variables for local themed elements', () => {
    const system = createTheme('full-local', {
      semanticTokens: {
        colors: {
          bg: { base: '#000000' },
        },
      },
    });
    const host = document.createElement('div');
    document.body.append(host);

    const dispose = applyCssVars(system, host);
    const style = document.querySelector('style[data-atelier-system="full-local"]');

    expect(style?.textContent).toContain('--color-bg: #000000;');
    expect(style?.textContent).not.toContain('--color-fg:');

    dispose();
    host.remove();
  });

  it('escapes system names in the generated attribute selector', () => {
    const name = 'quoted "theme"';
    const system = {
      name,
      ...createSystem({
        semanticTokens: {
          colors: {
            bg: { base: '#000000' },
          },
        },
      }),
    };
    const host = document.createElement('div');
    document.body.append(host);

    const dispose = applyCssVars(system, host);
    const style = [
      ...document.querySelectorAll<HTMLStyleElement>('style[data-atelier-css-vars]'),
    ].find(node => node.dataset.atelierSystem === name);

    expect(style?.textContent).toContain(`[data-atelier-theme="${CSS.escape(name)}"]`);
    expect(style?.textContent).not.toContain(`[data-atelier-theme="${name}"]`);

    dispose();
    host.remove();
  });
});
