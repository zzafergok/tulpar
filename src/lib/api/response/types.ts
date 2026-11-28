export interface ApiMeta {
  requestId: string;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  retryable: boolean;
  retryAfterSeconds?: number;
  details?: unknown;
}

export interface ApiErrorEnvelope {
  ok: false;
  error: ApiErrorDetail;
  meta: ApiMeta;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiErrorEnvelope;
