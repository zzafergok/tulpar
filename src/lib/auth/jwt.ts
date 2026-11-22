import { createHmac, timingSafeEqual } from 'node:crypto';

export interface JWTPayload {
  sub: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

interface JWTHeader {
  alg: string;
  typ?: string;
}

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const DEV_FALLBACK_SECRET = 'tulpar-dev-only-jwt-secret-do-not-use-in-prod';

function getJwtSecret(): string | null {
  const configured = process.env.JWT_SECRET?.trim();
  if (configured && configured.length > 0) {
    return configured;
  }
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  return DEV_FALLBACK_SECRET;
}

function requireJwtSecret(): string {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable must be configured in production.',
    );
  }
  return secret;
}

function encodeBase64Url(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function decodeBase64Url(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function computeHmacSignature(signingInput: string, secret: string): Buffer {
  return createHmac('sha256', secret).update(signingInput, 'utf8').digest();
}

function isValidHeader(header: unknown): header is JWTHeader {
  if (typeof header !== 'object' || header === null) {
    return false;
  }
  const candidate = header as Partial<JWTHeader>;
  return (
    candidate.alg === 'HS256' &&
    (candidate.typ === undefined || candidate.typ === 'JWT')
  );
}

function isValidPayload(
  payload: unknown,
  nowSeconds: number,
): payload is JWTPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }
  const candidate = payload as Partial<JWTPayload>;
  return (
    typeof candidate.sub === 'string' &&
    candidate.sub.trim().length > 0 &&
    typeof candidate.email === 'string' &&
    candidate.email.trim().length > 0 &&
    (candidate.role === 'user' || candidate.role === 'admin') &&
    typeof candidate.exp === 'number' &&
    Number.isFinite(candidate.exp) &&
    candidate.exp > nowSeconds
  );
}

/**
 * Signs a JWT using standard HMAC-SHA256 (HS256).
 * Fails closed in production if JWT_SECRET is not configured.
 */
export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = requireJwtSecret();
  const header: JWTHeader = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(fullPayload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = computeHmacSignature(signingInput, secret).toString(
    'base64url',
  );

  return `${signingInput}.${signature}`;
}

/**
 * Verifies an HS256 JWT using constant-time signature comparison,
 * strict header algorithm checks, and claim validation.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = getJwtSecret();
    if (!secret) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      return null;
    }

    const header: unknown = JSON.parse(decodeBase64Url(encodedHeader));
    if (!isValidHeader(header)) {
      return null;
    }

    const expectedSignature = computeHmacSignature(
      `${encodedHeader}.${encodedPayload}`,
      secret,
    );
    const providedSignature = Buffer.from(encodedSignature, 'base64url');

    if (
      providedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(providedSignature, expectedSignature)
    ) {
      return null;
    }

    const payload: unknown = JSON.parse(decodeBase64Url(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (!isValidPayload(payload, now)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const parsed: unknown = JSON.parse(decodeBase64Url(parts[1]));
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(
  token: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  if (typeof payload.sub !== 'string' || payload.sub.trim().length === 0) {
    return true;
  }
  if (typeof payload.exp !== 'number' || Number.isNaN(payload.exp)) {
    return true;
  }
  return payload.exp <= nowSeconds;
}

export function getTokenRemainingMs(
  token: string,
  nowMs = Date.now(),
): number | null {
  const payload = decodeToken(token);
  if (
    !payload ||
    typeof payload.exp !== 'number' ||
    Number.isNaN(payload.exp)
  ) {
    return null;
  }
  return Math.max(0, payload.exp * 1000 - nowMs);
}
