'use client';

import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';

let cachedApp: FirebaseApp | null = null;

export function isFirebaseClientConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  );
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
  return getAuth(getFirebaseClientApp());
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
