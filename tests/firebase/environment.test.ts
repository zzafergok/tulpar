import { describe, expect, it } from 'vitest';
import {
  FirebaseConfigurationError,
  getFirebaseWebConfiguration,
  getMissingFirebaseEnvironmentKeys,
} from '@/lib/firebase/environment';

describe('firebase environment helpers', () => {
  it('lists all missing required firebase keys', () => {
    const missing = getMissingFirebaseEnvironmentKeys({
      NEXT_PUBLIC_FIREBASE_API_KEY: 'key',
    });

    expect(missing).toContain('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    expect(missing).toContain('NEXT_PUBLIC_FIREBASE_APP_ID');
    expect(missing).not.toContain('NEXT_PUBLIC_FIREBASE_API_KEY');
  });

  it('throws FirebaseConfigurationError when required keys are missing', () => {
    expect(() => getFirebaseWebConfiguration({})).toThrow(
      FirebaseConfigurationError,
    );
  });

  it('returns normalized web configuration when all required keys exist', () => {
    const config = getFirebaseWebConfiguration({
      NEXT_PUBLIC_FIREBASE_API_KEY: ' api-key ',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'app.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'tulpar-proj',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'tulpar-proj.appspot.com',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123456',
      NEXT_PUBLIC_FIREBASE_APP_ID: '1:123:web:abc',
    });

    expect(config.apiKey).toBe('api-key');
    expect(config.projectId).toBe('tulpar-proj');
    expect(config.measurementId).toBeUndefined();
  });
});
