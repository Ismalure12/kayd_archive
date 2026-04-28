import { NextRequest } from 'next/server';
import { ok, paginated, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listCollections, createCollection } = require('@/lib/services/collections.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getPagination } = require('@/lib/pagination');

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    const { page, limit, skip } = getPagination(query);
    const { collections, total } = await listCollections({ page, limit, skip });
    return paginated(collections, total, page, limit);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request);
    const data = await request.json();
    if (!data.title) return err('Title is required', 400);
    const collection = await createCollection(data);
    return ok(collection, 201);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
