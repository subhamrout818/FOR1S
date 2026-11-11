-- Restore columns present in the Prisma schema but missing from production.
ALTER TABLE "Project"
ADD COLUMN "archivedAt" TIMESTAMP(3);

ALTER TABLE "Deliverable"
ADD COLUMN "externalUrl" TEXT;

ALTER TABLE "DeliverableVersion"
ADD COLUMN "externalUrl" TEXT;
