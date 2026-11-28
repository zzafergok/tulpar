import { apiSuccess } from '@/lib/api/response';
import { withApiRoute } from '@/lib/api/server';
import { destroyAdminSession, destroySession } from '@/lib/auth/session';

export const POST = withApiRoute({
  rateLimitPolicy: 'api_default',
  handler: async ({ requestId }) => {
    await destroySession();
    await destroyAdminSession();

    return apiSuccess({ message: 'Çıkış başarılı' }, requestId);
  },
});
