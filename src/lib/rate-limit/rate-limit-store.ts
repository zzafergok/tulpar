import { RATE_LIMIT_POLICIES } from './constants';
import { evaluateRateLimitWindow } from './rate-limit-window';
import type {
  RateLimitDecision,
  RateLimitPolicyId,
  RateLimitState,
} from './types';

const MAX_STORE_ENTRIES = 5_000;
const rateLimitStore = new Map<string, RateLimitState>();

function pruneExpiredEntries(nowMs: number, maxWindowMs: number): void {
  if (rateLimitStore.size < MAX_STORE_ENTRIES) {
    return;
  }
  for (const [key, state] of rateLimitStore.entries()) {
    if (nowMs - state.windowStartedAtMs >= maxWindowMs) {
      rateLimitStore.delete(key);
    }
  }
}

export function resolveClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return 'unknown';
}

export function consumeRateLimit(
  policyId: RateLimitPolicyId,
  subjectKey: string,
  nowMs = Date.now(),
): RateLimitDecision {
  const policy = RATE_LIMIT_POLICIES[policyId];
  const compositeKey = `${policy.id}:${subjectKey}`;

  pruneExpiredEntries(nowMs, policy.windowMs);

  const currentState = rateLimitStore.get(compositeKey) ?? null;
  const result = evaluateRateLimitWindow(policy, currentState, nowMs);

  if (result.nextState) {
    rateLimitStore.set(compositeKey, result.nextState);
  }

  return result.decision;
}

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
