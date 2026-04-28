import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getCollectionBySlug } = require('@/lib/services/collections.service');

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);
    return ok(collection);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
