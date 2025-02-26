/*
  Warnings:

  - You are about to drop the `_ContentToTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ContentToTask" DROP CONSTRAINT "_ContentToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToTask" DROP CONSTRAINT "_ContentToTask_B_fkey";

-- DropTable
DROP TABLE "_ContentToTask";

-- CreateTable
CREATE TABLE "TaskContent" (
    "taskId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskContent_pkey" PRIMARY KEY ("taskId","contentId")
);

-- CreateIndex
CREATE INDEX "TaskContent_taskId_idx" ON "TaskContent"("taskId");

-- CreateIndex
CREATE INDEX "TaskContent_contentId_idx" ON "TaskContent"("contentId");

-- AddForeignKey
ALTER TABLE "TaskContent" ADD CONSTRAINT "TaskContent_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskContent" ADD CONSTRAINT "TaskContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
