import { NextResponse } from 'next/server';
import * as authService from '@/services/authService.js';
import { getUserIdFromRequest } from '@/middleware/auth.js';
import { handleError } from '@/middleware/errorHandler.js';

export async function POST(request) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  try {
    let body = {};
    try {
      body = await request.json();
    } catch {}
    const refreshToken = body?.refreshToken;
    if (refreshToken) {
      await authService.revokeRefreshToken(refreshToken);
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}
