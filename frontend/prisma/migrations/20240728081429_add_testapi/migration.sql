/*
  Warnings:

  - Added the required column `Name` to the `testapi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `testapi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade9GPAX` to the `testapi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job` to the `testapi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `militaryDomicileNumber` to the `testapi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `related` to the `testapi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school` to the `testapi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolProvince` to the `testapi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workAddress` to the `testapi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "testapi" ADD COLUMN     "Name" TEXT NOT NULL,
ADD COLUMN     "age" TEXT NOT NULL,
ADD COLUMN     "grade9GPAX" TEXT NOT NULL,
ADD COLUMN     "job" TEXT NOT NULL,
ADD COLUMN     "militaryDomicileNumber" TEXT NOT NULL,
ADD COLUMN     "related" TEXT NOT NULL,
ADD COLUMN     "school" TEXT NOT NULL,
ADD COLUMN     "schoolProvince" TEXT NOT NULL,
ADD COLUMN     "workAddress" TEXT NOT NULL;
