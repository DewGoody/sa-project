-- CreateTable
CREATE TABLE "District" (
    "id" VARCHAR(6) NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "nameTh" VARCHAR(150) NOT NULL,
    "nameEn" VARCHAR(150) NOT NULL,
    "amphureId" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);
