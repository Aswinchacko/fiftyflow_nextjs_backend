import { getValidationMessage, errors } from '../lib/messages.js';

export function validateBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const first = result.error.errors[0];
    const msg = getValidationMessage(first) || first?.message || errors.VALIDATION_FAILED;
    return { validated: null, error: { status: 400, body: { error: msg, code: 'VALIDATION_ERROR' } } };
  }
  return { validated: result.data, error: null };
}
