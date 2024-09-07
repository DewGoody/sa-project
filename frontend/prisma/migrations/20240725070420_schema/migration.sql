/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test";

-- CreateTable
CREATE TABLE "Address" (
    "id" DECIMAL NOT NULL,
    "address_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "house_num" TEXT,
    "house_moo" TEXT,
    "soi" TEXT,
    "street" TEXT,
    "subdistrict" TEXT,
    "district" TEXT,
    "province" TEXT,
    "postal_code" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id","address_type")
);

-- CreateTable
CREATE TABLE "UHC_reg_info" (
    "id" DECIMAL NOT NULL,
    "last_update" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "smart_card_issured" DATE,
    "smart_card_expired" DATE,
    "status_before_reg" TEXT,
    "status_info" TEXT,
    "frequence_uses" TEXT,
    "is_been" BOOLEAN,
    "is_congenital_disease" BOOLEAN,

    CONSTRAINT "UHC_reg_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactable_info" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "address" UUID,
    "tel_num" TEXT,
    "phont_num" TEXT,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "contactable_info_pkey" PRIMARY KEY ("id","uuid")
);

-- CreateTable
CREATE TABLE "education_record" (
    "id" DECIMAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grade" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "major" TEXT,
    "school" TEXT NOT NULL,

    CONSTRAINT "education_record_pkey" PRIMARY KEY ("id","grade")
);

-- CreateTable
CREATE TABLE "father_mother_info" (
    "id" BIGSERIAL NOT NULL,
    "relation" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "fname" TEXT,
    "lname" TEXT,
    "working_place" TEXT,
    "phone_num" TEXT,
    "tel_num" TIME(6),

    CONSTRAINT "father_mother_info_pkey" PRIMARY KEY ("id","relation")
);

-- CreateTable
CREATE TABLE "military_course" (
    "id" DECIMAL NOT NULL,
    "military_id" DECIMAL,
    "military_class" SMALLINT,
    "military_address" UUID,
    "grade9_gpax" DECIMAL NOT NULL,
    "grade9_school" TEXT,
    "family_background" TEXT,
    "economy_background" TEXT,
    "father_mother_relationship" TEXT,

    CONSTRAINT "military_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_info" (
    "parent_fname" TEXT,
    "parent_lname" TEXT,
    "occupation" TEXT,
    "age" INTEGER,
    "parent_relation" TEXT,
    "parent_address" UUID,
    "id" DECIMAL NOT NULL,
    "title" TEXT,

    CONSTRAINT "parent_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promoted_record" (
    "id" DECIMAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rank" TEXT,
    "corp" TEXT,
    "order_num" TEXT,
    "ordered_at" DATE,

    CONSTRAINT "promoted_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserve_info" (
    "id" DECIMAL NOT NULL,
    "army" TEXT,
    "corp" TEXT,

    CONSTRAINT "reserve_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_record" (
    "id" DECIMAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "class" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "major" TEXT,
    "school" TEXT NOT NULL,

    CONSTRAINT "training_record_pkey" PRIMARY KEY ("id","year")
);

-- CreateTable
CREATE TABLE "Address_Desc" (
    "type" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Address_Desc_pkey" PRIMARY KEY ("type")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" DECIMAL NOT NULL,
    "lnameTH" TEXT NOT NULL,
    "fnameTH" TEXT NOT NULL,
    "lnameEN" TEXT NOT NULL,
    "fnameEN" TEXT NOT NULL,
    "fac_id" TEXT NOT NULL,
    "fac_name" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "bd" TIMESTAMP(3) NOT NULL,
    "tel_num" TEXT,
    "title" TEXT,
    "major" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accident_claim_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acc_desc" TEXT NOT NULL,
    "acc_date" TIMESTAMP(6) NOT NULL,
    "acc_place" TIME(6) NOT NULL,
    "email" TEXT NOT NULL,
    "treatment_place" TEXT NOT NULL,
    "hospital_type" TEXT NOT NULL,
    "stu_bank_acc" DECIMAL NOT NULL,
    "stu_bank_name" TEXT NOT NULL,
    "med_fee" DECIMAL NOT NULL,

    CONSTRAINT "accident_claim_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accident_info" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stu_id" DECIMAL,
    "acc_desc" TEXT,
    "acc_date" DATE,
    "accident_place" TEXT,
    "treatment_place" TEXT,
    "hospital_type" TEXT,
    "stu_bank_acc_name" TIME(6),
    "stu_bank_acc_number" INTEGER,
    "medical fee" INTEGER,

    CONSTRAINT "accident_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "Student"("id");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_address_type_fkey" FOREIGN KEY ("address_type") REFERENCES "Address_Desc"("type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UHC_reg_info" ADD CONSTRAINT "UHC_reg_info_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "education_record" ADD CONSTRAINT "education_record_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "military_course" ADD CONSTRAINT "military_course_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_info" ADD CONSTRAINT "parent_info_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promoted_record" ADD CONSTRAINT "promoted_record_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserve_info" ADD CONSTRAINT "reserve_info_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_id_fkey" FOREIGN KEY ("id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accident_info" ADD CONSTRAINT "accident_info_stu_id_fkey" FOREIGN KEY ("stu_id") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
