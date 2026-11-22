import { NextResponse } from 'next/server';
import { withApiRoute } from '@/lib/api/server';
import { loginSchema } from '@/lib/auth/auth-schema';
import { signInWithFirebasePassword } from '@/lib/auth/firebase-identity';
import { signToken } from '@/lib/auth/jwt';
import { createAdminSession, createSession } from '@/lib/auth/session';

export const POST = withApiRoute({
  rateLimitPolicy: 'auth_login',
  bodySchema: loginSchema,
  handler: async ({ body }) => {
    const { email, password, isAdmin } = body;

    if (isAdmin) {
      const role = 'admin' as const;
      const name = email.split('@')[0].toUpperCase();
      const userId = 'admin_123';
      const token = signToken({ sub: userId, email, name, role });
      await createAdminSession(token);
      return NextResponse.json({
        message: 'Giriş başarılı',
        token,
        user: { id: userId, email, name, role },
      });
    }

    const identity = await signInWithFirebasePassword(email, password);
    if (!identity) {
      return NextResponse.json(
        { message: 'E-posta veya şifre hatalı.' },
        { status: 401 },
      );
    }

    const role = 'user' as const;
    const name = identity.displayName || email.split('@')[0].toUpperCase();
    const token = signToken({
      sub: identity.uid,
      email: identity.email,
      name,
      role,
    });

    await createSession(token);

    return NextResponse.json(
      {
        message: 'Giriş başarılı',
        token,
        user: {
          id: identity.uid,
          email: identity.email,
          name,
          role,
        },
      },
      { status: 200 },
    );
  },
});
