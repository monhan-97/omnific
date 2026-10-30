import { useLayoutEffect, useRef } from 'react';

import { applyCssVars } from './css-vars';
import type { SystemContext } from './types';

/**
 * 将 system 的颜色 CSS 变量运行时注入到 DOM。
 *
 * 返回对象 ref：
 * - 挂到元素上时，给该节点打上 `data-atelier-theme={system.name}`；
 * - 未挂载时，变量写在 `document.documentElement`。
 *
 * `createTheme` 产出的 `cssVars` 只包含传入配置解析出的颜色变量；
 * 未声明的变量由 `:root` 默认值或祖先作用域逐层继承。
 *
 * @param system 要应用的 system。
 */
export const useTheme = <TElement extends HTMLElement = HTMLElement>(system: SystemContext) => {
  const ref = useRef<TElement | null>(null);

  useLayoutEffect(() => {
    const target = ref.current ?? document.documentElement;
    return applyCssVars(system, target);
  }, [system]);

  return ref;
};
