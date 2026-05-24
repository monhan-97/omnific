import type { RequestConfig, Response } from '../types';

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
class FetchError<T = unknown, R = unknown> extends Error {
  status: number | undefined;

  constructor(
    public override message: string,
    public code: string,
    public config?: RequestConfig,
    public response?: Response<T, R>,
  ) {
    super(message);

    this.name = 'FetchError';
    this.status = response?.status;
  }

  static ERR_BAD_OPTION = 'ERR_BAD_OPTION';
  static ECONNABORTED = 'ECONNABORTED';
  static ETIMEDOUT = 'ETIMEDOUT';
  static ERR_NETWORK = 'ERR_NETWORK';
  static ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE';
  static ERR_BAD_REQUEST = 'ERR_BAD_REQUEST';
  static ERR_CANCELED = 'ERR_CANCELED';
  static ERR_INVALID_URL = 'ERR_INVALID_URL';
  static ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT';
}

export default FetchError;
