-- CreateTable
CREATE TABLE "testapi" (
    "id" SERIAL NOT NULL,
    "fatherName" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "religion" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "domicileNumber" TEXT NOT NULL,
    "road" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "subdistrict" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testapi_pkey" PRIMARY KEY ("id")
);
