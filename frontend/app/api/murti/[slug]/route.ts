import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getMurtiBySlug } = require('@/lib/services/murti.service');

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const { slug } = await params;
    const murti = await getMurtiBySlug(slug);
    return ok(murti);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
