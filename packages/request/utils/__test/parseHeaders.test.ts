import { describe, expect, it } from 'vitest';

import parseHeaders from '../parseHeaders';

describe('parseHeaders', () => {
  it('normalizes header names and ignores malformed lines', () => {
    const headers = parseHeaders('Content-Type: application/json\nMalformed\nX-Trace: abc');

    expect(headers.get('content-type')).toBe('application/json');
    expect(headers.get('x-trace')).toBe('abc');
    expect(headers.has('malformed')).toBe(false);
  });

  it('keeps the first ignored duplicate and appends distinct custom values', () => {
    const headers = parseHeaders(
      'Content-Type: text/plain\nContent-Type: application/json\nX-Tag: a\nX-Tag: a\nX-Tag: b',
    );

    expect(headers.get('content-type')).toBe('text/plain');
    expect(headers.get('x-tag')).toBe('a, b');
  });
});
