/*
  Warnings:

  - You are about to drop the column `description` on the `Column` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Column" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT DEFAULT '',
ALTER COLUMN "repeat" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;
