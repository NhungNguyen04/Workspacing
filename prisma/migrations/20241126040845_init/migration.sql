/*
  Warnings:

  - Made the column `repeat` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "repeat" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL;
