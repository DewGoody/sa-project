/*
  Warnings:

  - The primary key for the `father_mother_info` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `testapi` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "address_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "race" TEXT,
ADD COLUMN     "religion" VARCHAR,
ADD COLUMN     "thai_id" TEXT,
ALTER COLUMN "bd" SET DATA TYPE DATE,
ALTER COLUMN "major" SET DEFAULT '';

-- AlterTable
ALTER TABLE "father_mother_info" DROP CONSTRAINT "father_mother_info_pkey",
ADD COLUMN     "occupation" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE DECIMAL,
ALTER COLUMN "tel_num" SET DATA TYPE TEXT,
ADD CONSTRAINT "father_mother_info_pkey" PRIMARY KEY ("id", "relation");
DROP SEQUENCE "father_mother_info_id_seq";

-- AlterTable
ALTER TABLE "military_course" ADD COLUMN     "grade9_province" TEXT;

-- DropTable
DROP TABLE "testapi";

-- AddForeignKey
ALTER TABLE "father_mother_info" ADD CONSTRAINT "father_mother_info_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
