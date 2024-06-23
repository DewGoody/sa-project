-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "lnameTH" TEXT NOT NULL,
    "fnameTH" TEXT NOT NULL,
    "lnameEN" TEXT NOT NULL,
    "fnameEN" TEXT NOT NULL,
    "fac_id" TEXT NOT NULL,
    "fac_name" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "bd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
