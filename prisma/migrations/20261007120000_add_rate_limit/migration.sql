-- CreateTable
-- IF NOT EXISTS: lib/rate-limit.ts creates this table on first use if it is
-- missing, so this migration must be safe to run either way.
CREATE TABLE IF NOT EXISTS "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");
