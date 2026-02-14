import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, refreshSchema, patchMeSchema } from '../validators/auth.js';
import { errors } from '../lib/messages.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: errors.RATE_LIMITED, code: 'RATE_LIMITED' },
});

router.use('/register', authLimiter);
router.use('/login', authLimiter);

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.validated;
    const existing = await userService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: errors.EMAIL_EXISTS, code: 'EMAIL_EXISTS' });
    }
    const passwordHash = await authService.hashPassword(password);
    const user = await userService.createUser({ name, email, passwordHash });
    const accessToken = authService.generateAccessToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);
    await authService.storeRefreshToken(user.id, refreshToken);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validated;
    const user = await userService.findUserByEmail(email);
    if (!user || !(await authService.verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: errors.INVALID_CREDENTIALS, code: 'INVALID_CREDENTIALS' });
    }
    const accessToken = authService.generateAccessToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);
    await authService.storeRefreshToken(user.id, refreshToken);
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', validate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;
    const revoked = await authService.isRefreshTokenRevoked(refreshToken);
    if (revoked) {
      return res.status(401).json({ error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' });
    }
    const payload = authService.verifyRefreshToken(refreshToken);
    const accessToken = authService.generateAccessToken(payload.sub);
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: errors.INVALID_TOKEN, code: 'UNAUTHORIZED' });
  }
});

router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    // Logout typically revokes refresh token - we accept Bearer for convenience
    // Frontend should send refreshToken in body for full logout
    const refreshToken = req.body?.refreshToken;
    if (refreshToken) {
      await authService.revokeRefreshToken(refreshToken);
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: errors.USER_NOT_FOUND, code: 'NOT_FOUND' });
    }
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
});

router.patch('/me', requireAuth, validate(patchMeSchema), async (req, res, next) => {
  try {
    const { name } = req.validated || {};
    const user = name ? await userService.updateUser(req.userId, { name }) : await userService.findUserById(req.userId);
    if (!user) return res.status(404).json({ error: errors.USER_NOT_FOUND, code: 'NOT_FOUND' });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
});

export default router;
