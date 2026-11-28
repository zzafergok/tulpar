import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  apiError,
  apiRateLimited,
  requestIdFor,
} from '@/lib/api/response';
import {
  getAuthenticatedUser,
  type AuthenticatedUser,
} from '@/lib/auth/request-user';
import { FirestoreOwnershipError } from '@/lib/firebase/firestore-helpers';
import { consumeRateLimit, resolveClientIp } from '@/lib/rate-limit';
import { readJsonBody } from './read-json-body';
import type { ApiRouteConfig } from './types';

function attachRequestId(
  response: NextResponse,
  requestId: string,
): NextResponse {
  if (!response.headers.has('x-request-id')) {
    response.headers.set('x-request-id', requestId);
  }
  return response;
}

function mapRouteError(error: unknown, requestId: string): NextResponse {
  if (error instanceof ZodError) {
    return apiError(
      {
        code: 'validation_error',
        message: error.issues[0]?.message || 'Geçersiz istek verisi.',
        retryable: false,
        details: error.issues,
      },
      requestId,
      { status: 400 },
    );
  }

  if (error instanceof FirestoreOwnershipError) {
    return apiError(
      {
        code: 'not_found',
        message: error.message,
        retryable: false,
      },
      requestId,
      { status: 404 },
    );
  }

  console.error(`API route error [${requestId}]:`, error);
  return apiError(
    {
      code: 'internal_error',
      message: 'Sunucu işlemi sırasında bir hata oluştu.',
      retryable: true,
    },
    requestId,
    { status: 500 },
  );
}

export function withApiRoute<
  TBody = unknown,
  TParams = Record<string, string | string[]>,
>(config: ApiRouteConfig<TBody, TParams>) {
  return async (
    request: NextRequest,
    routeSegment?: { params?: Promise<TParams> | TParams },
  ): Promise<NextResponse> => {
    const requestId = requestIdFor(request);

    try {
      const resolvedParams = routeSegment?.params
        ? routeSegment.params instanceof Promise
          ? await routeSegment.params
          : routeSegment.params
        : undefined;

      let user: AuthenticatedUser | null = null;
      if (config.requireAuth || config.requireAdmin) {
        user = await getAuthenticatedUser(request);
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
        if (config.requireAdmin && user.role !== 'admin') {
          return apiError(
            {
              code: 'forbidden',
              message: 'Bu işlem için yönetici yetkisi gereklidir.',
              retryable: false,
            },
            requestId,
            { status: 403 },
          );
        }
      }

      if (config.rateLimitPolicy) {
        const subject = user?.uid ?? resolveClientIp(request);
        const decision = consumeRateLimit(config.rateLimitPolicy, subject);
        if (!decision.allowed) {
          return apiRateLimited(requestId, decision.retryAfterSeconds);
        }
      }

      let parsedBody = undefined as unknown as TBody;
      if (config.bodySchema) {
        let rawBody: unknown;
        try {
          rawBody = await readJsonBody(request);
        } catch {
          return apiError(
            {
              code: 'invalid_json',
              message: 'Geçersiz JSON istek gövdesi.',
              retryable: false,
            },
            requestId,
            { status: 400 },
          );
        }

        const parseResult = config.bodySchema.safeParse(rawBody);
        if (!parseResult.success) {
          return apiError(
            {
              code: 'validation_error',
              message:
                parseResult.error.issues[0]?.message ||
                'Geçersiz istek verisi.',
              retryable: false,
              details: parseResult.error.flatten().fieldErrors,
            },
            requestId,
            { status: 400 },
          );
        }
        parsedBody = parseResult.data;
      }

      const response = await config.handler({
        request,
        requestId,
        user,
        userId: user?.uid ?? null,
        body: parsedBody,
        params: resolvedParams,
      });

      return attachRequestId(response, requestId);
    } catch (error) {
      return mapRouteError(error, requestId);
    }
  };
}
