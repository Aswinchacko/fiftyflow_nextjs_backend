import { config } from '../config/index.js';
import { errors } from '../lib/messages.js';

export function handleError(err) {
  if (err.code === 'P2002') {
    return { status: 409, body: { error: errors.EMAIL_EXISTS, code: 'EMAIL_EXISTS' } };
  }
  if (err.code === 'P2025') {
    return { status: 404, body: { error: errors.NOT_FOUND, code: 'NOT_FOUND' } };
  }

  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? errors.INTERNAL_ERROR : (err.message || errors.VALIDATION_FAILED);
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : undefined);

  if (config.NODE_ENV === 'development' && status === 500) {
    console.error(err);
  }

  return { status, body: { error: message, ...(code && { code }) } };
}
