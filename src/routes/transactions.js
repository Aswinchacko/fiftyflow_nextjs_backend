import { Router } from 'express';
import * as transactionService from '../services/transactionService.js';
import { errors } from '../lib/messages.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTransactionSchema, updateTransactionSchema } from '../validators/transaction.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const search = req.query.search;
    const transactions = await transactionService.getTransactions(req.userId, { search });
    res.json({ transactions });
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createTransactionSchema), async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.userId, req.validated);
    res.status(201).json({ transaction });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validate(updateTransactionSchema), async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.userId,
      req.validated
    );
    res.json({ transaction });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await transactionService.deleteTransaction(req.params.id, req.userId);
    if (!deleted) {
      return res.status(404).json({ error: errors.NOT_FOUND, code: 'NOT_FOUND' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
