import { describe, expect, it } from 'vitest';

import transformRequest from '../transformRequest';

describe('transformRequest', () => {
  it('adds default accept header and json-serializes plain objects', () => {
    const { data, headers } = transformRequest({ data: { name: 'Ada' } });

    expect(data).toBe('{"name":"Ada"}');
    expect(headers.get('accept')).toBe('application/json, text/plain, */*');
    expect(headers.get('content-type')).toBe('application/json');
  });

  it('serializes URLSearchParams as form data without overriding provided accept', () => {
    const params = new URLSearchParams({ q: 'name' });
    const { data, headers } = transformRequest({
      data: params,
      headers: { accept: 'text/plain' },
    });

    expect(data).toBe('q=name');
    expect(headers.get('accept')).toBe('text/plain');
    expect(headers.get('content-type')).toBe('application/x-www-form-urlencoded;charset=utf-8');
  });

  it('keeps binary-like bodies untouched', () => {
    const blob = new Blob(['hello']);
    const { data, headers } = transformRequest({ data: blob });

    expect(data).toBe(blob);
    expect(headers.get('content-type')).toBe(null);
  });
});
