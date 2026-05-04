export const DEVELOPMENT = 'development' as const;

export const PRODUCTION = 'production' as const;

export function getEnv() {
  return process.env.NODE_ENV || DEVELOPMENT;
}

export function isDevelopment() {
  return getEnv() === DEVELOPMENT;
}

export function isProduction() {
  return getEnv() === PRODUCTION;
}
