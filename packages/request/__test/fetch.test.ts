import { afterEach, describe, expect, it, vi } from 'vitest';

import FetchError from '../core/FetchError';
import fetchRequest from '../fetch';

describe('fetch adapter', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('creates a Request with transformed body, headers, and credentials', async () => {
    let body = '';
    let request: Request | undefined;

    vi.stubGlobal(
      'fetch',
      vi.fn(async (nextRequest: Request) => {
        request = nextRequest;
        body = await nextRequest.text();
        return new Response('{"ok":true}', { status: 200, statusText: 'OK' });
      }),
    );

    const response = await fetchRequest<{ ok: boolean }>({
      url: 'https://api.example.com/users',
      method: 'POST',
      data: { name: 'Ada' },
      withCredentials: true,
    });

    expect(response.data).toEqual({ ok: true });
    expect(request?.method).toBe('POST');
    expect(request?.credentials).toBe('include');
    expect(request?.headers.get('accept')).toBe('application/json, text/plain, */*');
    expect(request?.headers.get('content-type')).toBe('application/json');
    expect(body).toBe('{"name":"Ada"}');
  });

  it('maps withCredentials false to omitted credentials', async () => {
    let request: Request | undefined;

    vi.stubGlobal(
      'fetch',
      vi.fn(async (nextRequest: Request) => {
        request = nextRequest;
        return new Response('{}', { status: 200 });
      }),
    );

    await fetchRequest({
      url: 'https://api.example.com/users',
      withCredentials: false,
    });

    expect(request?.credentials).toBe('omit');
  });

  it('parses text responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('hello', { status: 200 })),
    );

    await expect(
      fetchRequest<string>({
        url: 'https://api.example.com/message',
        responseType: 'text',
      }),
    ).resolves.toMatchObject({ data: 'hello' });
  });

  it('parses arraybuffer responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(new Uint8Array([1, 2, 3]), { status: 200 })),
    );

    const response = await fetchRequest<ArrayBuffer>({
      url: 'https://api.example.com/file',
      responseType: 'arraybuffer',
    });

    expect([...new Uint8Array(response.data)]).toEqual([1, 2, 3]);
  });

  it('rejects unsupported document response types before dispatching', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    await expect(
      fetchRequest({
        url: 'https://api.example.com/page',
        responseType: 'document',
      }),
    ).rejects.toMatchObject({
      code: FetchError.ERR_NOT_SUPPORT,
      message: "Response type 'document' is not supported",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('throws FetchError for non-2xx responses even when json parsing fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('not json', { status: 500, statusText: 'Server Error' })),
    );

    await expect(
      fetchRequest({
        url: 'https://api.example.com/users',
      }),
    ).rejects.toMatchObject({
      code: FetchError.ERR_BAD_RESPONSE,
      status: 500,
    });
  });

  it('aborts the request when timeout expires', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async (request: Request) =>
          new Promise<Response>((_resolve, reject) => {
            request.signal.addEventListener('abort', () => {
              reject(request.signal.reason);
            });
          }),
      ),
    );

    const promise = fetchRequest({
      url: 'https://api.example.com/slow',
      timeout: 10,
    });
    const assertion = expect(promise).rejects.toMatchObject({
      code: FetchError.ETIMEDOUT,
      message: 'timeout of 10 ms exceeded',
    });

    await vi.advanceTimersByTimeAsync(10);

    await assertion;
  });
});
