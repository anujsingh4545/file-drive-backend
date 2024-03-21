/*
  Warnings:

  - A unique constraint covering the columns `[orignalid]` on the table `Favourite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orignalid]` on the table `Trash` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favourite_orignalid_key" ON "Favourite"("orignalid");

-- CreateIndex
CREATE UNIQUE INDEX "Trash_orignalid_key" ON "Trash"("orignalid");
