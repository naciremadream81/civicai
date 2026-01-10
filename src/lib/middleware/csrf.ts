import { NextRequest } from 'next/server';
import { randomBytes, createHmac } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET;

if (!CSRF_SECRET) {
  throw new Error('CSRF_SECRET or JWT_SECRET must be set for CSRF protection');
}

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex');
  const hmac = createHmac('sha256', CSRF_SECRET);
  hmac.update(`${sessionId}:${token}`);
  return `${token}:${hmac.digest('hex')}`;
}

/**
 * Validate a CSRF token
 */
export function validateCsrfToken(token: string, sessionId: string): boolean {
  const [tokenValue, providedHmac] = token.split(':');
  if (!tokenValue || !providedHmac) {
    return false;
  }

  const hmac = createHmac('sha256', CSRF_SECRET);
  hmac.update(`${sessionId}:${tokenValue}`);
  const expectedHmac = hmac.digest('hex');

  // Constant-time comparison to prevent timing attacks
  if (providedHmac.length !== expectedHmac.length) {
    return false;
  }

  let match = 0;
  for (let i = 0; i < providedHmac.length; i++) {
    match |= providedHmac.charCodeAt(i) ^ expectedHmac.charCodeAt(i);
  }

  return match === 0;
}

/**
 * Extract CSRF token from request headers
 */
export function getCsrfToken(req: NextRequest): string | null {
  return req.headers.get('x-csrf-token') || null;
}

/**
 * Middleware to verify CSRF token for state-changing operations
 */
export async function verifyCsrfToken(req: NextRequest, sessionId: string): Promise<{
  valid: boolean;
  error?: { message: string; code: string };
}> {
  // Skip CSRF check for GET, HEAD, OPTIONS
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const token = getCsrfToken(req);
  if (!token) {
    return {
      valid: false,
      error: { message: 'CSRF token missing', code: 'CSRF_TOKEN_MISSING' },
    };
  }

  if (!validateCsrfToken(token, sessionId)) {
    return {
      valid: false,
      error: { message: 'Invalid CSRF token', code: 'CSRF_TOKEN_INVALID' },
    };
  }

  return { valid: true };
}
