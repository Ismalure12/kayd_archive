import { NextRequest } from 'next/server';
import { ok, paginated, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listMurtiAdmin, createMurti } = require('@/lib/services/murti.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getPagination } = require('@/lib/pagination');

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    const { page, limit, skip } = getPagination(query);
    const { murti, total } = await listMurtiAdmin({
      page, limit, skip,
      search: query.search,
      status: query.status,
    });
    return paginated(murti, total, page, limit);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request);
    const data = await request.json();
    if (!data.title || !data.context) {
      return err('Title and context are required', 400);
    }
    const murti = await createMurti(data);
    return ok(murti, 201);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
