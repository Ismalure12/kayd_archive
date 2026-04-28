import { ok, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listTags } = require('@/lib/services/tags.service');

export async function GET() {
  try {
    const tags = await listTags();
    return ok(tags);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
