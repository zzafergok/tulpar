export interface ApiClientErrorInit {
  code: string;
  message: string;
  status: number;
  statusText?: string;
  retryable?: boolean;
  retryAfterSeconds?: number;
  requestId?: string;
  raw?: unknown;
}

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly statusText: string;
  public readonly retryable: boolean;
  public readonly retryAfterSeconds?: number;
  public readonly requestId?: string;
  public readonly data: unknown;

  constructor(init: ApiClientErrorInit) {
    super(init.message);
    this.name = 'ApiClientError';
    this.code = init.code;
    this.status = init.status;
    this.statusText = init.statusText ?? '';
    this.retryable = init.retryable ?? init.status >= 500;
    this.retryAfterSeconds = init.retryAfterSeconds;
    this.requestId = init.requestId;
    this.data = init.raw;
  }
}

export const ApiError = ApiClientError;
export type ApiError = ApiClientError;
