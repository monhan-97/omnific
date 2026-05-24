# @omnific/request

Web request utilities built on top of `fetch`, with XHR upload support for progress events.

## Features

- Unified request config for `fetch` and XHR uploads
- Shortcut methods for common HTTP verbs
- `baseURL` + `params` URL composition
- Automatic body serialization for JSON and `URLSearchParams`
- Abort support via `AbortSignal`
- Timeout support
- Upload progress events through `XMLHttpRequest`

## Install

```bash
pnpm add @omnific/request
```

## Usage

The package exports a default `request` function and several shortcut methods.

```ts
import { request } from '@omnific/request';

const response = await request<{ id: string; name: string }>({
  url: '/users/1',
  baseURL: 'https://api.example.com',
});

console.log(response.data.name);
```

### Shortcut methods

`request.get`, `request.delete`, `request.head`, `request.options`, `request.post`,
`request.put`, and `request.patch` all use the `fetch` transport.

```ts
import { request } from '@omnific/request';

const users = await request.get<{ id: string; name: string }[]>('/users', {
  baseURL: 'https://api.example.com',
  params: {
    page: 1,
    tag: ['active', 'staff'],
  },
});

await request.post('/users', {
  baseURL: 'https://api.example.com',
  data: {
    name: 'Ada',
  },
});
```

`request.upload` uses `XMLHttpRequest` and is intended for uploads that need progress callbacks.

```ts
import { request } from '@omnific/request';

const formData = new FormData();
formData.append('file', file);

await request.upload<{ url: string }>('/upload', {
  baseURL: 'https://api.example.com',
  data: formData,
  onUploadProgress(event) {
    console.log(event.loaded, event.total, event.progress);
  },
});
```

## API

### `request(config)`

The default request function uses `fetch`.

```ts
request<T>(config: FetchRequestConfig): Promise<FetchResponse<T>>
```

### `request.get(url, config)` and other verb helpers

```ts
request.get<T>(url: string, config: FetchRequestConfig): Promise<FetchResponse<T>>
request.post<T>(url: string, config: FetchRequestConfig): Promise<FetchResponse<T>>
request.patch<T>(url: string, config: FetchRequestConfig): Promise<FetchResponse<T>>
```

Note: in the current implementation, the shortcut methods expect a config object. Pass at
least `{}` if no extra options are needed.

### `request.upload(url, config)`

```ts
request.upload<T>(url: string, config: XhrRequestConfig): Promise<XhrResponse<T>>
```

## Request config

Shared request options:

```ts
type RequestConfig<D = unknown> = {
  url?: string;
  method?: Method;
  baseURL?: string;
  timeout?: number;
  params?: Record<string, QueryValue | QueryValue[]> | URLSearchParams;
  data?: D;
  headers?: HeadersInit;
  signal?: AbortSignal;
};
```

Additional `fetch` options:

- Any standard `RequestInit` fields supported by the runtime
- `responseType?: 'text' | 'arrayBuffer' | 'blob' | 'formData' | 'json'`

Additional XHR upload options:

- `withCredentials?: boolean`
- `responseType?: XMLHttpRequestResponseType`
- `onUploadProgress?: (event) => void`

## URL handling

- `baseURL` and `url` are joined before the request is sent
- `params` are serialized into the query string
- `null` and `undefined` query values are skipped
- Array query values are expanded as repeated keys

Example:

```ts
await request.get('/users', {
  baseURL: 'https://api.example.com',
  params: {
    page: 1,
    role: ['admin', 'editor'],
    keyword: undefined,
  },
});
```

This resolves to:

```txt
https://api.example.com/users?page=1&role=admin&role=editor
```

## Body serialization

The package transforms request bodies as follows:

- `FormData`, `Blob`, and `ArrayBuffer` are sent as-is
- `URLSearchParams` are serialized as `application/x-www-form-urlencoded;charset=utf-8`
- Plain objects are serialized as JSON
- If `content-type` already includes `application/json`, data is serialized as JSON
- `accept: application/json, text/plain, */*` is applied by default

## Response shape

Both transports resolve to the same response shape:

```ts
type Response<T, R> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  request: R;
};
```

For `fetch`, `request` is a `Request` instance. For uploads, `request` is an
`XMLHttpRequest` instance.

## Errors and cancellation

Non-2xx responses reject the promise.

Cancellation can be detected with `isCancel`:

```ts
import { isCancel, request } from '@omnific/request';

const controller = new AbortController();

try {
  await request.get('/users', {
    signal: controller.signal,
  });
} catch (error) {
  if (isCancel(error)) {
    console.log('request canceled');
    return;
  }

  throw error;
}
```

Timeouts also reject the promise. Error objects may include fields such as `code`,
`status`, `config`, and `response`, depending on the failure mode.

## Exports

```ts
export { request, isCancel } from '@omnific/request';
export type {
  ApiRequest,
  FetchRequest,
  FetchRequestConfig,
  FetchResponse,
  FetchResponseType,
  Method,
  RequestConfig,
  Response,
  XhrRequest,
  XhrRequestConfig,
  XhrResponse,
} from '@omnific/request';
```
