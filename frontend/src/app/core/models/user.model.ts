export type UserRole = 'student' | 'instructor' | 'admin';

export interface SafeUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
  avatar: string | null;
  bio: string | null;
  createdAt?: string;
}
