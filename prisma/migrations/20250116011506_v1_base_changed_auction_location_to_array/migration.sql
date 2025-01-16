/*
  Warnings:

  - The `location` column on the `Auction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "location",
ADD COLUMN     "location" TEXT[] DEFAULT ARRAY[]::TEXT[];
