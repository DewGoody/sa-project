-- CreateTable
CREATE TABLE "mphures" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(4) NOT NULL,
    "name_th" VARCHAR(150) NOT NULL,
    "name_en" VARCHAR(150) NOT NULL,
    "province_id" INTEGER NOT NULL,

    CONSTRAINT "mphures_pkey" PRIMARY KEY ("id")
);
