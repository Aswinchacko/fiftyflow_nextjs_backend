import { NextResponse } from 'next/server';
import * as userService from '@/services/userService.js';
import { getUserIdFromRequest } from '@/middleware/auth.js';
import { validateBody } from '@/middleware/validate.js';
import { patchMeSchema } from '@/validators/auth.js';
import { errors } from '@/lib/messages.js';
import { handleError } from '@/middleware/errorHandler.js';

export async function GET(request) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  try {
    const user = await userService.findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: errors.USER_NOT_FOUND, code: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}

export async function PATCH(request) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { validated, error: valErr } = validateBody(patchMeSchema, body);
  if (valErr) return NextResponse.json(valErr.body, { status: valErr.status });

  try {
    const { name } = validated || {};
    const user = name ? await userService.updateUser(userId, { name }) : await userService.findUserById(userId);
    if (!user) return NextResponse.json({ error: errors.USER_NOT_FOUND, code: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}
