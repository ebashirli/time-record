-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."BloodType" AS ENUM ('O_I_RH_POSITIVE', 'O_I_RH_NEGATIVE', 'A_II_RH_POSITIVE', 'A_II_RH_NEGATIVE', 'B_III_RH_POSITIVE', 'B_III_RH_NEGATIVE', 'AB_IV_RH_POSITIVE', 'AB_IV_RH_NEGATIVE');

-- CreateEnum
CREATE TYPE "public"."Direction" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "public"."IdCardSerie" AS ENUM ('AA', 'AZE', 'MYI');

-- CreateEnum
CREATE TYPE "public"."Nationality" AS ENUM ('AZERBAIJANI', 'TURKISH', 'RUSSIAN');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'HR', 'TERMINAL');

-- CreateEnum
CREATE TYPE "public"."Sex" AS ENUM ('FEMALE', 'MALE');

-- CreateEnum
CREATE TYPE "public"."Shift" AS ENUM ('DAY', 'EVENING', 'NIGHT', 'OFFICE');

-- CreateTable
CREATE TABLE "public"."_CompanyToWork" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyToWork_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checkin" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "checkedById" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "direction" "public"."Direction" NOT NULL,

    CONSTRAINT "checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "logo" TEXT,
    "workIds" TEXT[],
    "isActive" BOOLEAN DEFAULT true,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "birthDate" TIMESTAMP(3),
    "bloodType" "public"."BloodType",
    "cardId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "emergencyPhoneNumber" TEXT,
    "firstName" TEXT,
    "hireDate" TIMESTAMP(3),
    "idCardNo" TEXT,
    "idCardPin" TEXT,
    "idCardSerie" "public"."IdCardSerie",
    "image" TEXT,
    "lastName" TEXT,
    "nationality" "public"."Nationality",
    "phoneNumber" TEXT,
    "positionId" TEXT NOT NULL,
    "sex" "public"."Sex",
    "shift" "public"."Shift",
    "terminationDate" TIMESTAMP(3),
    "fullName" TEXT,
    "middleName" TEXT,
    "patronymic" TEXT,
    "isActive" BOOLEAN DEFAULT true,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."position" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."work" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "work_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "_CompanyToWork_B_index" ON "public"."_CompanyToWork"("B" ASC);

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "public"."account"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "company_name_key" ON "public"."company"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "public"."department"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "employee_cardId_key" ON "public"."employee"("cardId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "employee_idCardPin_key" ON "public"."employee"("idCardPin" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "position_name_key" ON "public"."position"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token" ASC);

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "public"."session"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email" ASC);

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "public"."verification"("identifier" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "work_name_key" ON "public"."work"("name" ASC);

-- AddForeignKey
ALTER TABLE "public"."_CompanyToWork" ADD CONSTRAINT "_CompanyToWork_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyToWork" ADD CONSTRAINT "_CompanyToWork_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkin" ADD CONSTRAINT "checkin_checkedById_fkey" FOREIGN KEY ("checkedById") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkin" ADD CONSTRAINT "checkin_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "public"."position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

