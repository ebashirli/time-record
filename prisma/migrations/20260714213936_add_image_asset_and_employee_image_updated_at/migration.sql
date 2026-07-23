-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "imageUpdatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "image_asset" (
    "fileName" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "fileMtimeMs" DOUBLE PRECISION NOT NULL,
    "contentHash" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL,
    "lastChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_asset_pkey" PRIMARY KEY ("fileName")
);
