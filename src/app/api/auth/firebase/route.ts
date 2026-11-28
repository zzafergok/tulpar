import { z } from 'zod';
import { apiError, apiSuccess } from '@/lib/api/response';
import { withApiRoute } from '@/lib/api/server';
import { signToken } from '@/lib/auth/jwt';
import { createSession } from '@/lib/auth/session';
import { getAdminAuth } from '@/lib/firebase/admin';

const firebaseTokenSchema = z.object({
  idToken: z.string().min(10, 'Geçersiz Firebase kimlik belirteci.'),
});

export const POST = withApiRoute({
  rateLimitPolicy: 'auth_firebase',
  bodySchema: firebaseTokenSchema,
  handler: async ({ body, requestId }) => {
    try {
      const decoded = await getAdminAuth().verifyIdToken(body.idToken);
      const email = decoded.email ?? `${decoded.uid}@tulpar.app`;
      const name =
        typeof decoded.name === 'string' && decoded.name.trim().length > 0
          ? decoded.name
          : email.split('@')[0];

      const token = signToken({
        sub: decoded.uid,
        email,
        name,
        role: 'user',
      });

      await createSession(token);

      return apiSuccess(
        {
          message: 'Firebase ile giriş başarılı',
          token,
          user: {
            id: decoded.uid,
            email,
            name,
            role: 'user',
          },
        },
        requestId,
      );
    } catch {
      return apiError(
        {
          code: 'invalid_firebase_token',
          message: 'Firebase oturumu doğrulanamadı.',
          retryable: false,
        },
        requestId,
        { status: 401 },
      );
    }
  },
});
