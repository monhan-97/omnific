import CanceledError from '../cancel/CanceledError';
import type { RequestConfig } from '../types';

const throwIfAborted = <T extends RequestConfig>(config: T) => {
  if (config.signal && config.signal.aborted) {
    throw new CanceledError(undefined, config);
  }
};

export default throwIfAborted;
