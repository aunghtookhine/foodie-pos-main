/*
  Warnings:

  - The values [ORDERED,OUTFORDELIVERY,DELIVERED,CANCELLED] on the enum `ORDERSTATUS` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Location` table. All the data in the column will be lost.
  - Added the required column `city` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `township` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `township` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ORDERSTATUS_new" AS ENUM ('PENDING', 'COOKING', 'COMPLETE');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "ORDERSTATUS_new" USING ("status"::text::"ORDERSTATUS_new");
ALTER TYPE "ORDERSTATUS" RENAME TO "ORDERSTATUS_old";
ALTER TYPE "ORDERSTATUS_new" RENAME TO "ORDERSTATUS";
DROP TYPE "ORDERSTATUS_old";
COMMIT;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "township" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "township" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "itemId" TEXT NOT NULL;
