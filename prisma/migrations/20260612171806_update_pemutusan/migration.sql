/*
  Warnings:

  - A unique constraint covering the columns `[pelangganId,periode,nomorSurat]` on the table `Pemutusan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pemutusan_pelangganId_periode_nomorSurat_key" ON "Pemutusan"("pelangganId", "periode", "nomorSurat");
