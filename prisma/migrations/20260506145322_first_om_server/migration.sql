/*
  Warnings:

  - You are about to drop the column `departmentId` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `positionId` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the `_CompanyToWork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `work` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToWork" DROP CONSTRAINT "_CompanyToWork_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToWork" DROP CONSTRAINT "_CompanyToWork_B_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_positionId_fkey";

-- DropIndex
DROP INDEX "company_name_key";

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "departmentId",
DROP COLUMN "fullName",
DROP COLUMN "image",
DROP COLUMN "nationality",
DROP COLUMN "positionId",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CompanyToWork";

-- DropTable
DROP TABLE "department";

-- DropTable
DROP TABLE "position";

-- DropTable
DROP TABLE "work";

-- DropEnum
DROP TYPE "Nationality";
