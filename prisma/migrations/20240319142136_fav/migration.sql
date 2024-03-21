/*
  Warnings:

  - You are about to drop the column `favourite` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `trash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `trashtime` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "favourite",
DROP COLUMN "trash",
DROP COLUMN "trashtime";

-- AlterTable
ALTER TABLE "UserPersonalFile" ADD COLUMN     "favourite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trash" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trashtime" TIMESTAMP(3);
