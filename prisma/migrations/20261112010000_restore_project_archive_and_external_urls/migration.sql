-- Restore columns present in the Prisma schema but missing from production.
ALTER TABLE "Project"
ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);

ALTER TABLE "Deliverable"
ADD COLUMN IF NOT EXISTS "externalUrl" TEXT,
ADD COLUMN IF NOT EXISTS "mimeType" TEXT;

ALTER TABLE "DeliverableVersion"
ADD COLUMN IF NOT EXISTS "externalUrl" TEXT,
ADD COLUMN IF NOT EXISTS "mimeType" TEXT;
