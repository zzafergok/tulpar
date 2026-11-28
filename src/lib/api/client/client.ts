import { ApiClientError } from './errors';
import {
  createDefaultRequestInterceptor,
  createDefaultResponseInterceptor,
  parseApiResponse,
} from './interceptors';
import type {
  ErrorInterceptor,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './types';

class InterceptorManager<T> {
  private handlers: T[] = [];

  use(handler: T): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  getAll(): readonly T[] {
    return this.handlers;
  }
}

export class ApiClient {
  public readonly interceptors = {
    request: new InterceptorManager<RequestInterceptor>(),
    response: new InterceptorManager<ResponseInterceptor>(),
    error: new InterceptorManager<ErrorInterceptor>(),
  };

  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || '', timeout = 15_000) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
    this.interceptors.request.use(createDefaultRequestInterceptor());
    this.interceptors.response.use(createDefaultResponseInterceptor());
  }

  public useRequestInterceptor(interceptor: RequestInterceptor): () => void {
    return this.interceptors.request.use(interceptor);
  }

  public useResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    return this.interceptors.response.use(interceptor);
  }

  public useErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    return this.interceptors.error.use(interceptor);
  }

  private resolveUrl(endpoint: string, params?: RequestConfig['params']): string {
    const normalizedBaseUrl = this.baseUrl.replace(/\/+$/, '');
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;
    const resolvedEndpoint =
      normalizedBaseUrl.endsWith('/api') &&
      normalizedEndpoint.startsWith('/api/')
        ? normalizedEndpoint.slice(4)
        : normalizedEndpoint;

    let fullUrl = endpoint.startsWith('http')
      ? endpoint
      : `${normalizedBaseUrl}${resolvedEndpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
      }
    }

    return fullUrl;
  }

  public async request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    let currentUrl = this.resolveUrl(endpoint, config.params);
    let currentConfig: RequestConfig = { ...config };

    for (const interceptor of this.interceptors.request.getAll()) {
      const result = await interceptor(currentUrl, currentConfig);
      currentUrl = result.url;
      currentConfig = result.config;
    }

    const controller = new AbortController();
    const timeout = currentConfig.timeout || this.defaultTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const {
      body,
      params: _params,
      skipAuth: _skipAuth,
      skipEnvelope: _skipEnvelope,
      useFirebaseIdToken: _useFb,
      schema: _schema,
      timeout: _timeout,
      ...customOptions
    } = currentConfig;

    const fetchOptions: RequestInit = {
      ...customOptions,
      signal: controller.signal,
      body:
        body && typeof body === 'object' && !(body instanceof FormData)
          ? JSON.stringify(body)
          : (body as BodyInit | undefined),
    };

    try {
      let response = await fetch(currentUrl, fetchOptions);
      clearTimeout(timeoutId);

      for (const interceptor of this.interceptors.response.getAll()) {
        response = await interceptor(response, currentConfig);
      }

      return await parseApiResponse<T>(response, currentConfig);
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      const finalError =
        error instanceof ApiClientError
          ? error
          : error instanceof Error && error.name === 'AbortError'
            ? new ApiClientError({
                code: 'request_timeout',
                message: 'İstek zaman aşımına uğradı.',
                status: 408,
                statusText: 'Request Timeout',
                retryable: true,
              })
            : error instanceof Error
              ? error
              : new ApiClientError({
                  code: 'network_error',
                  message: 'Beklenmeyen bir ağ hatası oluştu.',
                  status: 0,
                  retryable: true,
                  raw: error,
                });

      for (const interceptor of this.interceptors.error.getAll()) {
        await interceptor(finalError);
      }

      throw finalError;
    }
  }

  public get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  public put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  public patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  public delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
