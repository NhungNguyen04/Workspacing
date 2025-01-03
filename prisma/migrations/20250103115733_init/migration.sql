/*
  Warnings:

  - You are about to drop the column `teamspaceId` on the `Event` table. All the data in the column will be lost.
  - Made the column `userId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Event_teamspaceId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "teamspaceId",
ALTER COLUMN "userId" SET NOT NULL;
