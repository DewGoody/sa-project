-- CreateTable
CREATE TABLE "Geography" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Geography_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "name_th" VARCHAR(150) NOT NULL,
    "name_en" VARCHAR(150) NOT NULL,
    "geography_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);
