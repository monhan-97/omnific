import { hasValue, isNil } from '@omnific/utils';

import type { SystemContext } from './types';

/**
 * 主题作用域属性；值为 `system.name`（含挂在 `documentElement` 上时）。
 */
const THEME_ATTR = 'data-atelier-theme';

/**
 * 将扁平语义颜色键转为 CSS 变量名。
 *
 * @example
 * toColorVarName('accent-solid') // '--color-accent-solid'
 */
export const toColorVarName = (key: string) => {
  const suffix = key.replaceAll('.', '-');
  return `--color-${suffix}`;
};

type CssVarStyleEntry = {
  /**
   * 挂在 `document.head` 下的样式节点。
   */
  style: HTMLStyleElement;
  /**
   * 引用次数；归零后移除节点。
   */
  count: number;
};

const stylesByKey = new Map<string, CssVarStyleEntry>();

/**
 * 将一个 system 的颜色 CSS 变量序列化为属性选择器规则。
 */
const toCssText = (system: SystemContext, cssVars: Readonly<Record<string, string>>) => {
  const lines: string[] = [];

  for (const [name, value] of Object.entries(cssVars)) {
    lines.push(`  ${name}: ${value};`);
  }

  const selector = `[${THEME_ATTR}="${CSS.escape(system.name)}"]`;
  return `${selector} {\n${lines.join('\n')}\n}`;
};

/**
 * 将 system 的颜色 CSS 变量写入文档级 `<style>`（挂在 `document.head` 下）。
 *
 * `system.cssVars` 只包含当前 system 配置声明的颜色变量；
 * 未声明的变量由 `:root` 默认值或祖先作用域提供。
 * 以 `system.name` 为 key 复用节点。返回卸载函数。
 * `system.name` 即主题身份，调用方必须保证同名 system 使用同一配置。
 * 目标节点设置 `data-atelier-theme={system.name}`。
 */
export const applyCssVars = (system: SystemContext, target: HTMLElement) => {
  const { document: doc } = globalThis;
  if (isNil(doc) || isNil(doc.head)) return () => {};

  const { name } = system;
  const key = name;

  target.setAttribute(THEME_ATTR, name);

  let entry = stylesByKey.get(key);

  if (hasValue(entry) && entry.style.isConnected) {
    entry.count += 1;
  } else {
    const style = doc.createElement('style');
    style.dataset.atelierCssVars = '';
    style.dataset.atelierSystem = name;
    style.textContent = toCssText(system, system.cssVars);
    doc.head.append(style);

    entry = { style, count: 1 };
    stylesByKey.set(key, entry);
  }

  return () => {
    target.removeAttribute(THEME_ATTR);

    entry.count -= 1;
    if (entry.count > 0) return;

    entry.style.remove();
    stylesByKey.delete(key);
  };
};
