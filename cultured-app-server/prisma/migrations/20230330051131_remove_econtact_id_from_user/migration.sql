/*
  Warnings:

  - You are about to drop the column `emergencyContactId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_emergencyContactId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emergencyContactId";
