import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

import { applyCssVars } from './css-vars';
import type { SystemContext } from './types';

/**
 * 将 `system.cssVars` 运行时注入到 DOM。
 *
 * 返回对象 ref：
 * - 挂到元素上时，给该节点打上 `data-atelier-theme={system.name}`；
 * - 未挂载（`ref.current === null`）时，变量写在 `document.documentElement`（同样打上该属性）。
 *
 * 样式节点统一挂在 `document.head` 下；同一 `system.name` 复用一张 `<style>`，以引用次数管理生命周期。
 * 不使用 inline style / React Context。
 *
 * @example
 * ```tsx
 * const system = createSystem('app', defaultConfig);
 *
 * function App() {
 *   const themeRef = useTheme<HTMLDivElement>(system);
 *   return <div ref={themeRef}>...</div>;
 * }
 *
 * // 或不挂 ref，自动注册到 documentElement
 * function App() {
 *   useTheme(system);
 *   return <div>...</div>;
 * }
 * ```
 */
export const useTheme = <TElement extends HTMLElement = HTMLElement>(
  system: SystemContext,
): RefObject<TElement | null> => {
  const ref = useRef<TElement | null>(null);

  useLayoutEffect(() => {
    const target = ref.current ?? document.documentElement;
    return applyCssVars(system, target);
  }, [system]);

  return ref;
};
