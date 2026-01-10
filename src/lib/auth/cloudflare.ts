import jwt from 'jsonwebtoken';
import { createPublicKey } from 'crypto';

const CF_ACCESS_AUD = process.env.CF_ACCESS_AUD;
const CF_TEAM_DOMAIN = process.env.CF_TEAM_DOMAIN;

export interface CloudflareAccessPayload {
  aud: string[];
  email: string;
  type: string;
  iat: number;
  exp: number;
}

export async function verifyCFAccessToken(token: string): Promise<CloudflareAccessPayload | null> {
  if (!CF_ACCESS_AUD || !CF_TEAM_DOMAIN) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cloudflare Access must be configured in production');
    }
    console.warn('Cloudflare Access not configured (development mode)');
    return null;
  }

  try {
    const certsUrl = `https://${CF_TEAM_DOMAIN}/cdn-cgi/access/certs`;
    const certsRes = await fetch(certsUrl);
    const certsData = await certsRes.json();
    
    const publicKey = createPublicKey(certsData.public_cert);
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: CF_ACCESS_AUD,
    }) as CloudflareAccessPayload;
    
    return decoded;
  } catch (error) {
    console.error('CF Access token verification failed:', error);
    return null;
  }
}
