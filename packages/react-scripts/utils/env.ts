export const DEVELOPMENT = 'development' as const;

export const PRODUCTION = 'production' as const;

const envKeys = ['NODE_ENV', 'SCRIPT'] as const;

type EnvKeys = (typeof envKeys)[number];

/**
 * 设置环境变量
 * @param env
 */
export function setEnv(data: Record<EnvKeys, string>) {
  for (const key of envKeys) {
    if (data[key]) {
      process.env[key] = data[key];
    }
  }
}

export function getEnv() {
  return process.env.NODE_ENV || DEVELOPMENT;
}

export function isDevelopment() {
  return getEnv() === DEVELOPMENT;
}

export function isProduction() {
  return getEnv() === PRODUCTION;
}

export function isBuild() {
  return process.env.SCRIPT === 'build';
}
