import type { User } from '@prisma/client';

export type SafeUser = Omit<User, 'password'>;

export function sanitizeUser(user: User): SafeUser {
  const safeUser = { ...user };
  delete (safeUser as Partial<User>).password;
  return safeUser;
}
