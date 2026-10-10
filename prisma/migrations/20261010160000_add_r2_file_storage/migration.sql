ALTER TABLE "FileAsset" ADD COLUMN "storageKey" TEXT;
CREATE UNIQUE INDEX "FileAsset_storageKey_key" ON "FileAsset"("storageKey");
