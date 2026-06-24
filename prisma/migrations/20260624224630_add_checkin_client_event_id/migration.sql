-- AlterTable
ALTER TABLE "checkin" ADD COLUMN "clientEventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "checkin_clientEventId_key" ON "checkin"("clientEventId");
