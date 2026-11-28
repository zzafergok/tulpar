import 'server-only';

export interface FirebaseIdentityResult {
  uid: string;
  email: string;
  displayName?: string;
}

function getIdentityBaseUrl(): string | null {
  const emulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST?.trim();
  if (emulatorHost) {
    return `http://${emulatorHost}/identitytoolkit.googleapis.com/v1`;
  }
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return 'https://identitytoolkit.googleapis.com/v1';
  }
  return null;
}

function getApiKeyParam(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-emulator-key';
}

export async function signInWithFirebasePassword(
  email: string,
  password: string,
): Promise<FirebaseIdentityResult | null> {
  const baseUrl = getIdentityBaseUrl();
  if (!baseUrl) {
    if (process.env.ALLOW_DEMO_AUTH === 'false') {
      throw new Error('Firebase kimlik doğrulama yapılandırılmamış.');
    }
    return {
      uid: `demo_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      email,
      displayName: email.split('@')[0],
    };
  }

  const res = await fetch(
    `${baseUrl}/accounts:signInWithPassword?key=${getApiKeyParam()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );

  if (!res.ok) {
    return null;
  }

  const data: unknown = await res.json();
  if (
    typeof data === 'object' &&
    data !== null &&
    'localId' in data &&
    'email' in data
  ) {
    const record = data as {
      localId: string;
      email: string;
      displayName?: string;
    };
    return {
      uid: record.localId,
      email: record.email,
      displayName: record.displayName,
    };
  }
  return null;
}

export async function signUpWithFirebasePassword(
  email: string,
  password: string,
  displayName?: string,
): Promise<FirebaseIdentityResult | null> {
  const baseUrl = getIdentityBaseUrl();
  if (!baseUrl) {
    if (process.env.ALLOW_DEMO_AUTH === 'false') {
      throw new Error('Firebase kimlik doğrulama yapılandırılmamış.');
    }
    return {
      uid: `demo_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      email,
      displayName: displayName || email.split('@')[0],
    };
  }

  const res = await fetch(
    `${baseUrl}/accounts:signUp?key=${getApiKeyParam()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        displayName,
        returnSecureToken: true,
      }),
    },
  );

  if (!res.ok) {
    return null;
  }

  const data: unknown = await res.json();
  if (
    typeof data === 'object' &&
    data !== null &&
    'localId' in data &&
    'email' in data
  ) {
    const record = data as {
      localId: string;
      email: string;
      displayName?: string;
    };
    return {
      uid: record.localId,
      email: record.email,
      displayName: record.displayName ?? displayName,
    };
  }
  return null;
}
