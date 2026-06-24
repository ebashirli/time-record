-- AlterTable
ALTER TABLE "user" ADD COLUMN     "gateId" TEXT;

-- CreateTable
CREATE TABLE "Gate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "checkin_employeeId_dateTime_idx" ON "checkin"("employeeId", "dateTime");

-- CreateIndex
CREATE INDEX "user_gateId_idx" ON "user"("gateId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_gateId_fkey" FOREIGN KEY ("gateId") REFERENCES "Gate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
