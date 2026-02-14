import { z } from 'zod';

const transactionType = z.enum(['received', 'paid']);
const category = z.enum(['needs', 'wants', 'savings']).nullable();

export const createTransactionSchema = z
  .object({
    name: z.string().min(1).max(200),
    type: transactionType,
    amount: z.number().positive(),
    date: z.string().datetime().optional(),
    icon: z.string().max(50).optional(),
    category: category.optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'paid') return data.category != null;
      return true;
    },
    { message: 'category is required when type is paid', path: ['category'] }
  )
  .transform((data) => ({
    ...data,
    amount: data.type === 'paid' ? -Math.abs(data.amount) : Math.abs(data.amount),
    date: data.date ? new Date(data.date) : new Date(),
  }));

export const updateTransactionSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    type: transactionType.optional(),
    amount: z.number().optional(),
    date: z.string().datetime().optional(),
    icon: z.string().max(50).optional().nullable(),
    category: category.optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'paid' && data.category === undefined) return true;
      if (data.type === 'paid') return data.category != null;
      return true;
    },
    { message: 'category is required when type is paid', path: ['category'] }
  )
  .transform((data) => {
    const out = {};
    if (data.name !== undefined) out.name = data.name;
    if (data.type !== undefined) out.type = data.type;
    if (data.amount !== undefined) {
      out.amount = data.type === 'paid' ? -Math.abs(data.amount) : data.type === 'received' ? Math.abs(data.amount) : data.amount;
    }
    if (data.date !== undefined) out.date = new Date(data.date);
    if (data.icon !== undefined) out.icon = data.icon;
    if (data.category !== undefined) out.category = data.category;
    return out;
  });
