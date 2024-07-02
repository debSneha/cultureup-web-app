/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `EmergencyContact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `EmergencyContact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_emergencyContactId_fkey";

-- AlterTable
ALTER TABLE "EmergencyContact" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_userId_key" ON "EmergencyContact"("userId");

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
