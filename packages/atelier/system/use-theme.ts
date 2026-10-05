import { useLayoutEffect, useRef } from 'react';

import { applyCssVars } from './css-vars';
import type { SystemContext } from './types';

/**
 * 将 system 的颜色 CSS 变量运行时注入到 DOM。
 *
 * 返回对象 ref：
 * - 挂到元素上时，给该节点打上 `data-atelier-theme={system.name}`；
 * - 未挂载时，变量写在 `document.documentElement`。
 */
export const useTheme = <TElement extends HTMLElement = HTMLElement>(
  system: SystemContext,
) => {
  const ref = useRef<TElement | null>(null);

  useLayoutEffect(() => {
    const target = ref.current ?? document.documentElement;
    return applyCssVars(system, target);
  }, [system]);

  return ref;
};
