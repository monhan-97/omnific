import type { UploadProgressEvent } from '../utils/progressEventReducer';

export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'HEAD'
  | 'PATCH'
  | 'PURGE'
  | 'LINK'
  | 'UNLINK'
  | 'OPTIONS';

export type QueryValue = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export type Response<T = unknown, R = unknown> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  request: R;
};

export type RequestConfig<D = unknown, P extends QueryParams = QueryParams> = {
  /**
   * 请求地址
   */
  url?: string;
  /**
   * 请求方法
   * @default GET
   */
  method?: Method;
  /**
   * 设置请求超时时间
   * @default 0 没有超时
   */
  timeout?: number;
  /**
   *  和请求一起发送的 URL 参数
   */
  params?: P | URLSearchParams;
  /**
   * 作为请求体被发送的数据
   */
  data?: D;
  /**
   * 设置请求头
   */
  headers?: HeadersInit;

  signal?: AbortSignal;
  /**
   * 是否携带跨站点凭据。
   *
   * - fetch: `true` 映射为 `credentials: 'include'`，`false` 映射为 `credentials: 'omit'`
   * - XMLHttpRequest: 映射为 `XMLHttpRequest.withCredentials`
   *
   * @default false
   */
  withCredentials?: boolean;
  /**
   * 上传进度回调，仅 XMLHttpRequest 上传通道支持。
   *
   * fetch 当前不支持上传进度；普通 fetch 请求会忽略该配置。
   */
  onUploadProgress?: (e: UploadProgressEvent) => void;
  /**
   * 响应数据类型。
   *
   * - fetch 支持：`arraybuffer`、`blob`、`formdata`、`json`、`text`
   * - XMLHttpRequest 支持：`arraybuffer`、`blob`、`document`、`json`、`text`
   *
   * @default JSON
   */
  responseType?: ResponseType;
};

/**
 * 响应数据类型全集。
 *
 * 不同传输方式支持范围不同：
 * - fetch 不支持 `document`
 * - XMLHttpRequest 不支持 `formdata`
 */
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'formdata';
