/*
  Warnings:

  - You are about to drop the `Favourite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trash` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favourite" DROP CONSTRAINT "Favourite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Trash" DROP CONSTRAINT "Trash_userId_fkey";

-- AlterTable
ALTER TABLE "GroupFile" ADD COLUMN     "favourite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trash" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trashtime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favourite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trash" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trashtime" TIMESTAMP(3);

-- DropTable
DROP TABLE "Favourite";

-- DropTable
DROP TABLE "Trash";
