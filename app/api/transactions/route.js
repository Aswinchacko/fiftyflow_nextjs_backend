import { NextResponse } from 'next/server';
import * as transactionService from '@/services/transactionService.js';
import { getUserIdFromRequest } from '@/middleware/auth.js';
import { validateBody } from '@/middleware/validate.js';
import { createTransactionSchema } from '@/validators/transaction.js';
import { handleError } from '@/middleware/errorHandler.js';
import { errors } from '@/lib/messages.js';
import { withCors } from '@/lib/cors.js';

async function handleGet(request) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  try {
    const search = request.nextUrl.searchParams.get('search');
    const transactions = await transactionService.getTransactions(userId, { search });
    return NextResponse.json({ transactions });
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}

async function handlePost(request) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: errors.VALIDATION_FAILED, code: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const { validated, error: valErr } = validateBody(createTransactionSchema, body);
  if (valErr) return NextResponse.json(valErr.body, { status: valErr.status });

  try {
    const transaction = await transactionService.createTransaction(userId, validated);
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}

export const GET = withCors(handleGet);
export const POST = withCors(handlePost);
