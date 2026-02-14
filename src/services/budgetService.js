import { prisma } from '../lib/prisma.js';

const DEFAULT_RULE = { needs: 50, wants: 30, savings: 20 };

export async function getBudget(userId) {
  let budget = await prisma.userBudget.findUnique({ where: { userId } });
  if (!budget) {
    budget = await prisma.userBudget.create({
      data: {
        userId,
        monthlyBudget: 0,
        ...DEFAULT_RULE,
      },
    });
  }
  return {
    monthlyBudget: budget.monthlyBudget,
    budgetRule: { needs: budget.needs, wants: budget.wants, savings: budget.savings },
  };
}

export async function updateBudget(userId, { monthlyBudget, budgetRule }) {
  let budget = await prisma.userBudget.findUnique({ where: { userId } });
  if (!budget) {
    budget = await prisma.userBudget.create({
      data: {
        userId,
        monthlyBudget: 0,
        ...DEFAULT_RULE,
      },
    });
  }
  const data = {};
  if (typeof monthlyBudget === 'number') data.monthlyBudget = monthlyBudget;
  if (budgetRule) {
    data.needs = budgetRule.needs;
    data.wants = budgetRule.wants;
    data.savings = budgetRule.savings;
  }
  const updated = await prisma.userBudget.update({
    where: { userId },
    data,
  });
  return {
    monthlyBudget: updated.monthlyBudget,
    budgetRule: { needs: updated.needs, wants: updated.wants, savings: updated.savings },
  };
}
