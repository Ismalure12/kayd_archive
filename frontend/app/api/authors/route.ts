import { NextRequest } from 'next/server';
import { paginated, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listAuthors } = require('@/lib/services/authors.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getPagination } = require('@/lib/pagination');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    const { page, limit, skip } = getPagination(query);
    const { authors, total } = await listAuthors({ page, limit, skip, search: query.search });
    return paginated(authors, total, page, limit);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
