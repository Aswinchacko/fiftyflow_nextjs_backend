import { verifyAccessToken } from '../services/authService.js';
import { errors } from '../lib/messages.js';

export function getUserIdFromRequest(request) {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return { userId: null, error: { status: 401, body: { error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' } } };
  }
  const token = auth.slice(7);
  try {
    const payload = verifyAccessToken(token);
    return { userId: payload.sub, error: null };
  } catch (err) {
    return { userId: null, error: { status: 401, body: { error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' } } };
  }
}
