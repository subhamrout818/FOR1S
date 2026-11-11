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
  pendingEmail?: string | null;
  pendingEmailUpdatedAt?: Date | null;
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
      if (where.email) {
        const user = fakeUsers.get(where.email);
        return user ? { ...user, updatedAt: user.updatedAt ?? new Date(0) } : null;
      }
      if (where.id) {
        const user = [...fakeUsers.values()].find((candidate) => candidate.id === where.id);
        return user ? { ...user, updatedAt: user.updatedAt ?? new Date(0) } : null;
      }
      return null;
    },
    findFirst: async ({ where }: { where: { OR?: Array<{ email?: string; pendingEmail?: string }> } }) => {
      if (where.OR) {
        for (const condition of where.OR) {
          if (condition.email) {
            const user = fakeUsers.get(condition.email);
            if (user) return { ...user, updatedAt: user.updatedAt ?? new Date(0), pendingEmail: null, pendingEmailUpdatedAt: null };
          }
          if (condition.pendingEmail) {
            const user = [...fakeUsers.values()].find((candidate) => candidate.email === condition.pendingEmail);
            if (user) return { ...user, updatedAt: user.updatedAt ?? new Date(0), pendingEmail: user.email, pendingEmailUpdatedAt: user.updatedAt ?? new Date(0) };
          }
        }
      }
      return null;
    },
    updateMany: async ({ where, data }: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
      const user = [...fakeUsers.values()].find((candidate) => {
        if (where.id && candidate.id !== where.id) return false;
        if (where.email && candidate.email !== where.email) return false;
        if (where.pendingEmail && candidate.pendingEmail !== where.pendingEmail) return false;
        if (where.emailVerified !== undefined && candidate.emailVerified !== where.emailVerified) return false;
        const expectedUpdated = where.updatedAt instanceof Date ? where.updatedAt.getTime() : undefined;
        if (expectedUpdated !== undefined && (candidate.updatedAt ?? new Date(0)).getTime() !== expectedUpdated) return false;
        const expectedPending = where.pendingEmailUpdatedAt instanceof Date ? where.pendingEmailUpdatedAt.getTime() : undefined;
        if (expectedPending !== undefined && (candidate.pendingEmailUpdatedAt ?? null)?.getTime() !== expectedPending) return false;
        return true;
      });
      if (!user) return { count: 0 };
      Object.assign(user, data);
      user.updatedAt = new Date((user.updatedAt ?? new Date()).getTime() + 1);
      return { count: 1 };
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
