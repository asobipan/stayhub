-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'REJECTED');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "rejectedReason" TEXT,
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "isActive" SET DEFAULT false;
