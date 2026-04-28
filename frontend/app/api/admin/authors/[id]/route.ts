import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getAuthorById, updateAuthor, deleteAuthor } = require('@/lib/services/authors.service');

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    const author = await getAuthorById(id);
    return ok(author);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    const data = await request.json();
    const author = await updateAuthor(id, data);
    return ok(author);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    await deleteAuthor(id);
    return ok({ deleted: true });
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
