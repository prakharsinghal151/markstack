-- CreateIndex
CREATE INDEX "Blog_authorId_status_idx" ON "Blog"("authorId", "status");

-- CreateIndex
CREATE INDEX "Blog_createdAt_idx" ON "Blog"("createdAt");

-- CreateIndex
CREATE INDEX "Canvas_userId_updatedAt_idx" ON "Canvas"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Todo_userId_date_idx" ON "Todo"("userId", "date");

-- CreateIndex
CREATE INDEX "Todo_userId_completed_idx" ON "Todo"("userId", "completed");
