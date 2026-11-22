export type RateLimitPolicyId =
  | 'auth_login'
  | 'auth_register'
  | 'auth_firebase'
  | 'api_default';

export interface RateLimitPolicy {
  id: RateLimitPolicyId;
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitState {
  count: number;
  windowStartedAtMs: number;
}

export type RateLimitDecision =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };
