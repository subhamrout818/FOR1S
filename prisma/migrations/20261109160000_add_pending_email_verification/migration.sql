ALTER TABLE "User" ADD COLUMN "pendingEmail" TEXT;
ALTER TABLE "User" ADD COLUMN "pendingEmailUpdatedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "User_pendingEmail_key" ON "User"("pendingEmail");
