import { hasValue, isNil } from '@omnific/utils';

import type { SystemContext } from './types';

/**
 * 主题作用域属性；值为 `system.name`（含挂在 `documentElement` 上时）。
 */
const THEME_ATTR = 'data-atelier-theme';

const stylesByName = new Map<
  string,
  {
    /**
     * 挂在 `document.head` 下的样式节点。
     */
    style: HTMLStyleElement;
    /**
     * 引用次数；归零后移除节点。
     */
    count: number;
  }
>();

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

const toCssText = (system: SystemContext) => {
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
export const applyCssVars = (system: SystemContext, target: HTMLElement) => {
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
