-- CreateTable
CREATE TABLE "Canvas" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "data" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Canvas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvasVersion" (
    "id" TEXT NOT NULL,
    "canvasId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CanvasVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Canvas_shareToken_key" ON "Canvas"("shareToken");

-- CreateIndex
CREATE INDEX "Canvas_userId_idx" ON "Canvas"("userId");

-- CreateIndex
CREATE INDEX "Canvas_shareToken_idx" ON "Canvas"("shareToken");

-- CreateIndex
CREATE INDEX "CanvasVersion_canvasId_idx" ON "CanvasVersion"("canvasId");

-- AddForeignKey
ALTER TABLE "Canvas" ADD CONSTRAINT "Canvas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasVersion" ADD CONSTRAINT "CanvasVersion_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
