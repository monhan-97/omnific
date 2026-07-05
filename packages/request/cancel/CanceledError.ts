import { isUndefined } from '@omnific/utils';

import FetchError from '../core/FetchError';
import type { RequestConfig } from '../types';

/**
 * 请求被取消时使用的错误类型。
 */
class CanceledError extends FetchError {
  __CANCEL__ = true;

  constructor(message: string | undefined, config?: RequestConfig) {
    super(isUndefined(message) ? 'canceled' : message, FetchError.ERR_CANCELED, config);
    this.name = 'CanceledError';
  }
}

export default CanceledError;
