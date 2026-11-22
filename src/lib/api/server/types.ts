import type { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import type { AuthenticatedUser } from '@/lib/auth/request-user';
import type { RateLimitPolicyId } from '@/lib/rate-limit';

export interface ApiRouteContext<
  TBody = unknown,
  TParams = Record<string, string | string[]>,
> {
  request: NextRequest;
  requestId: string;
  user: AuthenticatedUser | null;
  userId: string | null;
  body: TBody;
  params: TParams | undefined;
}

export interface ApiRouteConfig<
  TBody = unknown,
  TParams = Record<string, string | string[]>,
> {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  rateLimitPolicy?: RateLimitPolicyId;
  bodySchema?: z.ZodType<TBody>;
  handler: (
    ctx: ApiRouteContext<TBody, TParams>,
  ) => Promise<NextResponse> | NextResponse;
}
