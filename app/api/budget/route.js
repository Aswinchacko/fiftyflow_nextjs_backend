import { NextResponse } from 'next/server';
import * as budgetService from '@/services/budgetService.js';
import { getUserIdFromRequest } from '@/middleware/auth.js';
import { validateBody } from '@/middleware/validate.js';
import { updateBudgetSchema } from '@/validators/budget.js';
import { handleError } from '@/middleware/errorHandler.js';
import { errors } from '@/lib/messages.js';
import { withCors } from '@/lib/cors.js';

async function handleGet(request) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  try {
    const result = await budgetService.getBudget(userId);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}

async function handlePut(request) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: errors.VALIDATION_FAILED, code: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const { validated, error: valErr } = validateBody(updateBudgetSchema, body);
  if (valErr) return NextResponse.json(valErr.body, { status: valErr.status });

  try {
    const result = await budgetService.updateBudget(userId, validated);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}

export const GET = withCors(handleGet);
export const PUT = withCors(handlePut);
