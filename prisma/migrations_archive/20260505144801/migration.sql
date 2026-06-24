/*
  Warnings:

  - You are about to drop the column `disciplineId` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the `_CompanyToDiscipline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discipline` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departmentId` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionId` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToDiscipline" DROP CONSTRAINT "_CompanyToDiscipline_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToDiscipline" DROP CONSTRAINT "_CompanyToDiscipline_B_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_disciplineId_fkey";

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "disciplineId",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "position",
ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "positionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CompanyToDiscipline";

-- DropTable
DROP TABLE "discipline";

-- CreateTable
CREATE TABLE "work" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyToWork" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyToWork_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_name_key" ON "work"("name");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "position_name_key" ON "position"("name");

-- CreateIndex
CREATE INDEX "_CompanyToWork_B_index" ON "_CompanyToWork"("B");

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToWork" ADD CONSTRAINT "_CompanyToWork_A_fkey" FOREIGN KEY ("A") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToWork" ADD CONSTRAINT "_CompanyToWork_B_fkey" FOREIGN KEY ("B") REFERENCES "work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
