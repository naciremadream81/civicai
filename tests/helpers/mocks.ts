import { NextRequest } from 'next/server';

/**
 * Create a mock NextRequest for testing
 */
export function createMockRequest(
  url: string,
  options?: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
  }
): NextRequest {
  const {
    method = 'GET',
    body,
    headers = {},
    cookies = {},
  } = options || {};

  const request = new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body && {
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  });

  // Add cookies
  Object.entries(cookies).forEach(([name, value]) => {
    request.cookies.set(name, value);
  });

  return request;
}

/**
 * Extract JSON response from NextResponse
 */
export async function getJsonResponse<T>(response: Response): Promise<T> {
  return response.json();
}

/**
 * Wait for async operation to complete
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
