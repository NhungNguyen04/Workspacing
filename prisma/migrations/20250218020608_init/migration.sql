-- DropIndex
DROP INDEX "Content_id_userId_key";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "teamspaceId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Content_teamspaceId_idx" ON "Content"("teamspaceId");
