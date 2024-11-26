/*
  Warnings:

  - A unique constraint covering the columns `[id,teamspaceId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamspaceId` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "teamspaceId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Board_teamspaceId_idx" ON "Board"("teamspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Board_id_teamspaceId_key" ON "Board"("id", "teamspaceId");
