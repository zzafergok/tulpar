import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import type {
  ApiErrorDetail,
  ApiErrorEnvelope,
  ApiSuccess,
} from './types';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface ApiResponseOptions {
  status?: number;
  retryAfterSeconds?: number;
}

function noStoreHeaders(
  requestId: string,
  retryAfterSeconds?: number,
): Record<string, string> {
  return {
    'Cache-Control': 'no-store',
    'X-Request-Id': requestId,
    ...(retryAfterSeconds
      ? { 'Retry-After': String(retryAfterSeconds) }
      : {}),
  };
}

export function requestIdFor(request: Request): string {
  const existing = request.headers.get('x-request-id')?.trim();
  return existing && UUID_PATTERN.test(existing) ? existing : randomUUID();
}

export function apiSuccess<T>(
  data: T,
  requestId: string,
  options: ApiResponseOptions = {},
): NextResponse<ApiSuccess<T>> {
  const payload: ApiSuccess<T> = {
    ok: true,
    data,
    meta: { requestId },
  };
  return NextResponse.json(payload, {
    status: options.status ?? 200,
    headers: noStoreHeaders(requestId),
  });
}

export function apiError(
  error: ApiErrorDetail,
  requestId: string,
  options: ApiResponseOptions & { status: number },
): NextResponse<ApiErrorEnvelope> {
  const payload: ApiErrorEnvelope = {
    ok: false,
    error,
    meta: { requestId },
  };
  return NextResponse.json(payload, {
    status: options.status,
    headers: noStoreHeaders(requestId, options.retryAfterSeconds),
  });
}

export function apiRateLimited(
  requestId: string,
  retryAfterSeconds: number,
  message = 'Çok fazla istek gönderdiniz. Lütfen bir süre sonra tekrar deneyin.',
): NextResponse<ApiErrorEnvelope> {
  return apiError(
    {
      code: 'rate_limited',
      message,
      retryable: true,
      retryAfterSeconds,
    },
    requestId,
    { status: 429, retryAfterSeconds },
  );
}
