import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getMurtiById, updateMurti, deleteMurti } = require('@/lib/services/murti.service');

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    const murti = await getMurtiById(id);
    return ok(murti);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    const data = await request.json();
    const murti = await updateMurti(id, data);
    return ok(murti);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    await deleteMurti(id);
    return ok({ deleted: true });
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
