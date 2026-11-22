import type { RateLimitPolicy, RateLimitPolicyId } from './types';

export const RATE_LIMIT_POLICIES: Record<RateLimitPolicyId, RateLimitPolicy> = {
  auth_login: {
    id: 'auth_login',
    maxRequests: 10,
    windowMs: 60_000,
  },
  auth_register: {
    id: 'auth_register',
    maxRequests: 5,
    windowMs: 60_000,
  },
  auth_firebase: {
    id: 'auth_firebase',
    maxRequests: 15,
    windowMs: 60_000,
  },
  api_default: {
    id: 'api_default',
    maxRequests: 60,
    windowMs: 60_000,
  },
};
