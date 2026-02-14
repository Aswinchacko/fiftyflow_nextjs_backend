import { prisma } from '../lib/prisma.js';

function startOfMonth(d) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export async function getSummary(userId) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const monthStart = startOfMonth(now);

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    select: { amount: true, type: true, category: true, date: true },
  });

  let balance = 0;
  let dailyChange = 0;
  const monthSpending = { needs: 0, wants: 0, savings: 0 };

  for (const tx of transactions) {
    balance += tx.amount;
    if (tx.date >= todayStart && tx.date <= todayEnd) {
      dailyChange += tx.amount;
    }
    if (tx.date >= monthStart && tx.type === 'paid' && tx.category) {
      monthSpending[tx.category] = (monthSpending[tx.category] || 0) + Math.abs(tx.amount);
    }
  }

  const budget = await prisma.userBudget.findUnique({ where: { userId } });
  const monthlyBudget = budget?.monthlyBudget ?? 0;
  const needsPct = (budget?.needs ?? 50) / 100;
  const wantsPct = (budget?.wants ?? 30) / 100;
  const savingsPct = (budget?.savings ?? 20) / 100;

  const budgetLimits = {
    needs: monthlyBudget * needsPct,
    wants: monthlyBudget * wantsPct,
    savings: monthlyBudget * savingsPct,
  };

  const byCategory = (cat) => {
    const spent = monthSpending[cat] ?? 0;
    const limit = budgetLimits[cat] ?? 0;
    const remaining = limit - spent;
    const overBy = spent > limit ? spent - limit : 0;
    return {
      spent,
      limit,
      remaining,
      overBy,
      percentUsed: limit > 0 ? Math.round((spent / limit) * 100) : 0,
    };
  };

  return {
    balance,
    dailyChange,
    monthSpending,
    budgetLimits,
    categoryBreakdown: {
      needs: byCategory('needs'),
      wants: byCategory('wants'),
      savings: byCategory('savings'),
    },
  };
}
