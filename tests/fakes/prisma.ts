// Replaces "@/lib/prisma" under npm test: raw queries use the fake RateLimit
// table, while user and deliverable queries use small in-memory fixtures.
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
  updatedAt?: Date;
}

export interface FakeDeliverable {
  id: string;
  projectId: string;
  project: { id: string; name: string; slug?: string; clientId: string };
  title: string;
  kind: string;
  status: string;
  description?: string | null;
  mediaUrl?: string | null;
  posterUrl?: string | null;
  version?: number;
  dueAt?: Date | null;
  deliveredAt?: Date | null;
  createdAt?: Date;
}

export const fakeUsers = new Map<string, FakeUser>();
export const fakeDeliverables = new Map<string, FakeDeliverable>();

export const prisma = {
  $queryRawUnsafe: (sql: string, ...params: unknown[]) => fakeDb.handle(sql, params),
  $executeRawUnsafe: (sql: string, ...params: unknown[]) => fakeDb.handle(sql, params),
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) return fakeUsers.get(where.email) ?? null;
      if (where.id) return [...fakeUsers.values()].find((user) => user.id === where.id) ?? null;
      return null;
    },
  },
  deliverable: {
    findFirst: async ({ where }: { where: { id: string; project?: { clientId?: string } } }) => {
      const item = fakeDeliverables.get(where.id);
      if (!item) return null;
      if (where.project?.clientId && item.project.clientId !== where.project.clientId) return null;
      return item;
    },
  },
};
