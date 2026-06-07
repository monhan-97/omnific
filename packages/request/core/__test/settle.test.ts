import { describe, expect, it } from 'vitest';

import FetchError from '../FetchError';
import settle from '../settle';

const createResponse = (status: number) => ({
  data: { ok: status >= 200 && status < 300 },
  status,
  statusText: String(status),
  headers: new Headers(),
  request: {},
});

describe('settle', () => {
  it('returns the response for 2xx statuses', () => {
    const response = createResponse(204);

    expect(settle(response)).toBe(response);
  });

  it('throws bad request errors for 4xx statuses', () => {
    expect(() => settle(createResponse(404))).toThrow(
      expect.objectContaining({
        code: FetchError.ERR_BAD_REQUEST,
        status: 404,
      }),
    );
  });

  it('throws bad response errors for 5xx statuses', () => {
    expect(() => settle(createResponse(503))).toThrow(
      expect.objectContaining({
        code: FetchError.ERR_BAD_RESPONSE,
        status: 503,
      }),
    );
  });
});
