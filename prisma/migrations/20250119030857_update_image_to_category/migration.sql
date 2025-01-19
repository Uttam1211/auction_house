/*
  Warnings:

  - You are about to drop the column `images` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "images",
ADD COLUMN     "image" TEXT;
