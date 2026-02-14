import { getValidationMessage, errors } from '../lib/messages.js';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const first = result.error.errors[0];
        const msg = getValidationMessage(first) || first?.message || errors.VALIDATION_FAILED;
        return res.status(400).json({ error: msg, code: 'VALIDATION_ERROR' });
      }
      req.validated = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
}
