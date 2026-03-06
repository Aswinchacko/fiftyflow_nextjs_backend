import { NextResponse } from 'next/server';
import * as authService from '@/services/authService.js';
import { validateBody } from '@/middleware/validate.js';
import { refreshSchema } from '@/validators/auth.js';
import { errors } from '@/lib/messages.js';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { validated, error: valErr } = validateBody(refreshSchema, body);
  if (valErr) return NextResponse.json(valErr.body, { status: valErr.status });

  try {
    const { refreshToken } = validated;
    const revoked = await authService.isRefreshTokenRevoked(refreshToken);
    if (revoked) {
      return NextResponse.json({ error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' }, { status: 401 });
    }
    const payload = authService.verifyRefreshToken(refreshToken);
    const accessToken = authService.generateAccessToken(payload.sub);
    return NextResponse.json({ accessToken });
  } catch (err) {
    return NextResponse.json({ error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' }, { status: 401 });
  }
}
