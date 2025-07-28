import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import type { User, Session } from '@shared/schema';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}

export function getSessionExpiry(): Date {
  const now = new Date();
  now.setDate(now.getDate() + 30); // 30 days
  return now;
}

export interface AuthenticatedUser {
  user: User;
  session: Session;
}

export function getSessionFromRequest(request: any): string | null {
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return request.cookies?.session || null;
}