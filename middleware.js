import { NextResponse } from 'next/server';

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim());
const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = corsOrigins.includes(origin);

  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, {
      headers: {
        ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
        ...corsHeaders,
      },
    });
  }

  const response = NextResponse.next();
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export const config = {
  matcher: ['/', '/health', '/api/:path*'],
};
