import { NextRequest } from 'next/server';
import { ok, paginated, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listStoriesAdmin, createStory } = require('@/lib/services/stories.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getPagination } = require('@/lib/pagination');

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    const { page, limit, skip } = getPagination(query);
    const { stories, total } = await listStoriesAdmin({
      page, limit, skip,
      search: query.search,
      authorId: query.authorId,
      isPublished: query.isPublished,
      status: query.status,
    });
    return paginated(stories, total, page, limit);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request);
    const data = await request.json();
    if (!data.title || !data.authorId || !data.content) {
      return err('Title, author, and content are required', 400);
    }
    const story = await createStory(data);
    return ok(story, 201);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
