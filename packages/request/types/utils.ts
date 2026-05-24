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
   * 请求基础地址
   */
  baseURL?: string;
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
};
