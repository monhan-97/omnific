import { isNil } from '@omnific/utils';

import buildURL from './buildURL';

import FetchError from '../core/FetchError';
import type { RequestConfig } from '../types';

/**
 * 将请求配置解析为方法、超时时间和最终 URL。
 */
const resolveConfig = (config: RequestConfig) => {
  if (isNil(config.url)) {
    throw new FetchError(
      `URL is required but got ${typeof config.url}`,
      FetchError.ERR_BAD_REQUEST,
      config,
    );
  }

  const method = config.method || 'GET';

  return {
    method,
    timeout: config.timeout || 0,
    url: buildURL(config.url, config.params),
  };
};

export default resolveConfig;
