import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { isUserSessionValidForRecord } from '@/lib/firebase/session-verification';

describe('isUserSessionValidForRecord', () => {
  it('rejects disabled users', () => {
    const valid = isUserSessionValidForRecord(
      { iat: 1_700_000_000 },
      { disabled: true, tokensValidAfterTime: undefined },
    );
    expect(valid).toBe(false);
  });

  it('rejects tokens issued before tokensValidAfterTime', () => {
    const validAfter = new Date(1_700_000_500 * 1000).toUTCString();
    const valid = isUserSessionValidForRecord(
      { iat: 1_700_000_000 },
      { disabled: false, tokensValidAfterTime: validAfter },
    );
    expect(valid).toBe(false);
  });

  it('accepts active users with tokens issued after tokensValidAfterTime', () => {
    const validAfter = new Date(1_700_000_000 * 1000).toUTCString();
    const valid = isUserSessionValidForRecord(
      { iat: 1_700_000_600 },
      { disabled: false, tokensValidAfterTime: validAfter },
    );
    expect(valid).toBe(true);
  });
});
