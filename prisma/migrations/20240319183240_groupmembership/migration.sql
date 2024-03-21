/*
  Warnings:

  - The required column `id` was added to the `GroupMembership` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "GroupMembership_userId_key";

-- AlterTable
ALTER TABLE "GroupMembership" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "GroupMembership_pkey" PRIMARY KEY ("id");
