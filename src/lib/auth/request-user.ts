import 'server-only';

import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { getAdminSessionToken, getSessionToken } from '@/lib/auth/session';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

export async function getAuthenticatedUser(
  request?: NextRequest,
): Promise<AuthenticatedUser | null> {
  let token: string | null = null;

  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    token = (await getSessionToken()) ?? (await getAdminSessionToken());
  }

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || !payload.sub) {
    return null;
  }

  return {
    uid: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}
