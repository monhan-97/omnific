import { isNil } from '@omnific/utils';
import type { DataRouter } from 'react-router';

const routerCache: { current: DataRouter | null } = { current: null };

/**
 * 缓存当前应用的 router。
 */
export function setRouter(router: DataRouter): void {
  routerCache.current = router;
}

/**
 * 获取当前应用的 router。
 */
export function getRouter(): DataRouter {
  if (isNil(routerCache.current)) {
    throw new Error('[omnific/react-router] Router 尚未初始化，请先调用 defineRoutes。');
  }

  return routerCache.current;
}

/**
 * 清空 router 缓存，主要用于隔离测试。
 */
export function clearRouter(): void {
  routerCache.current = null;
}
