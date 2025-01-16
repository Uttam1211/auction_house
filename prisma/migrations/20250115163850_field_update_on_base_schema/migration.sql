/*
  Warnings:

  - The `location` column on the `Auction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Auction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Lot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `unit` column on the `Lot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSED', 'UPCOMING');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('CM', 'IN');

-- CreateEnum
CREATE TYPE "VenueType" AS ENUM ('ONLINE', 'IN_PERSON');

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "venueType" "VenueType" NOT NULL DEFAULT 'IN_PERSON',
ALTER COLUMN "description" SET DEFAULT 'Not provided',
ALTER COLUMN "auctioneer" SET DEFAULT 'Not provided',
DROP COLUMN "location",
ADD COLUMN     "location" "VenueType" NOT NULL DEFAULT 'IN_PERSON',
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'UPCOMING',
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "noOfLots" SET DEFAULT 0,
ALTER COLUMN "venue" DROP NOT NULL,
ALTER COLUMN "registrationDeadline" DROP NOT NULL,
ALTER COLUMN "contactPersonName" DROP NOT NULL,
ALTER COLUMN "contactPersonEmail" DROP NOT NULL,
ALTER COLUMN "contactPersonPhone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Bid" ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Lot" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "artist" DROP NOT NULL,
ALTER COLUMN "estimatedPrice" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'UPCOMING',
ALTER COLUMN "description" SET DEFAULT 'Not provided',
ALTER COLUMN "startingBid" SET DEFAULT 0,
ALTER COLUMN "reservePrice" SET DEFAULT 0,
ALTER COLUMN "incrementRate" SET DEFAULT 0,
ALTER COLUMN "medium" DROP NOT NULL,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "width" DROP NOT NULL,
DROP COLUMN "unit",
ADD COLUMN     "unit" "Unit" NOT NULL DEFAULT 'CM',
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "condition" DROP NOT NULL,
ALTER COLUMN "provenance" DROP NOT NULL,
ALTER COLUMN "signature" DROP NOT NULL,
ALTER COLUMN "edition" DROP NOT NULL;
