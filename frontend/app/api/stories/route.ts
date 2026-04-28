import { NextRequest } from 'next/server';
import { paginated, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listStories } = require('@/lib/services/stories.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getPagination } = require('@/lib/pagination');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    const { page, limit, skip } = getPagination(query);
    const { stories, total } = await listStories({
      page, limit, skip,
      tag: query.tag,
      authorSlug: query.author,
      language: query.language,
    });
    return paginated(stories, total, page, limit);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
