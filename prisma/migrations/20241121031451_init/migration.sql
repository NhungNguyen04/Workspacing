/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Content_id_userId_key" ON "Content"("id", "userId");
