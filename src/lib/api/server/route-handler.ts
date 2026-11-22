import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  getAuthenticatedUser,
  type AuthenticatedUser,
} from '@/lib/auth/request-user';
import { consumeRateLimit, resolveClientIp } from '@/lib/rate-limit';
import { readJsonBody } from './read-json-body';
import type { ApiRouteConfig } from './types';

function resolveRequestId(request: Request): string {
  const existing = request.headers.get('x-request-id')?.trim();
  return existing && existing.length > 0 ? existing : crypto.randomUUID();
}

function attachRequestId(
  response: NextResponse,
  requestId: string,
): NextResponse {
  response.headers.set('x-request-id', requestId);
  return response;
}

function mapRouteError(error: unknown, requestId: string): NextResponse {
  if (error instanceof ZodError) {
    return attachRequestId(
      NextResponse.json(
        {
          message: error.issues[0]?.message || 'Geçersiz istek verisi.',
          issues: error.issues,
        },
        { status: 400 },
      ),
      requestId,
    );
  }

  console.error(`API route error [${requestId}]:`, error);
  return attachRequestId(
    NextResponse.json(
      { message: 'Sunucu işlemi sırasında bir hata oluştu.' },
      { status: 500 },
    ),
    requestId,
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
    const requestId = resolveRequestId(request);

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
          return attachRequestId(
            NextResponse.json(
              { message: 'Oturum doğrulanamadı. Lütfen giriş yapın.' },
              { status: 401 },
            ),
            requestId,
          );
        }
        if (config.requireAdmin && user.role !== 'admin') {
          return attachRequestId(
            NextResponse.json(
              { message: 'Bu işlem için yönetici yetkisi gereklidir.' },
              { status: 403 },
            ),
            requestId,
          );
        }
      }

      if (config.rateLimitPolicy) {
        const subject = user?.uid ?? resolveClientIp(request);
        const decision = consumeRateLimit(config.rateLimitPolicy, subject);
        if (!decision.allowed) {
          const response = NextResponse.json(
            {
              message:
                'Çok fazla istek gönderdiniz. Lütfen bir süre sonra tekrar deneyin.',
            },
            { status: 429 },
          );
          response.headers.set(
            'Retry-After',
            String(decision.retryAfterSeconds),
          );
          return attachRequestId(response, requestId);
        }
      }

      let parsedBody = undefined as unknown as TBody;
      if (config.bodySchema) {
        let rawBody: unknown;
        try {
          rawBody = await readJsonBody(request);
        } catch {
          return attachRequestId(
            NextResponse.json(
              { message: 'Geçersiz JSON istek gövdesi.' },
              { status: 400 },
            ),
            requestId,
          );
        }

        const parseResult = config.bodySchema.safeParse(rawBody);
        if (!parseResult.success) {
          return attachRequestId(
            NextResponse.json(
              {
                message:
                  parseResult.error.issues[0]?.message ||
                  'Geçersiz istek verisi.',
                errors: parseResult.error.flatten().fieldErrors,
                issues: parseResult.error.issues,
              },
              { status: 400 },
            ),
            requestId,
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
