import { Router } from 'express';
import * as summaryService from '../services/summaryService.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const result = await summaryService.getSummary(req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
