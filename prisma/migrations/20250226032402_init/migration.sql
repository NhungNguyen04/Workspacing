-- CreateTable
CREATE TABLE "_ContentToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContentToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContentToTask_B_index" ON "_ContentToTask"("B");

-- AddForeignKey
ALTER TABLE "_ContentToTask" ADD CONSTRAINT "_ContentToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToTask" ADD CONSTRAINT "_ContentToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
