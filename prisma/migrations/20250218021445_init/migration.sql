/*
  Warnings:

  - A unique constraint covering the columns `[name,teamspaceId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "teamspaceId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Category_teamspaceId_idx" ON "Category"("teamspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_teamspaceId_key" ON "Category"("name", "teamspaceId");
