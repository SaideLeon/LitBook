import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

export const prisma = new PrismaClient();

export const login = async (email: string, password: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return null;
  }
  return user;
};

export const register = async (data: Pick<User, 'name' | 'email' | 'password'>): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return user;
};
