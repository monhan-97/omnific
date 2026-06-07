import { describe, expect, it } from 'vitest';

import buildFullPath from '../buildFullPath';

describe('buildFullPath', () => {
  it('combines baseURL with relative urls', () => {
    expect(buildFullPath('https://api.example.com', '/users')).toBe(
      'https://api.example.com/users',
    );
  });

  it('does not combine absolute urls', () => {
    expect(buildFullPath('https://api.example.com', 'https://cdn.example.com/file')).toBe(
      'https://cdn.example.com/file',
    );
  });

  it('returns the requested url when baseURL is missing', () => {
    expect(buildFullPath(undefined, '/users')).toBe('/users');
  });
});
