import { describe, expect, it } from 'vitest';

import { antdDarkSystem, antdLightSystem, defaultSystem } from '../index';

type CssVarSource = {
  cssVars: Readonly<Record<string, string>>;
};

const LIGHT_MENU_VARS = [
  '--color-accent-border',
  '--color-bg-muted',
  '--color-border-muted',
  '--color-fg',
  '--color-fg-disabled',
];

const DARK_MENU_VARS = [
  '--color-accent-border',
  '--color-accent-fg',
  '--color-accent-subtle',
  '--color-bg',
  '--color-bg-muted',
  '--color-border-muted',
  '--color-fg',
  '--color-fg-disabled',
];

const getCssVarKeys = (system: CssVarSource) =>
  Object.keys(system.cssVars).sort((a, b) => a.localeCompare(b));

const getDuplicateDefaults = (system: CssVarSource) =>
  Object.entries(system.cssVars)
    .filter(([name, value]) => defaultSystem.cssVars[name] === value)
    .map(([name]) => name);

const resolveColorVar = (system: CssVarSource, name: string) =>
  system.cssVars[name] ?? defaultSystem.cssVars[name];

describe('Ant Design MenuItem theme presets', () => {
  it('only declares MenuItem light variables', () => {
    expect(getCssVarKeys(antdLightSystem)).toEqual(LIGHT_MENU_VARS);
  });

  it('only declares MenuItem dark variables', () => {
    expect(getCssVarKeys(antdDarkSystem)).toEqual(DARK_MENU_VARS);
  });

  it('only declares values that differ from the default theme', () => {
    expect(getDuplicateDefaults(antdLightSystem)).toEqual([]);
    expect(getDuplicateDefaults(antdDarkSystem)).toEqual([]);
  });

  it('inherits unchanged light values from the default theme', () => {
    expect(antdLightSystem.cssVars).not.toHaveProperty('--color-bg');
    expect(antdLightSystem.cssVars).not.toHaveProperty('--color-accent-fg');
    expect(antdLightSystem.cssVars).not.toHaveProperty('--color-accent-subtle');
  });

  it('inherits unchanged dark values from the default theme', () => {
    expect(antdDarkSystem.cssVars).not.toHaveProperty('--color-border');
    expect(antdDarkSystem.cssVars).not.toHaveProperty('--color-fg-muted');
    expect(antdDarkSystem.cssVars).not.toHaveProperty('--color-accent-solid');
    expect(antdDarkSystem.cssVars).not.toHaveProperty('--color-menu-item-active-bg');
    expect(antdDarkSystem.cssVars).not.toHaveProperty('--color-menu-item-hover-fg');
  });

  it('resolves Ant Design light MenuItem tokens', () => {
    expect(resolveColorVar(antdLightSystem, '--color-fg')).toBe('rgba(0, 0, 0, 0.88)');
    expect(resolveColorVar(antdLightSystem, '--color-bg-muted')).toBe('rgba(0, 0, 0, 0.06)');
    expect(resolveColorVar(antdLightSystem, '--color-accent-fg')).toBe('#1677ff');
    expect(resolveColorVar(antdLightSystem, '--color-accent-subtle')).toBe('#e6f4ff');
    expect(resolveColorVar(antdLightSystem, '--color-fg-disabled')).toBe('rgba(0, 0, 0, 0.25)');
    expect(resolveColorVar(antdLightSystem, '--color-border-muted')).toBe(
      'rgba(5, 5, 5, 0.06)',
    );
  });

  it('resolves Ant Design dark Menu tokens', () => {
    expect(resolveColorVar(antdDarkSystem, '--color-bg')).toBe('#001529');
    expect(resolveColorVar(antdDarkSystem, '--color-fg')).toBe('rgba(255, 255, 255, 0.65)');
    expect(resolveColorVar(antdDarkSystem, '--color-bg-muted')).toBe('transparent');
    expect(resolveColorVar(antdDarkSystem, '--color-accent-fg')).toBe('#ffffff');
    expect(resolveColorVar(antdDarkSystem, '--color-accent-subtle')).toBe('#1677ff');
    expect(resolveColorVar(antdDarkSystem, '--color-fg-disabled')).toBe(
      'rgba(255, 255, 255, 0.25)',
    );
    expect(resolveColorVar(antdDarkSystem, '--color-border-muted')).toBe(
      'rgba(253, 253, 253, 0.12)',
    );
  });

  it('keeps geometry out of theme systems', () => {
    expect(antdLightSystem.cssVars).not.toHaveProperty('--control-height-lg');
    expect(antdDarkSystem.cssVars).not.toHaveProperty('--radius-lg');
  });
});
