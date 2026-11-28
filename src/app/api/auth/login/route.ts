import { apiError, apiSuccess } from '@/lib/api/response';
import { withApiRoute } from '@/lib/api/server';
import { authenticateAdmin } from '@/lib/auth/admin-auth';
import { loginSchema } from '@/lib/auth/auth-schema';
import { signInWithFirebasePassword } from '@/lib/auth/firebase-identity';
import { signToken } from '@/lib/auth/jwt';
import { createAdminSession, createSession } from '@/lib/auth/session';

export const POST = withApiRoute({
  rateLimitPolicy: 'auth_login',
  bodySchema: loginSchema,
  handler: async ({ body, requestId }) => {
    const { email, password, isAdmin } = body;

    if (isAdmin) {
      const adminResult = await authenticateAdmin(email, password);
      if (!adminResult.ok) {
        return apiError(
          {
            code: adminResult.status === 403 ? 'forbidden' : 'invalid_credentials',
            message: adminResult.message,
            retryable: false,
          },
          requestId,
          { status: adminResult.status },
        );
      }

      const token = signToken({
        sub: adminResult.user.id,
        email: adminResult.user.email,
        name: adminResult.user.name,
        role: 'admin',
      });
      await createAdminSession(token);
      return apiSuccess(
        {
          message: 'Giriş başarılı',
          token,
          user: adminResult.user,
        },
        requestId,
      );
    }

    const identity = await signInWithFirebasePassword(email, password);
    if (!identity) {
      return apiError(
        {
          code: 'invalid_credentials',
          message: 'E-posta veya şifre hatalı.',
          retryable: false,
        },
        requestId,
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

    return apiSuccess(
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
      requestId,
    );
  },
});
