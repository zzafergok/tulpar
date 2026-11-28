import 'server-only';

import type { UserRecord } from 'firebase-admin/auth';
import type { JWTPayload } from '@/lib/auth/jwt';
import { getAdminAuth, isFirebaseConfigured } from './admin';

type SessionUserRecord = Pick<UserRecord, 'disabled' | 'tokensValidAfterTime'>;

function getFirebaseErrorCode(error: unknown): string | null {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }
  return null;
}

/**
 * Checks whether a session JWT is still valid against a Firebase UserRecord
 * (ensuring the user is not disabled and tokens were not revoked after `iat`).
 */
export function isUserSessionValidForRecord(
  session: Pick<JWTPayload, 'iat'>,
  user: SessionUserRecord,
): boolean {
  if (user.disabled) {
    return false;
  }

  if (!user.tokensValidAfterTime) {
    return true;
  }

  if (!session.iat || !Number.isFinite(session.iat)) {
    return false;
  }

  const validAfterMs = Date.parse(user.tokensValidAfterTime);
  if (!Number.isFinite(validAfterMs)) {
    return false;
  }

  return session.iat * 1000 >= validAfterMs;
}

/**
 * Verifies against Firebase Admin Auth that the user still exists, is enabled,
 * and has not had their tokens revoked since the session JWT was issued.
 */
export async function isFirebaseUserSessionActive(
  session: Pick<JWTPayload, 'sub' | 'iat'>,
): Promise<boolean> {
  if (!isFirebaseConfigured()) {
    return true;
  }

  try {
    const user = await getAdminAuth().getUser(session.sub);
    return isUserSessionValidForRecord(session, user);
  } catch (error: unknown) {
    if (getFirebaseErrorCode(error) === 'auth/user-not-found') {
      return false;
    }
    throw error;
  }
}
