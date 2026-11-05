import { useEffect } from 'react';
import type { DataRouter } from 'react-router';

const DEFAULT_COLOR = '#1677ff';
const DEFAULT_HEIGHT = 2;
const DEFAULT_Z_INDEX = 9999;
const HOLD_DURATION = 120;
const FADE_DURATION = 180;
const PROGRESS_DURATION = 10_000;
const PROGRESS_FROM = 0.3;
const PROGRESS_TO = 0.88;

/**
 * 路由进度条配置。
 */
export type RouteProgressOptions = {
  /** 进度条颜色，默认 `#1677ff`。 */
  color?: string;
  /** 进度条高度，单位 px，默认 `2`。 */
  height?: number;
  /** 进度条层级，默认 `9999`。 */
  zIndex?: number;
};

/**
 * 绑定非确定路由进度条。
 *
 * 进度条只在导航期间创建，导航结束后淡出并从 DOM 中移除。
 * 返回的函数用于解除订阅和清理节点。
 */
export function bindRouteProgress(
  router: DataRouter,
  options: RouteProgressOptions = {},
): () => void {
  const document = globalThis.document;

  if (!document?.body) {
    return () => {};
  }

  const { color = DEFAULT_COLOR, height = DEFAULT_HEIGHT, zIndex = DEFAULT_Z_INDEX } = options;
  let bar: HTMLDivElement | undefined;
  let timer: ReturnType<typeof globalThis.setTimeout> | undefined;

  const show = () => {
    if (bar) {
      return;
    }

    const element = document.createElement('div');
    element.setAttribute('aria-hidden', 'true');
    Object.assign(element.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: String(zIndex),
      width: '100%',
      height: `${height}px`,
      pointerEvents: 'none',
      background: color,
      transformOrigin: 'left center',
      transform: `scaleX(${PROGRESS_FROM})`,
    });

    document.body.append(element);
    bar = element;

    element.animate(
      [{ transform: `scaleX(${PROGRESS_FROM})` }, { transform: `scaleX(${PROGRESS_TO})` }],
      { duration: PROGRESS_DURATION, easing: 'linear', fill: 'forwards' },
    );
  };

  const finish = () => {
    const element = bar;
    if (!element) {
      return;
    }

    bar = undefined;

    element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: FADE_DURATION,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
    }).onfinish = () => element.remove();
  };

  const unsubscribe = router.subscribe(({ navigation }) => {
    globalThis.clearTimeout(timer);

    if (navigation.state === 'idle') {
      if (bar) {
        timer = globalThis.setTimeout(finish, HOLD_DURATION);
      }
      return;
    }

    show();
  });

  return () => {
    unsubscribe();
    globalThis.clearTimeout(timer);
    bar?.remove();
    bar = undefined;
  };
}

/**
 * 在 React 生命周期内绑定路由进度条。
 *
 * `router` 或配置变化时会自动重新绑定，组件卸载时自动清理。
 */
export function useRouteProgress(
  router: DataRouter,
  options: RouteProgressOptions = {},
): void {
  const { color, height, zIndex } = options;

  useEffect(
    () => bindRouteProgress(router, { color, height, zIndex }),
    [router, color, height, zIndex],
  );
}
