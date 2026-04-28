import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getStoryBySlug } = require('@/lib/services/stories.service');

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const story = await getStoryBySlug(slug);
    return ok(story);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
