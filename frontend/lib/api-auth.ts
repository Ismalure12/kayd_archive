import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AppError = require('./AppError');

export async function verifyAuth(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }
  const token = header.slice(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}
