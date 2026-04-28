import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/api-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { login } = require('@/lib/services/auth.service');

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return err('Email and password are required', 400);
    const result = await login(email, password);
    return ok(result);
  } catch (error: any) {
    return err(error.message, error.status || 500);
  }
}
