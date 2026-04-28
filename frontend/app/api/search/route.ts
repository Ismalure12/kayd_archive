import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { search } = require('@/lib/services/search.service');

export async function GET(request: NextRequest) {
  try {
    const q = new URL(request.url).searchParams.get('q') || '';
    const results = await search(q);
    return ok(results);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
