import { NextRequest } from 'next/server';
import { ok, paginated, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listAuthors, createAuthor } = require('@/lib/services/authors.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getPagination } = require('@/lib/pagination');

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    const { page, limit, skip } = getPagination(query);
    const { authors, total } = await listAuthors({ page, limit, skip, search: query.search });
    return paginated(authors, total, page, limit);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request);
    const data = await request.json();
    if (!data.name) return err('Name is required', 400);
    const author = await createAuthor(data);
    return ok(author, 201);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
