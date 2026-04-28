import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getStoryById, updateStory, deleteStory } = require('@/lib/services/stories.service');

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    const story = await getStoryById(id);
    return ok(story);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    const data = await request.json();
    const story = await updateStory(id, data);
    return ok(story);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  try {
    await verifyAuth(request);
    const { id } = await params;
    await deleteStory(id);
    return ok({ deleted: true });
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
