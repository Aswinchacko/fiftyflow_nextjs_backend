/**
 * User-friendly error and validation messages.
 * Keep tone clear, contextual, and actionable.
 */

export const errors = {
  // Auth
  RATE_LIMITED: 'Too many attempts. Please wait a minute and try again.',
  EMAIL_EXISTS: 'This email is already registered. Try logging in instead.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please check and try again.',
  INVALID_TOKEN: 'Your session has expired. Please log in again.',
  USER_NOT_FOUND: 'Account not found. Please log in again.',

  // General
  NOT_FOUND: "We couldn't find what you're looking for. It may have been moved or deleted.",
  VALIDATION_FAILED: "Please check your input and try again. We couldn't process some of the details.",
  INTERNAL_ERROR: "Something went wrong on our end. We're on it—please try again in a moment.",
};

const validationMap = {
  // Auth
  'name': { min: 'Name should be at least 2 characters.', max: 'Name can be up to 100 characters.' },
  'email': { invalid: 'Please enter a valid email address.' },
  'password': { min: 'Password should be at least 6 characters for security.' },
  'refreshToken': { min: 'Session expired. Please log in again.' },

  // Transaction
  'name': { min: 'Please enter a name or description for this transaction.', max: 'Transaction name can be up to 200 characters.' },
  'amount': { positive: 'Amount must be greater than zero.' },
  'category': { required: 'Please choose a category for this expense (Needs, Wants, or Savings).' },

  // Budget
  'monthlyBudget': { min: 'Monthly budget cannot be negative.' },
  'budgetRule': { sum: 'Needs, Wants, and Savings must add up to 100%.' },
};

export function getValidationMessage(err) {
  if (!err) return errors.VALIDATION_FAILED;
  const pathArr = err?.path;
  const path = Array.isArray(pathArr) ? pathArr[pathArr.length - 1] : pathArr;
  const pathStr = typeof path === 'string' ? path : String(path ?? '');
  const code = err?.code;
  const msg = String(err?.message || '').toLowerCase();

  if (pathStr in validationMap) {
    const map = validationMap[pathStr];
    if (map?.invalid && (code === 'invalid_string' || msg.includes('email'))) return map.invalid;
    if (map?.min && (msg.includes('min') || msg.includes('at least') || code === 'too_small')) return map.min;
    if (map?.max && (msg.includes('max') || code === 'too_big')) return map.max;
    if (map?.positive && (msg.includes('positive') || msg.includes('greater'))) return map.positive;
    if (map?.required) return map.required;
    if (map?.sum) return map.sum;
  }

  // Refine/custom messages
  if (msg.includes('category') || (msg.includes('required') && msg.includes('paid'))) return validationMap.category?.required || errors.VALIDATION_FAILED;
  if (msg.includes('sum') && msg.includes('100')) return validationMap.budgetRule?.sum || msg;

  return errors.VALIDATION_FAILED;
}
