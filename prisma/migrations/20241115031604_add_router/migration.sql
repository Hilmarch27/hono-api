-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AKTIF', 'TUTUP');

-- CreateTable
CREATE TABLE "router" (
    "id" TEXT NOT NULL,
    "type_of_uker" TEXT NOT NULL,
    "router_series" TEXT NOT NULL,
    "name_uker" TEXT NOT NULL,
    "kanca" TEXT NOT NULL,
    "kanwil" TEXT NOT NULL,
    "ip_uker" TEXT NOT NULL,
    "sn_device" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "information" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "router_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "router_sn_device_status_idx" ON "router"("sn_device", "status");

-- AddForeignKey
ALTER TABLE "router" ADD CONSTRAINT "router_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
