-- CreateTable
CREATE TABLE "DatasetChatSession" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatasetChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metaJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DatasetChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DatasetChatSession_datasetId_idx" ON "DatasetChatSession"("datasetId");

-- CreateIndex
CREATE INDEX "DatasetChatMessage_sessionId_createdAt_idx" ON "DatasetChatMessage"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "DatasetChatSession" ADD CONSTRAINT "DatasetChatSession_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetChatMessage" ADD CONSTRAINT "DatasetChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DatasetChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
