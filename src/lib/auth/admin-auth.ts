import 'server-only';

import { demoLoginCredentials } from '@/lib/auth/demo-credentials';
import { signInWithFirebasePassword } from '@/lib/auth/firebase-identity';
import { getAdminAuth, isFirebaseConfigured } from '@/lib/firebase/admin';

export type AdminAuthResult =
  | {
      ok: true;
      user: { id: string; email: string; name: string; role: 'admin' };
    }
  | {
      ok: false;
      status: 401 | 403;
      message: string;
    };

function isDemoAdminAllowed(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.ALLOW_DEMO_AUTH === 'true'
  );
}

function matchesDemoAdmin(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === demoLoginCredentials.admin.email &&
    password === demoLoginCredentials.admin.password
  );
}

/**
 * Authenticates an administrator using verified credentials and role claims.
 * Demo admin credentials are only accepted outside production when ALLOW_DEMO_AUTH=true.
 */
export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminAuthResult> {
  if (isDemoAdminAllowed() && matchesDemoAdmin(email, password)) {
    return {
      ok: true,
      user: {
        id: 'admin_123',
        email: demoLoginCredentials.admin.email,
        name: 'ADMIN',
        role: 'admin',
      },
    };
  }

  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !isFirebaseConfigured()) {
    return {
      ok: false,
      status: 401,
      message: 'Yönetici e-posta veya şifresi hatalı.',
    };
  }

  const identity = await signInWithFirebasePassword(email, password);
  if (!identity) {
    return {
      ok: false,
      status: 401,
      message: 'Yönetici e-posta veya şifresi hatalı.',
    };
  }

  try {
    const userRecord = await getAdminAuth().getUser(identity.uid);
    const claims = userRecord.customClaims ?? {};
    const hasAdminRole = claims.role === 'admin' || claims.admin === true;

    if (!hasAdminRole) {
      return {
        ok: false,
        status: 403,
        message: 'Bu hesap yönetici yetkisine sahip değil.',
      };
    }

    return {
      ok: true,
      user: {
        id: identity.uid,
        email: identity.email,
        name:
          identity.displayName || identity.email.split('@')[0].toUpperCase(),
        role: 'admin',
      },
    };
  } catch {
    return {
      ok: false,
      status: 403,
      message: 'Yönetici yetkisi doğrulanamadı.',
    };
  }
}
