import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getStats } = require('@/lib/services/dashboard.service');

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);
    const stats = await getStats();
    return ok(stats);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
