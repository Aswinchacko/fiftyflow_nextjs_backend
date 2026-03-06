import { NextResponse } from 'next/server';

const ALLOWED = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim());

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function addCorsHeaders(response, request) {
  const origin = request.headers.get('origin') ?? '';
  if (ALLOWED.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

/** Wraps a route handler to add CORS headers to the response */
export function withCors(handler) {
  return async (request, context) => {
    const response = await handler(request, context);
    return addCorsHeaders(response, request);
  };
}
