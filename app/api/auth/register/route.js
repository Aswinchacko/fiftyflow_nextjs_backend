import { NextResponse } from 'next/server';
import * as authService from '@/services/authService.js';
import * as userService from '@/services/userService.js';
import { validateBody } from '@/middleware/validate.js';
import { registerSchema } from '@/validators/auth.js';
import { errors } from '@/lib/messages.js';
import { handleError } from '@/middleware/errorHandler.js';
import { checkRateLimit } from '@/lib/rateLimit.js';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const { limited } = checkRateLimit(`auth:${ip}`);
  if (limited) {
    return NextResponse.json({ error: errors.RATE_LIMITED, code: 'RATE_LIMITED' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: errors.VALIDATION_FAILED, code: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const { validated, error: valErr } = validateBody(registerSchema, body);
  if (valErr) return NextResponse.json(valErr.body, { status: valErr.status });

  try {
    const { name, email, password } = validated;
    const existing = await userService.findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: errors.EMAIL_EXISTS, code: 'EMAIL_EXISTS' }, { status: 409 });
    }
    const passwordHash = await authService.hashPassword(password);
    const user = await userService.createUser({ name, email, passwordHash });
    const accessToken = authService.generateAccessToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);
    await authService.storeRefreshToken(user.id, refreshToken);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    }, { status: 201 });
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}
