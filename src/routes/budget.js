import { Router } from 'express';
import * as budgetService from '../services/budgetService.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateBudgetSchema } from '../validators/budget.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const result = await budgetService.getBudget(req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/', validate(updateBudgetSchema), async (req, res, next) => {
  try {
    const result = await budgetService.updateBudget(req.userId, req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
