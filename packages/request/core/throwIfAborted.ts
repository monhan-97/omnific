import CanceledError from '../cancel/CanceledError';
import type { RequestConfig } from '../types';

/**
 * 当请求信号已中止时抛出取消错误。
 */
const throwIfAborted = <T extends RequestConfig>(config: T) => {
  if (config.signal && config.signal.aborted) {
    throw new CanceledError(undefined, config);
  }
};

export default throwIfAborted;
