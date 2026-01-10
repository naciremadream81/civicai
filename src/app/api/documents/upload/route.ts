import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { FilesystemStorageAdapter } from '@/lib/storage/filesystem';
import { requireAuth } from '@/lib/middleware/auth';
import { checkRateLimit } from '@/lib/middleware/rate-limit';
import { randomUUID } from 'crypto';
import path from 'path';
import { z } from 'zod';

const storage = new FilesystemStorageAdapter(process.env.UPLOAD_DIR ?? './uploads');

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export async function POST(req: NextRequest) {
  // ✅ ENHANCEMENT: Rate limiting
  const rateLimitCheck = await checkRateLimit(req, 20); // 20 uploads per minute
  if (!rateLimitCheck.success) {
    return rateLimitCheck.response!;
  }

  // ✅ ENHANCEMENT: Authentication check
  const authCheck = await requireAuth(req);
  if (!authCheck.authenticated) {
    return authCheck.response!;
  }

  const user = authCheck.user!;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const permitId = formData.get('permitId') as string | null;
    const category = formData.get('category') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }
    
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Allowed types: PDF, images, Word, text files' },
        { status: 400 }
      );
    }
    
    const sanitizedName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!sanitizedName) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    
    if (permitId && !/^c[a-z0-9]{24}$/.test(permitId)) {
      return NextResponse.json({ error: 'Invalid permit ID format' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storageKey = `${randomUUID()}-${sanitizedName}`;

    await storage.save(buffer, storageKey);

    const document = await prisma.document.create({
      data: {
        fileName: sanitizedName,
        category: (category as any) || 'OTHER',
        storageKey,
        mimeType: file.type,
        sizeBytes: file.size,
        permitId: permitId || null,
        uploadedBy: user.userId,
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Upload error:', error);
    const message = process.env.NODE_ENV === 'production'
      ? 'Upload failed'
      : error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
