'use client';

import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';
import {
  connectStorageEmulator,
  getStorage,
  type FirebaseStorage,
} from 'firebase/storage';
import {
  getFirebaseClientEnvironment,
  getMissingFirebaseEnvironmentKeys,
  isFirebaseEmulatorEnabled,
} from './environment';

let cachedApp: FirebaseApp | null = null;
let authEmulatorConnected = false;
let firestoreEmulatorConnected = false;
let storageEmulatorConnected = false;

export function isFirebaseClientConfigured(): boolean {
  const missing = getMissingFirebaseEnvironmentKeys(
    getFirebaseClientEnvironment(),
  );
  return missing.length === 0;
}

export function getFirebaseClientApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }

  cachedApp = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });

  return cachedApp;
}

export function getFirebaseClientAuth(): Auth {
  const auth = getAuth(getFirebaseClientApp());
  if (isFirebaseEmulatorEnabled() && !authEmulatorConnected) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
      disableWarnings: true,
    });
    authEmulatorConnected = true;
  }
  return auth;
}

export function getFirebaseClientFirestore(): Firestore {
  const firestore = getFirestore(getFirebaseClientApp());
  if (isFirebaseEmulatorEnabled() && !firestoreEmulatorConnected) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    firestoreEmulatorConnected = true;
  }
  return firestore;
}

export function getFirebaseClientStorage(): FirebaseStorage {
  const storage = getStorage(getFirebaseClientApp());
  if (isFirebaseEmulatorEnabled() && !storageEmulatorConnected) {
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    storageEmulatorConnected = true;
  }
  return storage;
}

export async function signInWithGooglePopup(): Promise<string> {
  const auth = getFirebaseClientAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  return credential.user.getIdToken();
}

export async function signOutFirebaseClient(): Promise<void> {
  if (!isFirebaseClientConfigured()) return;
  try {
    const auth = getFirebaseClientAuth();
    await signOut(auth);
  } catch {
    // Non-fatal: server httpOnly session cookie is cleared independently.
  }
}

export async function requestFirebasePasswordReset(
  email: string,
): Promise<void> {
  if (!isFirebaseClientConfigured()) {
    throw new Error('Firebase kimlik doğrulama yapılandırılmamış.');
  }
  const auth = getFirebaseClientAuth();
  await sendPasswordResetEmail(auth, email);
}
