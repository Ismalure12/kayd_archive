import { NextResponse } from 'next/server';

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function paginated(data: unknown, total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export function err(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}
