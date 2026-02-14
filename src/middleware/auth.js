import { verifyAccessToken } from '../services/authService.js';
import { errors } from '../lib/messages.js';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' });
  }
  const token = auth.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' });
  }
}
