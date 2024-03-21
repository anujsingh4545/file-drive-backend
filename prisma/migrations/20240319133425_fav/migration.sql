/*
  Warnings:

  - Added the required column `orignalid` to the `Favourite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orignalid` to the `Trash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favourite" ADD COLUMN     "orignalid" TEXT NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Trash" ADD COLUMN     "orignalid" TEXT NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;
