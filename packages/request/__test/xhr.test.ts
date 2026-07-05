import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import isCancel from '../cancel/isCancel';
import FetchError from '../core/FetchError';
import xhr from '../xhr';

type Listener = (event: Event) => void;

class FakeUpload {
  private listeners = new Map<string, Listener[]>();

  addEventListener(type: string, listener: EventListener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener as Listener);
    this.listeners.set(type, listeners);
  }

  emitProgress(loaded: number, total?: number) {
    this.emit('progress', {
      loaded,
      total: total ?? 0,
      lengthComputable: total !== undefined,
    } as ProgressEvent<XMLHttpRequestEventTarget>);
  }

  emitLoadEnd() {
    this.emit('loadend', new Event('loadend'));
  }

  private emit(type: string, event: Event) {
    const listeners = this.listeners.get(type) ?? [];
    for (const listener of listeners) {
      listener(event);
    }
  }
}

class FakeXMLHttpRequest {
  static instances: FakeXMLHttpRequest[] = [];

  upload = new FakeUpload();
  requestHeaders: Array<[string, string]> = [];
  method = '';
  url = '';
  isAsync = true;
  timeout = 0;
  withCredentials = false;
  responseType: XMLHttpRequestResponseType = '';
  response: unknown;
  status = 0;
  statusText = '';
  body: XMLHttpRequestBodyInit | undefined;
  aborted = false;
  onloadend: ((event: Event) => void) | undefined;

  private rawHeaders = '';
  private listeners = new Map<string, Listener[]>();

  constructor() {
    FakeXMLHttpRequest.instances.push(this);
  }

  open(method: string, url: string, isAsync = true) {
    this.method = method;
    this.url = url;
    this.isAsync = isAsync;
  }

  setRequestHeader(name: string, value: string) {
    this.requestHeaders.push([name, value]);
  }

  getAllResponseHeaders() {
    return this.rawHeaders;
  }

  addEventListener(type: string, listener: EventListener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener as Listener);
    this.listeners.set(type, listeners);
  }

  send(body?: XMLHttpRequestBodyInit | null) {
    this.body = body ?? undefined;
  }

  abort() {
    this.aborted = true;
    this.emit('abort', new Event('abort'));
  }

  respond({
    response,
    status = 200,
    statusText = 'OK',
    headers = '',
  }: {
    response: unknown;
    status?: number;
    statusText?: string;
    headers?: string;
  }) {
    this.response = response;
    this.status = status;
    this.statusText = statusText;
    this.rawHeaders = headers;
    this.onloadend?.(new Event('loadend'));
  }

  emitError() {
    this.emit('error', new Event('error'));
  }

  emitTimeout() {
    this.emit('timeout', new Event('timeout'));
  }

  private emit(type: string, event: Event) {
    const listeners = this.listeners.get(type) ?? [];
    for (const listener of listeners) {
      listener(event);
    }
  }
}

const latestRequest = () => {
  const request = FakeXMLHttpRequest.instances.at(-1);

  if (!request) {
    throw new Error('Expected XMLHttpRequest to be created');
  }

  return request;
};

describe('xhr adapter', () => {
  beforeEach(() => {
    FakeXMLHttpRequest.instances = [];
    vi.stubGlobal('XMLHttpRequest', FakeXMLHttpRequest);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens and sends a transformed request', async () => {
    const promise = xhr<{ ok: boolean }>({
      url: 'https://api.example.com/users',
      method: 'POST',
      data: { name: 'Ada' },
      withCredentials: true,
    });
    const request = latestRequest();

    request.respond({
      response: { ok: true },
      status: 201,
      statusText: 'Created',
      headers: 'X-Trace: abc',
    });

    await expect(promise).resolves.toMatchObject({
      data: { ok: true },
      status: 201,
      statusText: 'Created',
    });
    expect(request.method).toBe('POST');
    expect(request.url).toBe('https://api.example.com/users');
    expect(request.isAsync).toBe(true);
    expect(request.timeout).toBe(0);
    expect(request.withCredentials).toBe(true);
    expect(request.responseType).toBe('json');
    expect(request.body).toBe('{"name":"Ada"}');
    expect(request.requestHeaders).toEqual(
      expect.arrayContaining([
        ['accept', 'application/json, text/plain, */*'],
        ['content-type', 'application/json'],
      ]),
    );
  });

  it('removes content-type when there is no request body', () => {
    xhr({
      url: 'https://api.example.com/users',
      headers: { 'content-type': 'application/json' },
    });
    const request = latestRequest();

    expect(request.body).toBeUndefined();
    expect(request.requestHeaders).toContainEqual(['accept', 'application/json, text/plain, */*']);
    expect(request.requestHeaders).not.toContainEqual(['content-type', 'application/json']);
  });

  it('rejects unsupported formdata response types before sending', async () => {
    const promise = xhr({
      url: 'https://api.example.com/upload',
      responseType: 'formdata',
    });
    const request = latestRequest();

    await expect(promise).rejects.toMatchObject({
      code: FetchError.ERR_NOT_SUPPORT,
      message: "Response type 'formdata' is not supported by XMLHttpRequest",
    });
    expect(request.body).toBeUndefined();
  });

  it('rejects network errors and timeouts with FetchError codes', async () => {
    const errorPromise = xhr({ url: 'https://api.example.com/error' });
    latestRequest().emitError();

    await expect(errorPromise).rejects.toMatchObject({
      code: FetchError.ERR_NETWORK,
      message: 'Network Error',
    });

    const timeoutPromise = xhr({
      url: 'https://api.example.com/timeout',
      timeout: 25,
    });
    latestRequest().emitTimeout();

    await expect(timeoutPromise).rejects.toMatchObject({
      code: FetchError.ETIMEDOUT,
      message: 'timeout of 25 ms exceeded',
    });
  });

  it('rejects browser abort events as connection aborts', async () => {
    const promise = xhr({ url: 'https://api.example.com/abort' });
    const assertion = expect(promise).rejects.toMatchObject({
      code: FetchError.ECONNABORTED,
      message: 'Request aborted',
    });

    latestRequest().abort();

    await assertion;
  });

  it('rejects AbortSignal cancellations as cancel errors and aborts the request', async () => {
    const controller = new AbortController();
    const promise = xhr({
      url: 'https://api.example.com/cancel',
      signal: controller.signal,
    });
    const request = latestRequest();
    const assertion = expect(promise).rejects.toSatisfy(isCancel);

    controller.abort();

    await assertion;
    expect(request.aborted).toBe(true);
  });

  it('reports upload progress', () => {
    const onUploadProgress = vi.fn();

    xhr({
      url: 'https://api.example.com/upload',
      method: 'POST',
      data: new Blob(['hello']),
      onUploadProgress,
    });
    const request = latestRequest();

    request.upload.emitProgress(5, 10);
    request.upload.emitLoadEnd();

    expect(onUploadProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        loaded: 5,
        total: 10,
        progress: 0.5,
      }),
    );
  });
});
