import { NextResponse } from 'next/server';
import * as transactionService from '@/services/transactionService.js';
import { errors } from '@/lib/messages.js';
import { getUserIdFromRequest } from '@/middleware/auth.js';
import { validateBody } from '@/middleware/validate.js';
import { updateTransactionSchema } from '@/validators/transaction.js';
import { handleError } from '@/middleware/errorHandler.js';

export async function PUT(request, context) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  const params = typeof context.params?.then === 'function' ? await context.params : context.params;
  const id = params?.id;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: errors.VALIDATION_FAILED, code: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const { validated, error: valErr } = validateBody(updateTransactionSchema, body);
  if (valErr) return NextResponse.json(valErr.body, { status: valErr.status });

  try {
    const transaction = await transactionService.updateTransaction(id, userId, validated);
    return NextResponse.json({ transaction });
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}

export async function DELETE(request, context) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  const params = typeof context.params?.then === 'function' ? await context.params : context.params;
  const id = params?.id;

  try {
    const deleted = await transactionService.deleteTransaction(id, userId);
    if (!deleted) {
      return NextResponse.json({ error: errors.NOT_FOUND, code: 'NOT_FOUND' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}
