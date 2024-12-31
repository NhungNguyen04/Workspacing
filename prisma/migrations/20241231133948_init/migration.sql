-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "teamspaceId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Task_teamspaceId_idx" ON "Task"("teamspaceId");
