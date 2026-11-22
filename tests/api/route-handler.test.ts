import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/auth/session', () => ({
  getSessionToken: vi.fn(async () => null),
  getAdminSessionToken: vi.fn(async () => null),
}));

import { withApiRoute } from '@/lib/api/server';
import { signToken } from '@/lib/auth/jwt';
import { resetRateLimitStore } from '@/lib/rate-limit';

describe('withApiRoute wrapper', () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it('returns 401 when requireAuth is true and no token is present', async () => {
    const handler = withApiRoute({
      requireAuth: true,
      handler: () => NextResponse.json({ ok: true }),
    });

    const res = await handler(
      new NextRequest('http://localhost/api/test', { method: 'POST' }),
    );
    expect(res.status).toBe(401);
    expect(res.headers.get('x-request-id')).toBeTruthy();
  });

  it('returns 403 when requireAdmin is true and user is not admin', async () => {
    const userToken = signToken({
      sub: 'usr_1',
      email: 'user@tulpar.app',
      role: 'user',
    });

    const handler = withApiRoute({
      requireAdmin: true,
      handler: () => NextResponse.json({ ok: true }),
    });

    const res = await handler(
      new NextRequest('http://localhost/api/admin/test', {
        method: 'POST',
        headers: { authorization: `Bearer ${userToken}` },
      }),
    );
    expect(res.status).toBe(403);
  });

  it('validates bodySchema and enforces rateLimitPolicy', async () => {
    const handler = withApiRoute({
      rateLimitPolicy: 'auth_register',
      bodySchema: z.object({ count: z.number().int().positive() }),
      handler: ({ body }) => NextResponse.json({ count: body.count }),
    });

    for (let i = 0; i < 5; i++) {
      const okRes = await handler(
        new NextRequest('http://localhost/api/register', {
          method: 'POST',
          headers: {
            'x-forwarded-for': '198.51.100.10',
            'content-type': 'application/json',
          },
          body: JSON.stringify({ count: 2 }),
        }),
      );
      expect(okRes.status).toBe(200);
    }

    const limitedRes = await handler(
      new NextRequest('http://localhost/api/register', {
        method: 'POST',
        headers: {
          'x-forwarded-for': '198.51.100.10',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ count: 2 }),
      }),
    );
    expect(limitedRes.status).toBe(429);
    expect(Number(limitedRes.headers.get('retry-after'))).toBeGreaterThan(0);
  });
});
