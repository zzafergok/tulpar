import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/auth/firebase-identity', () => ({
  signInWithFirebasePassword: vi.fn(async () => null),
}));
vi.mock('@/lib/firebase/admin', () => ({
  isFirebaseConfigured: vi.fn(() => false),
  getAdminAuth: vi.fn(),
}));

import { authenticateAdmin } from '@/lib/auth/admin-auth';
import { demoLoginCredentials } from '@/lib/auth/demo-credentials';

describe('authenticateAdmin', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  it('rejects arbitrary credentials even when demo auth is enabled', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('ALLOW_DEMO_AUTH', 'true');

    const result = await authenticateAdmin(
      'attacker@evil.com',
      'anyPassword123',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(401);
    }
  });

  it('accepts configured demo admin credentials in non-production when ALLOW_DEMO_AUTH=true', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('ALLOW_DEMO_AUTH', 'true');

    const result = await authenticateAdmin(
      demoLoginCredentials.admin.email,
      demoLoginCredentials.admin.password,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.role).toBe('admin');
    }
  });

  it('rejects demo admin credentials in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ALLOW_DEMO_AUTH', 'true');

    const result = await authenticateAdmin(
      demoLoginCredentials.admin.email,
      demoLoginCredentials.admin.password,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(401);
    }
  });
});
