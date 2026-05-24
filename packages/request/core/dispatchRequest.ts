import throwIfAborted from './throwIfAborted';

import isCancel from '../cancel/isCancel';
import fetch from '../fetch';
import xhr from '../xhr';

interface RequestFunction {
  (config: any): Promise<any>;
}

const createRequest = (request: RequestFunction) => {
  function wrapper(config: any) {
    return request(config)
      .then(response => {
        throwIfAborted(config);
        return response;
      })
      .catch(error => {
        if (!isCancel(error)) {
          throwIfAborted(config);
        }
        throw error;
      });
  }
  return wrapper;
};

export const dispatchFetchRequest: typeof fetch = createRequest(fetch);

export const dispatchXhrRequest: typeof xhr = createRequest(xhr);
