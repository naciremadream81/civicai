import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

/**
 * Generate or extract request ID for request tracing
 */
export function getRequestId(req: NextRequest): string {
  return req.headers.get('x-request-id') || randomUUID();
}

/**
 * Add request ID to response headers
 */
export function addRequestId(req: NextRequest, res: NextResponse): NextResponse {
  const requestId = getRequestId(req);
  res.headers.set('x-request-id', requestId);
  return res;
}
