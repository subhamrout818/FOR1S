-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'credentials',
ADD COLUMN     "providerAccountId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- Backfill: every existing account is credentials-based and already past
-- signup, so treat them as verified (otherwise they'd be locked out).
UPDATE "User" SET "emailVerified" = true;

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerAccountId_key" ON "User"("provider", "providerAccountId");
