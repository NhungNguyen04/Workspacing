/*
  Warnings:

  - A unique constraint covering the columns `[columnId,position]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "position" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Task_columnId_position_key" ON "Task"("columnId", "position");
