import { prisma } from '../lib/prisma.js';

export async function getTransactions(userId, { search } = {}) {
  const where = { userId };
  if (search?.trim()) {
    where.name = { contains: search.trim(), mode: 'insensitive' };
  }
  return prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  });
}

export async function getTransactionById(id, userId) {
  return prisma.transaction.findFirst({
    where: { id, userId },
  });
}

export async function createTransaction(userId, data) {
  return prisma.transaction.create({
    data: { ...data, userId },
  });
}

export async function updateTransaction(id, userId, data) {
  const existing = await prisma.transaction.findFirstOrThrow({ where: { id, userId } });
  let { amount, ...rest } = data;
  if (amount !== undefined && rest.type === undefined) {
    amount = existing.type === 'paid' ? -Math.abs(amount) : Math.abs(amount);
  }
  return prisma.transaction.update({
    where: { id },
    data: { ...rest, ...(amount !== undefined && { amount }) },
  });
}

export async function deleteTransaction(id, userId) {
  const tx = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!tx) return null;
  await prisma.transaction.delete({ where: { id } });
  return tx;
}
