/**
 * 请求返回数据类型
 */
export type ResponseDataType<T> = {
  code: number;
  data: T;
  message: string;
};

/**
 * 请求返回数据类型
 */
export type ResponseErrorType = {
  timestamp: number;
  path: string;
  error: string;
  status: number;
};
