import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ApiClient, ApiClientError } from '@/lib/api/client';

describe('ApiClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('unwraps standard ApiEnvelope and validates with Zod schema', async () => {
    globalThis.fetch = vi.fn(async (input) => {
      expect(String(input)).toBe('http://localhost:3000/api/items');
      return new Response(
        JSON.stringify({
          ok: true,
          data: { id: 'item_1', count: 3 },
          meta: { requestId: 'req-1' },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    }) as typeof fetch;

    const client = new ApiClient('http://localhost:3000/api');
    const data = await client.get<{ id: string; count: number }>('/api/items', {
      skipAuth: true,
      schema: z.object({ id: z.string(), count: z.number() }),
    });

    expect(data).toEqual({ id: 'item_1', count: 3 });
  });

  it('throws structured ApiClientError when envelope ok is false', async () => {
    globalThis.fetch = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'rate_limited',
            message: 'Too many requests',
            retryable: true,
            retryAfterSeconds: 30,
          },
          meta: { requestId: 'req-2' },
        }),
        { status: 429, headers: { 'content-type': 'application/json' } },
      );
    }) as typeof fetch;

    const client = new ApiClient('');
    await expect(client.get('/api/test', { skipAuth: true })).rejects.toSatisfy(
      (err: unknown) =>
        err instanceof ApiClientError &&
        err.code === 'rate_limited' &&
        err.status === 429 &&
        err.retryable === true &&
        err.retryAfterSeconds === 30 &&
        err.requestId === 'req-2',
    );
  });

  it('supports skipEnvelope for external/non-envelope JSON responses', async () => {
    globalThis.fetch = vi.fn(async () => {
      return new Response(JSON.stringify({ status: 'healthy' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as typeof fetch;

    const client = new ApiClient('');
    const result = await client.get<{ status: string }>('/health', {
      skipAuth: true,
      skipEnvelope: true,
    });
    expect(result).toEqual({ status: 'healthy' });
  });
});
