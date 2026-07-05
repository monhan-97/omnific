# @omnific/request

Lightweight browser-side request utilities built on top of `fetch`, with an `XMLHttpRequest` upload helper when you need progress events.

## Features

- `fetch` as the default transport for regular HTTP requests
- `XMLHttpRequest` upload helper with `onUploadProgress`
- Callable request instance plus `get`, `post`, `put`, `patch`, `delete`, `head`, and `options` helpers
- `createRequest({ baseURL })` for building preconfigured clients
- Automatic query string serialization for `params`
- Automatic request body serialization for plain objects and `URLSearchParams`
- Shared response shape across `fetch` and XHR
- Timeout and abort support, plus `isCancel` for cancellation detection
- `withCredentials` support for both fetch and XHR

## Install

```bash
pnpm add @omnific/request
```

## Breaking Changes in 0.1.0

- `FetchResponseType` is no longer exported. Use the shared `ResponseType` export instead.
- Fetch `responseType` values now use the same lowercase names as `ResponseType`: `arraybuffer` and `formdata` replace the previous `arrayBuffer` and `formData` names.

## Quick Start

```ts
import { createRequest } from '@omnific/request';

type User = {
  id: string;
  name: string;
};

const api = createRequest({
  baseURL: 'https://api.example.com',
});

const response = await api.get<User>('/users/1');

console.log(response.data.name);
```

## Request Instances

The package exports:

- `request`: a ready-to-use request instance created by `createRequest()`
- `createRequest(config?)`: a factory for creating new request instances

Each instance is callable and uses `fetch` by default:

```ts
import { request } from '@omnific/request';

const response = await request<{ ok: boolean }>({
  url: 'https://api.example.com/health',
});
```

If you want a shared `baseURL`, create an instance once and reuse it:

```ts
import { createRequest } from '@omnific/request';

const api = createRequest({
  baseURL: 'https://api.example.com/v1',
});

await api.get('/users');
await api.post('/users', {
  data: {
    name: 'Ada Lovelace',
  },
});
```

`baseURL` is an instance-level option. It is not part of the per-request `RequestConfig`.

## Uploads

`request.upload()` uses `XMLHttpRequest` so it can expose upload progress events. It always sends a `POST` request.

```ts
import { createRequest } from '@omnific/request';

const api = createRequest({
  baseURL: 'https://api.example.com',
});

const formData = new FormData();
formData.append('file', file);

const response = await api.upload<{ url: string }>('/upload', {
  data: formData,
  onUploadProgress(event) {
    console.log(event.loaded, event.total, event.progress);
  },
});

console.log(response.data.url);
```

## API

### `request(config)`

```ts
request<T>(config: FetchRequestConfig): Promise<FetchResponse<T>>
```

### Verb helpers

These helpers all use the `fetch` transport:

```ts
request.get<T>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>>
request.delete<T>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>>
request.head<T>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>>
request.options<T>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>>
request.post<T>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>>
request.put<T>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>>
request.patch<T>(url: string, config?: FetchRequestConfig): Promise<FetchResponse<T>>
```

The helper method sets `method` and `url` for you. If you pass `method` or `url` again in `config`, the helper value wins.

### `request.upload(url, config)`

```ts
request.upload<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>>
```

This helper always uses `XMLHttpRequest` and always sends `POST`.

### `createRequest(config?)`

```ts
createRequest(config?: {
  baseURL?: string;
  withCredentials?: boolean;
}): ApiRequest
```

`baseURL` is prepended to relative request URLs. Absolute request URLs are left untouched.
`withCredentials` sets the default credential behavior for created request helpers and can be overridden per request.

## Request Config

Shared request options:

```ts
type RequestConfig<D = unknown> = {
  url?: string;
  method?: Method;
  timeout?: number;
  params?: Record<string, QueryValue | QueryValue[]> | URLSearchParams;
  data?: D;
  headers?: HeadersInit;
  signal?: AbortSignal;
  withCredentials?: boolean;
  onUploadProgress?: (event: {
    loaded: number;
    total?: number;
    progress?: number;
    event?: ProgressEvent<XMLHttpRequestEventTarget>;
  }) => void;
  responseType?: ResponseType;
};
```

`url` is required when making a request.

### Fetch config

`FetchRequestConfig` currently uses the same option set as `RequestConfig`:

```ts
type FetchRequestConfig<D = unknown> = RequestConfig<D>;
```

Notes:

- `responseType` defaults to `'json'`
- supported `responseType` values are `'arraybuffer'`, `'blob'`, `'formdata'`, `'json'`, and `'text'`
- `document` is not supported by fetch and rejects with an error
- `withCredentials: true` maps to `credentials: 'include'`; `withCredentials: false` maps to `credentials: 'omit'`
- `onUploadProgress` is not supported by fetch and is ignored by regular fetch requests

### XHR config

```ts
type XhrRequestConfig<D = unknown> = RequestConfig<D>;
```

Notes:

- `responseType` defaults to `'json'`
- supported `responseType` values are `'arraybuffer'`, `'blob'`, `'document'`, `'json'`, and `'text'`
- `formdata` is not supported by XMLHttpRequest and rejects with an error
- `withCredentials` maps to `XMLHttpRequest.withCredentials`
- `onUploadProgress` is only available through the XMLHttpRequest upload channel, exposed by `request.upload()`

## URL Handling

Requests are resolved in this order:

1. `createRequest({ baseURL })` prepends `baseURL` to relative URLs
2. `params` are serialized onto the final URL

Serialization behavior:

- `null` and `undefined` query values are skipped
- array values are expanded as repeated keys
- hash fragments are removed before query params are appended
- existing query strings are preserved

```ts
const api = createRequest({
  baseURL: 'https://api.example.com',
});

await api.get('/users?page=1#team', {
  params: {
    role: ['admin', 'editor'],
    keyword: undefined,
  },
});
```

This resolves to:

```txt
https://api.example.com/users?page=1&role=admin&role=editor
```

## Request Body Serialization

The package transforms request bodies as follows:

- `FormData`, `Blob`, and `ArrayBuffer` are sent as-is
- `URLSearchParams` are serialized as `application/x-www-form-urlencoded;charset=utf-8`
- plain objects are serialized as JSON
- any request with `content-type: application/json` is serialized as JSON
- `accept: application/json, text/plain, */*` is applied by default unless already set

## Response Shape

Both transports resolve to the same structure:

```ts
type Response<T, R> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  request: R;
};
```

- `FetchResponse<T>` uses `Request` as `request`
- `XhrResponse<T>` uses `XMLHttpRequest` as `request`

## Errors and Cancellation

Requests reject when:

- the response status is outside the `2xx` range
- the network request fails
- the request times out
- the request is aborted
- an unsupported fetch `responseType` is used
- `url` is missing

`isCancel` detects aborted requests:

```ts
import { isCancel, request } from '@omnific/request';

const controller = new AbortController();

const promise = request({
  url: 'https://api.example.com/users',
  signal: controller.signal,
});

controller.abort();

try {
  await promise;
} catch (error) {
  if (isCancel(error)) {
    console.log('request canceled');
  }
}
```
