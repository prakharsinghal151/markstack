/*
  Warnings:

  - You are about to drop the column `published` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Canvas` table. All the data in the column will be lost.
  - You are about to drop the column `shareToken` on the `Canvas` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Canvas_shareToken_idx";

-- DropIndex
DROP INDEX "Canvas_shareToken_key";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "published",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Canvas" DROP COLUMN "isPublic",
DROP COLUMN "shareToken";
