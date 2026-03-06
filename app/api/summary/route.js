import { NextResponse } from 'next/server';
import * as summaryService from '@/services/summaryService.js';
import { getUserIdFromRequest } from '@/middleware/auth.js';
import { handleError } from '@/middleware/errorHandler.js';
import { withCors } from '@/lib/cors.js';

async function handleGet(request) {
  const { userId, error: authErr } = getUserIdFromRequest(request);
  if (authErr) return NextResponse.json(authErr.body, { status: authErr.status });

  try {
    const result = await summaryService.getSummary(userId);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body: errBody } = handleError(err);
    return NextResponse.json(errBody, { status });
  }
}

export const GET = withCors(handleGet);
