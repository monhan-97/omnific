/** 开发环境名称。 */
export const DEVELOPMENT = 'development' as const;

/** 生产环境名称。 */
export const PRODUCTION = 'production' as const;

/**
 * 获取当前 Node 环境，默认返回 development。
 */
export function getEnvironment() {
  return process.env.NODE_ENV || DEVELOPMENT;
}

/**
 * 检查当前 Node 环境是否为 development。
 */
export function isDevelopment() {
  return getEnvironment() === DEVELOPMENT;
}

/**
 * 检查当前 Node 环境是否为 production。
 */
export function isProduction() {
  return getEnvironment() === PRODUCTION;
}
