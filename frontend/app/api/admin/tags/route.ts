import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listTags, createTag } = require('@/lib/services/tags.service');

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);
    const tags = await listTags();
    return ok(tags);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request);
    const data = await request.json();
    if (!data.name) return err('Name is required', 400);
    const tag = await createTag(data);
    return ok(tag, 201);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
