-- DropIndex
DROP INDEX "Task_columnId_position_key";

-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
