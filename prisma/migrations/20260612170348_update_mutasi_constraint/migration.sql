/*
  Warnings:

  - A unique constraint covering the columns `[pelangganId,periode,jenis]` on the table `MutasiPelanggan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `MutasiPelanggan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MutasiPelanggan" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MutasiPelanggan_pelangganId_periode_jenis_key" ON "MutasiPelanggan"("pelangganId", "periode", "jenis");
