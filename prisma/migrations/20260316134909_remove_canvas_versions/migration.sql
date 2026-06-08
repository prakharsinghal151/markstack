/*
  Warnings:

  - You are about to drop the `CanvasVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CanvasVersion" DROP CONSTRAINT "CanvasVersion_canvasId_fkey";

-- DropTable
DROP TABLE "CanvasVersion";
