import { config } from '../config/index.js';
import { errors } from '../lib/messages.js';

export function errorHandler(err, _req, res, _next) {
  if (err.code === 'P2002') {
    return res.status(409).json({ error: errors.EMAIL_EXISTS, code: 'EMAIL_EXISTS' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: errors.NOT_FOUND, code: 'NOT_FOUND' });
  }

  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? errors.INTERNAL_ERROR : (err.message || errors.VALIDATION_FAILED);
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : undefined);

  if (config.NODE_ENV === 'development' && status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: message, ...(code && { code }) });
}
