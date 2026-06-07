import { describe, expect, it } from 'vitest';

import isCancel from '../../cancel/isCancel';
import { dispatchRequest } from '../dispatchRequest';

describe('dispatchRequest', () => {
  it('applies transformRequest, baseURL, and transformResponse in order', async () => {
    const seenUrls: string[] = [];
    const request = dispatchRequest(
      async config => {
        seenUrls.push(config.url);
        return {
          data: config.headers?.get('x-test'),
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
          request: config,
        };
      },
      {
        baseURL: 'https://api.example.com',
        transformRequest: config => ({
          ...config,
          url: '/users',
          headers: new Headers([['x-test', 'yes']]),
        }),
        transformResponse: response => response.data,
      },
    );

    await expect(request({ url: '/ignored' })).resolves.toBe('yes');
    expect(seenUrls).toEqual(['https://api.example.com/users']);
  });

  it('throws a cancellation error when the signal is aborted before response handling', async () => {
    const controller = new AbortController();
    const request = dispatchRequest(async () => {
      controller.abort();
      return {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        request: {},
      };
    });

    await expect(request({ url: '/users', signal: controller.signal })).rejects.toSatisfy(isCancel);
  });
});
