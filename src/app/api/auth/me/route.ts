import { apiError, apiSuccess } from '@/lib/api/response';
import { withApiRoute } from '@/lib/api/server';

export const GET = withApiRoute({
  requireAuth: true,
  rateLimitPolicy: 'api_default',
  handler: ({ user, requestId }) => {
    if (!user) {
      return apiError(
        {
          code: 'unauthorized',
          message: 'Oturum doğrulanamadı. Lütfen giriş yapın.',
          retryable: false,
        },
        requestId,
        { status: 401 },
      );
    }

    return apiSuccess(
      {
        user: {
          id: user.uid,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      requestId,
    );
  },
});
