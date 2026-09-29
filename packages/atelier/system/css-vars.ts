import { hasValue, isNil } from '@omnific/utils';
import type { CSSProperties } from 'react';

import type { SystemContext, ThemeTokens } from './types';

/**
 * Token 分类 → CSS 变量名前缀。
 */
const CATEGORY_PREFIX = {
  colors: 'color',
  spacing: 'space',
  radii: 'radius',
  shadows: 'shadow',
  fonts: 'font',
  fontSizes: 'font-size',
  controlHeights: 'control-height',
  focusRings: 'focus-ring',
} as const satisfies Record<keyof ThemeTokens, string>;

/**
 * CSS 属性 → ThemeTokens 分类。
 */
const STYLE_TOKEN = {
  padding: 'spacing',
  paddingInline: 'spacing',
  paddingBlock: 'spacing',
  background: 'colors',
  borderColor: 'colors',
  borderRadius: 'radii',
  boxShadow: 'shadows',
} as const satisfies Partial<Record<keyof CSSProperties & string, keyof ThemeTokens>>;

/**
 * 主题作用域属性；值为 `system.name`（含挂在 `documentElement` 上时）。
 */
const THEME_ATTR = 'data-atelier-theme';

type StyleEntry = {
  /**
   * 挂在 `document.head` 下的样式节点。
   */
  style: HTMLStyleElement;
  /**
   * 引用次数；归零后移除节点。
   */
  count: number;
};

/**
 * `system.name` → 样式节点与引用次数。
 */
const stylesByName = new Map<string, StyleEntry>();

/**
 * 将 token 分类与键转为扁平 CSS 变量名。
 *
 * @example
 * toCssVarName('colors', 'bg.muted') // '--color-bg-muted'
 * toCssVarName('focusRings', 'default') // '--focus-ring-default'
 */
export const toCssVarName = (category: keyof ThemeTokens, key: string): string => {
  const suffix = key.replaceAll('.', '-');
  return `--${CATEGORY_PREFIX[category]}-${suffix}`;
};

type StyleProperty = keyof typeof STYLE_TOKEN;

/**
 * `styleFromTokens` 单条：`[CSS 属性, token 键]`。
 */
export type TokenStyleEntry = readonly [StyleProperty, string | number | null | undefined];

/**
 * 将 token 取值写成可合并进 React `style` 的 CSS 属性对象；空值跳过。
 * ThemeTokens 分类由 `STYLE_TOKEN` 按 CSS 属性映射。
 * 传入的 `style` 后合并，可覆盖同名属性。
 *
 * @example
 * styleFromTokens(
 *   [
 *     ['padding', 4],
 *     ['background', 'bg.muted'],
 *   ],
 *   { color: 'red' },
 * )
 * // { padding: 'var(--space-4)', background: 'var(--color-bg-muted)', color: 'red' }
 */
export const styleFromTokens = (
  entries: readonly TokenStyleEntry[],
  style?: CSSProperties,
): CSSProperties => {
  const tokenStyle: Record<string, string> = {};

  for (const [property, token] of entries) {
    if (isNil(token)) {
      continue;
    }

    tokenStyle[property] = `var(${toCssVarName(STYLE_TOKEN[property], String(token))})`;
  }

  return isNil(style) ? tokenStyle : { ...tokenStyle, ...style };
};

const toCssText = (system: SystemContext): string => {
  const lines: string[] = [];

  for (const [name, value] of Object.entries(system.cssVars)) {
    lines.push(`  ${name}: ${value};`);
  }

  const selector = `[${THEME_ATTR}="${CSS.escape(system.name)}"]`;
  return `${selector} {\n${lines.join('\n')}\n}`;
};

/**
 * 将 `system.cssVars` 写入文档级 `<style>`（挂在 `document.head` 下）。
 *
 * 以 `system.name` 为 key 复用节点。返回卸载函数。
 * 目标节点设置 `data-atelier-theme={system.name}`。
 */
export const applyCssVars = (system: SystemContext, target: HTMLElement): (() => void) => {
  const { document: doc } = globalThis;
  if (isNil(doc) || isNil(doc.head)) return () => {};

  const { name } = system;
  target.setAttribute(THEME_ATTR, name);

  let entry = stylesByName.get(name);

  if (hasValue(entry) && entry.style.isConnected) {
    entry.count += 1;
  } else {
    const style = doc.createElement('style');
    style.dataset.atelierCssVars = '';
    style.dataset.atelierSystem = name;
    style.textContent = toCssText(system);
    doc.head.append(style);

    entry = { style, count: 1 };
    stylesByName.set(name, entry);
  }

  return () => {
    target.removeAttribute(THEME_ATTR);

    entry.count -= 1;
    if (entry.count > 0) return;

    entry.style.remove();
    stylesByName.delete(name);
  };
};
