import { prisma } from '../lib/prisma.js';

export async function createUser({ name, email, passwordHash }) {
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });
  return user;
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });
}

export async function updateUser(userId, { name }) {
  return prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });
}
