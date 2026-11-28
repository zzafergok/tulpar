export const requiredFirebaseEnvironmentKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

export type RequiredFirebaseEnvironmentKey =
  (typeof requiredFirebaseEnvironmentKeys)[number];

type FirebaseEnvironment = Record<string, string | undefined>;

export interface FirebaseWebConfiguration {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export class FirebaseConfigurationError extends Error {
  constructor(public readonly missingKeys: RequiredFirebaseEnvironmentKey[]) {
    super(`Eksik Firebase yapılandırması: ${missingKeys.join(', ')}`);
    this.name = 'FirebaseConfigurationError';
  }
}

export function getFirebaseClientEnvironment(): FirebaseEnvironment {
  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function getMissingFirebaseEnvironmentKeys(
  environment: FirebaseEnvironment = getFirebaseClientEnvironment(),
): RequiredFirebaseEnvironmentKey[] {
  return requiredFirebaseEnvironmentKeys.filter((key) => {
    const value = environment[key]?.trim();
    return !value;
  });
}

export function getFirebaseWebConfiguration(
  environment: FirebaseEnvironment = getFirebaseClientEnvironment(),
): FirebaseWebConfiguration {
  const missingKeys = getMissingFirebaseEnvironmentKeys(environment);
  if (missingKeys.length > 0) {
    throw new FirebaseConfigurationError(missingKeys);
  }

  return {
    apiKey: environment.NEXT_PUBLIC_FIREBASE_API_KEY!.trim(),
    authDomain: environment.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!.trim(),
    projectId: environment.NEXT_PUBLIC_FIREBASE_PROJECT_ID!.trim(),
    storageBucket: environment.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!.trim(),
    messagingSenderId:
      environment.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!.trim(),
    appId: environment.NEXT_PUBLIC_FIREBASE_APP_ID!.trim(),
    measurementId:
      environment.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() || undefined,
  };
}

export function isFirebaseEmulatorEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === 'true';
}
