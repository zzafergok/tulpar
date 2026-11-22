import type {
  RateLimitDecision,
  RateLimitPolicy,
  RateLimitState,
} from './types';

export interface RateLimitWindowResult {
  decision: RateLimitDecision;
  nextState: RateLimitState | null;
}

export function evaluateRateLimitWindow(
  policy: RateLimitPolicy,
  state: RateLimitState | null,
  nowMs: number,
): RateLimitWindowResult {
  const isActive =
    state !== null && nowMs - state.windowStartedAtMs < policy.windowMs;
  const activeState = isActive ? state : null;
  const count = activeState?.count ?? 0;

  if (count >= policy.maxRequests) {
    const windowEndsAt =
      (activeState?.windowStartedAtMs ?? nowMs) + policy.windowMs;
    return {
      decision: {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((windowEndsAt - nowMs) / 1000),
        ),
      },
      nextState: null,
    };
  }

  return {
    decision: { allowed: true },
    nextState: {
      count: count + 1,
      windowStartedAtMs: activeState?.windowStartedAtMs ?? nowMs,
    },
  };
}
