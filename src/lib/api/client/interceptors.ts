import { z } from 'zod';
import { apiEnvelopeSchema } from '@/lib/api/response';
import { useAuthStore } from '@/stores/use-auth-store';
import { ApiClientError } from './errors';
import type {
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './types';

async function resolveAuthToken(config: RequestConfig): Promise<string | null> {
  if (!config.useFirebaseIdToken) {
    const storeToken = useAuthStore.getState().token;
    if (storeToken) return storeToken;
  }

  if (typeof window !== 'undefined') {
    try {
      const { getFirebaseClientAuth, isFirebaseClientConfigured } =
        await import('@/lib/firebase/client');
      if (isFirebaseClientConfigured()) {
        const currentUser = getFirebaseClientAuth().currentUser;
        if (currentUser) {
          return await currentUser.getIdToken();
        }
      }
    } catch {
      // Firebase client is optional in demo mode.
    }
  }

  return useAuthStore.getState().token;
}

export function createDefaultRequestInterceptor(): RequestInterceptor {
  return async (url, config) => {
    const headers = new Headers(config.headers);

    if (!headers.has('Content-Type') && !(config.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (!config.skipAuth && !headers.has('Authorization')) {
      const token = await resolveAuthToken(config);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return {
      url,
      config: {
        ...config,
        headers,
      },
    };
  };
}

export function createDefaultResponseInterceptor(): ResponseInterceptor {
  return (response) => {
    if (response.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return response;
  };
}

function parseRetryAfter(response: Response): number | undefined {
  const header = response.headers.get('retry-after');
  if (!header) return undefined;
  const parsed = Number.parseInt(header, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export async function parseApiResponse<T>(
  response: Response,
  config: RequestConfig,
): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }

  const requestId = response.headers.get('x-request-id') ?? undefined;
  const retryAfterSeconds = parseRetryAfter(response);

  let rawJson: unknown;
  try {
    rawJson = await response.json();
  } catch (cause) {
    if (!response.ok) {
      throw new ApiClientError({
        code: `http_${response.status}`,
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        statusText: response.statusText,
        retryable: response.status >= 500,
        retryAfterSeconds,
        requestId,
        raw: cause,
      });
    }
    return {} as T;
  }

  if (config.skipEnvelope) {
    if (!response.ok) {
      const msg =
        typeof rawJson === 'object' && rawJson && 'message' in rawJson
          ? String((rawJson as { message: unknown }).message)
          : `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiClientError({
        code: `http_${response.status}`,
        message: msg,
        status: response.status,
        statusText: response.statusText,
        retryable: response.status >= 500,
        retryAfterSeconds,
        requestId,
        raw: rawJson,
      });
    }
    if (config.schema) {
      return config.schema.parse(rawJson) as T;
    }
    return rawJson as T;
  }

  const envelopeValidator = apiEnvelopeSchema(config.schema ?? z.unknown());
  const parsed = envelopeValidator.safeParse(rawJson);

  if (!parsed.success) {
    if (!response.ok) {
      throw new ApiClientError({
        code: `http_${response.status}`,
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        statusText: response.statusText,
        retryable: response.status >= 500,
        retryAfterSeconds,
        requestId,
        raw: rawJson,
      });
    }
    throw new ApiClientError({
      code: 'invalid_envelope',
      message: 'Sunucu yanıtı beklenen biçimde değil.',
      status: response.status,
      statusText: response.statusText,
      retryable: false,
      requestId,
      raw: rawJson,
    });
  }

  if (!parsed.data.ok) {
    const err = parsed.data.error;
    throw new ApiClientError({
      code: err.code,
      message: err.message,
      status: response.status,
      statusText: response.statusText,
      retryable: err.retryable,
      retryAfterSeconds: err.retryAfterSeconds ?? retryAfterSeconds,
      requestId: parsed.data.meta.requestId || requestId,
      raw: rawJson,
    });
  }

  return parsed.data.data as T;
}
