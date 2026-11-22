/**
 * Builds a per-request Content-Security-Policy header using a cryptographic nonce.
 * Supports Firebase Auth/Firestore/Storage and local emulator connections in dev/test.
 */
export function buildContentSecurityPolicy(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  const imgSources = [
    "img-src 'self' blob: data:",
    'https://images.unsplash.com',
    'https://lh3.googleusercontent.com',
    'https://storage.googleapis.com',
    ...(isProd ? [] : ['http://127.0.0.1:9199']),
  ];

  const connectSources = [
    "connect-src 'self'",
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com',
    'https://www.googleapis.com',
    'https://firestore.googleapis.com',
    ...(isProd
      ? []
      : [
          'http://127.0.0.1:9099',
          'http://127.0.0.1:8080',
          'http://127.0.0.1:9199',
        ]),
  ];

  const frameSources = [
    "frame-src 'self'",
    'https://accounts.google.com',
    'https://*.firebaseapp.com',
    ...(isProd ? [] : ['http://127.0.0.1:9099']),
  ];

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''} https://apis.google.com https://accounts.google.com`,
    "style-src 'self' 'unsafe-inline'",
    imgSources.join(' '),
    "font-src 'self' data:",
    connectSources.join(' '),
    frameSources.join(' '),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isProd ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
}
