import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema } from 'zod';
import { handleApiError } from '@/lib/utils/errors';

/**
 * Validate request body against a Zod schema
 */
export function validateBody<T extends ZodSchema>(
  schema: T
): (req: NextRequest) => Promise<{ data: z.infer<T>; error?: NextResponse }> {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      const data = schema.parse(body);
      return { data };
    } catch (error) {
      return {
        data: {} as z.infer<T>,
        error: handleApiError(error),
      };
    }
  };
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T extends ZodSchema>(
  schema: T
): (req: NextRequest) => { data: z.infer<T>; error?: NextResponse } {
  return (req: NextRequest) => {
    try {
      const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
      const data = schema.parse(searchParams);
      return { data };
    } catch (error) {
      return {
        data: {} as z.infer<T>,
        error: handleApiError(error),
      };
    }
  };
}

/**
 * Validate route parameters (for dynamic routes)
 */
export function validateParams<T extends ZodSchema>(
  schema: T,
  params: Record<string, string>
): { data: z.infer<T>; error?: NextResponse } {
  try {
    const data = schema.parse(params);
    return { data };
  } catch (error) {
    return {
      data: {} as z.infer<T>,
      error: handleApiError(error),
    };
  }
}
