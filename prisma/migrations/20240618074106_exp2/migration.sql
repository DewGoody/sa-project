-- CreateTable
CREATE TABLE "contactAddress" (
    "address" TEXT NOT NULL,
    "sub_district" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "contactAddress_user_id_key" ON "contactAddress"("user_id");

-- AddForeignKey
ALTER TABLE "contactAddress" ADD CONSTRAINT "contactAddress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
