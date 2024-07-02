/*
  Warnings:

  - A unique constraint covering the columns `[emergencyContactId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_emergencyContactId_key" ON "User"("emergencyContactId");
