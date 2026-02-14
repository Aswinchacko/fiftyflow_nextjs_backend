import { z } from 'zod';

export const updateBudgetSchema = z
  .object({
    monthlyBudget: z.number().min(0).optional(),
    budgetRule: z
      .object({
        needs: z.number().min(0).max(100),
        wants: z.number().min(0).max(100),
        savings: z.number().min(0).max(100),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.budgetRule) return true;
      const { needs, wants, savings } = data.budgetRule;
      return needs + wants + savings === 100;
    },
    { message: 'budgetRule percentages must sum to 100', path: ['budgetRule'] }
  );
