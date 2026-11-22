if (typeof window !== 'undefined') {
  throw new Error('firebase/admin can only be used on the server.');
}

import {
  cert,
  getApps,
  initializeApp,
  type App,
  type Credential,
} from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

let cachedApp: App | null = null;

function getFirebaseProjectId(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    undefined
  );
}

function decodeBase64IfNeeded(value: string, plainPrefix: string): string {
  if (value.includes(plainPrefix)) {
    return value;
  }
  return Buffer.from(value, 'base64').toString('utf8');
}

function getFirebaseCredential(projectId?: string): Credential | undefined {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (serviceAccountRaw) {
    try {
      const jsonString = decodeBase64IfNeeded(serviceAccountRaw, '{');
      const parsed: unknown = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        return cert(parsed as Record<string, string>);
      }
    } catch (error) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    }
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY?.trim();

  if (clientEmail && privateKeyRaw) {
    const privateKey = decodeBase64IfNeeded(
      privateKeyRaw,
      '-----BEGIN',
    ).replace(/\\n/g, '\n');
    return cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  return undefined;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(getFirebaseProjectId());
}

export function getFirebaseAdminApp(): App {
  if (cachedApp) return cachedApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  const projectId = getFirebaseProjectId();
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    (projectId ? `${projectId}.appspot.com` : undefined);
  const credential = getFirebaseCredential(projectId);

  cachedApp = initializeApp(
    credential
      ? {
          credential,
          projectId,
          storageBucket,
        }
      : {
          projectId,
          storageBucket,
        },
  );
  return cachedApp;
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminStorage(): Storage {
  return getStorage(getFirebaseAdminApp());
}
