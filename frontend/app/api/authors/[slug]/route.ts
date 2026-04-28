import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getAuthorBySlug } = require('@/lib/services/authors.service');

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);
    return ok(author);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
