import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(async config => config),
  xhr: vi.fn(async config => config),
}));

vi.mock('../fetch', () => ({ default: mocks.fetch }));
vi.mock('../xhr', () => ({ default: mocks.xhr }));

describe('createRequest', () => {
  beforeEach(() => {
    mocks.fetch.mockClear();
    mocks.xhr.mockClear();
  });

  it('creates method helpers that dispatch fetch requests', async () => {
    const { createRequest } = await import('../request');
    const request = createRequest();

    await request.get('/users', { headers: { accept: 'text/plain' } });
    await request.post('/users', { data: { name: 'Ada' } });
    await request.patch('/users/1');

    expect(mocks.fetch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        headers: { accept: 'text/plain' },
        method: 'GET',
        url: '/users',
      }),
    );
    expect(mocks.fetch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: { name: 'Ada' },
        method: 'POST',
        url: '/users',
      }),
    );
    expect(mocks.fetch).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        method: 'PATCH',
        url: '/users/1',
      }),
    );
  });

  it('creates upload helper that dispatches xhr requests', async () => {
    const { createRequest } = await import('../request');
    const request = createRequest();
    const onUploadProgress = vi.fn();

    await request.upload('/files', {
      data: new Blob(['hello']),
      onUploadProgress,
    });

    expect(mocks.xhr).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(Blob),
        method: 'POST',
        onUploadProgress,
        url: '/files',
      }),
    );
  });

  it('applies default dispatch config to helpers', async () => {
    const { createRequest } = await import('../request');
    const request = createRequest({
      baseURL: 'https://api.example.com',
      transformResponse: response => response.data,
    });

    await expect(request.get('/users')).resolves.toBeUndefined();

    expect(mocks.fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.example.com/users',
      }),
    );
  });

  it('applies default withCredentials to fetch and upload helpers', async () => {
    const { createRequest } = await import('../request');
    const request = createRequest({
      withCredentials: true,
    });

    await request.get('/users');
    await request.upload('/files');

    expect(mocks.fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/users',
        withCredentials: true,
      }),
    );
    expect(mocks.xhr).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/files',
        withCredentials: true,
      }),
    );
  });

  it('allows request config to override default withCredentials', async () => {
    const { createRequest } = await import('../request');
    const request = createRequest({
      withCredentials: true,
    });

    await request.get('/users', { withCredentials: false });

    expect(mocks.fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/users',
        withCredentials: false,
      }),
    );
  });
});
