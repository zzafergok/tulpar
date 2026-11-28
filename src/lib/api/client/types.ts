import type { z } from 'zod';
import type { ApiClientError } from './errors';

export interface RequestConfig<TSchema extends z.ZodType = z.ZodType>
  extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  skipAuth?: boolean;
  skipEnvelope?: boolean;
  useFirebaseIdToken?: boolean;
  schema?: TSchema;
  timeout?: number;
}

export type RequestInterceptor = (
  url: string,
  config: RequestConfig,
) =>
  | { url: string; config: RequestConfig }
  | Promise<{ url: string; config: RequestConfig }>;

export type ResponseInterceptor = (
  response: Response,
  config: RequestConfig,
) => Response | Promise<Response>;

export type ErrorInterceptor = (
  error: ApiClientError | Error,
) => void | Promise<void>;
