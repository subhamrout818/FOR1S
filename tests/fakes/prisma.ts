// Replaces "@/lib/prisma" under `npm test`: raw queries go to the fake
// RateLimit table, and user lookups come from a small in-memory map.
import { FakeRateLimitDb } from "./db";

export const fakeDb = new FakeRateLimitDb();

export interface FakeUser {
  id: string;
  name: string;
  email: string;
  password: string | null;
  emailVerified: boolean;
  role: string;
  company: string | null;
  profileImage: string | null;
  provider: string;
}

export const fakeUsers = new Map<string, FakeUser>();

export const prisma = {
  $queryRawUnsafe: (sql: string, ...params: unknown[]) => fakeDb.handle(sql, params),
  $executeRawUnsafe: (sql: string, ...params: unknown[]) => fakeDb.handle(sql, params),
  user: {
    findUnique: async ({ where }: { where: { email: string } }) => fakeUsers.get(where.email) ?? null,
  },
};
