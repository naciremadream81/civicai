import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export async function requireAuth(req: NextRequest): Promise<{
  authenticated: boolean;
  user?: { userId: string; email: string; role: string };
  response?: NextResponse;
}> {
  const authToken = req.cookies.get('auth-token');
  
  if (!authToken) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const payload = verifyToken(authToken.value);
  if (!payload) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Invalid token' }, { status: 401 }),
    };
  }

  return {
    authenticated: true,
    user: {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    },
  };
}
