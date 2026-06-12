/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accountProvider` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `accountProviderAccountId` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `jmlPenghuni` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `nomorPelanggan` on the `Pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Pelanggan` table. All the data in the column will be lost.
  - The `geoLong` column on the `Pelanggan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `geoLat` column on the `Pelanggan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[nomorLangganan]` on the table `Pelanggan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Pelanggan` table without a default value. This is not possible if the table is not empty.
  - Made the column `nomorPersil` on table `Pelanggan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nomorLangganan` on table `Pelanggan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'DIREKSI', 'SENIOR_MANAGER', 'MANAGER', 'SUPERVISOR', 'STAFF', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "StatusPelanggan" AS ENUM ('AKTIF', 'TUTUP_SEMENTARA', 'TUTUP_SPT', 'CABUT_PERMANEN');

-- CreateEnum
CREATE TYPE "KondisiCatat" AS ENUM ('NORMAL', 'TIDAK_DIPAKAI', 'RUMAH_KOSONG', 'STAND_TEMPEL', 'STAND_KONSUMEN', 'METER_RUSAK', 'METER_MATI_ADA_AIR', 'METER_MUNDUR', 'METER_TERBALIK', 'METER_DALAM_AIR', 'LOS_METER', 'BMK_BMB', 'TTB', 'MTA', 'TERHALANG', 'TIDAK_ADA_AIR', 'ADA_ANJING', 'DK', 'MB', 'MUDA_KEMBALI', 'REV_PENCATAT', 'DICABUT');

-- CreateEnum
CREATE TYPE "GolonganTarif" AS ENUM ('GOL_1A', 'GOL_1B', 'GOL_2A1', 'GOL_2A2', 'GOL_2A3', 'GOL_2A4', 'GOL_2A5', 'GOL_2B', 'GOL_3A', 'GOL_3B', 'GOL_3C', 'GOL_4A', 'GOL_4B');

-- CreateEnum
CREATE TYPE "UkuranMeter" AS ENUM ('INCH_HALF', 'INCH_1', 'INCH_1_HALF', 'INCH_2', 'INCH_3', 'INCH_4');

-- CreateEnum
CREATE TYPE "KategoriPembacaan" AS ENUM ('ONSITE', 'OFFSITE');

-- CreateEnum
CREATE TYPE "JenisMutasi" AS ENUM ('PB', 'PK');

-- CreateEnum
CREATE TYPE "JenisPemutusan" AS ENUM ('TSM', 'SPT');

-- CreateEnum
CREATE TYPE "StatusTagihan" AS ENUM ('BELUM_BAYAR', 'SUDAH_BAYAR', 'JATUH_TEMPO', 'DIHAPUSKAN');

-- CreateEnum
CREATE TYPE "StatusLaporanMandiri" AS ENUM ('MENUNGGU', 'DIVERIFIKASI', 'DITOLAK', 'DIGUNAKAN');

-- DropForeignKey
ALTER TABLE "Pelanggan" DROP CONSTRAINT "Pelanggan_accountProvider_accountProviderAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Pelanggan" DROP CONSTRAINT "Pelanggan_userId_fkey";

-- DropIndex
DROP INDEX "Pelanggan_nomorPelanggan_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Pelanggan" DROP COLUMN "accountProvider",
DROP COLUMN "accountProviderAccountId",
DROP COLUMN "jmlPenghuni",
DROP COLUMN "nomorPelanggan",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isMBR" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jumlahPenghuni" INTEGER,
ADD COLUMN     "kecamatanId" TEXT,
ADD COLUMN     "kelurahanId" TEXT,
ADD COLUMN     "kodeMBR" TEXT,
ADD COLUMN     "lastEditorId" TEXT,
ADD COLUMN     "ruteId" TEXT,
ADD COLUMN     "seksiCaterId" TEXT,
ADD COLUMN     "status" "StatusPelanggan" NOT NULL DEFAULT 'AKTIF',
ADD COLUMN     "tarifGolonganId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zonaId" TEXT,
ALTER COLUMN "nomorPersil" SET NOT NULL,
ALTER COLUMN "nomorLangganan" SET NOT NULL,
DROP COLUMN "geoLong",
ADD COLUMN     "geoLong" DOUBLE PRECISION,
DROP COLUMN "geoLat",
ADD COLUMN     "geoLat" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "divisiId" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "loginCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "name" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Pencatat" (
    "id" TEXT NOT NULL,
    "namaLapangan" TEXT NOT NULL,
    "namaLengkap" TEXT,
    "nip" TEXT,
    "aliasLain" TEXT,
    "userId" TEXT,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pencatat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WilayahAdm" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WilayahAdm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WilayahDist" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "wilayahAdmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WilayahDist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeksiCater" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "wilayahDistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeksiCater_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WilayahSeksi" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "wilayahDistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WilayahSeksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zona" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "wilayahSeksiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rute" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "noUrut" INTEGER,
    "seksiCaterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kecamatan" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Kecamatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelurahan" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kecamatanId" TEXT NOT NULL,

    CONSTRAINT "Kelurahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Divisi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Divisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarifGolongan" (
    "id" TEXT NOT NULL,
    "kode" "GolonganTarif" NOT NULL,
    "kodeAsli" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TarifGolongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarifBlok" (
    "id" TEXT NOT NULL,
    "tarifGolonganId" TEXT NOT NULL,
    "blok" INTEGER NOT NULL,
    "batasAwalM3" INTEGER NOT NULL,
    "batasAkhirM3" INTEGER,
    "hargaPerM3" INTEGER NOT NULL,
    "berlakuMulai" TIMESTAMP(3) NOT NULL,
    "berlakuSampai" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TarifBlok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meter" (
    "id" TEXT NOT NULL,
    "nomorMeter" TEXT NOT NULL,
    "nomorSegel" TEXT,
    "merkKode" TEXT,
    "ukuran" "UkuranMeter" NOT NULL DEFAULT 'INCH_HALF',
    "tanggalPasang" TIMESTAMP(3),
    "umurTahun" INTEGER,
    "umurBulan" INTEGER,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "catatan" TEXT,
    "pelangganId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanHarianPetugas" (
    "id" TEXT NOT NULL,
    "nomorLangganan" TEXT NOT NULL,
    "periode" INTEGER NOT NULL,
    "standAwal" INTEGER NOT NULL,
    "standAkhir" INTEGER NOT NULL,
    "pemakaian" INTEGER NOT NULL,
    "pemakaianLalu" INTEGER,
    "persentase" INTEGER,
    "kondisi" "KondisiCatat" NOT NULL DEFAULT 'NORMAL',
    "kategori" "KategoriPembacaan" NOT NULL DEFAULT 'ONSITE',
    "nomorMeter" TEXT,
    "pencatatId" TEXT,
    "tanggalCatat" TIMESTAMP(3),
    "tanggalUpload" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "catatanVerif" TEXT,
    "pembacaanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaporanHarianPetugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PembacaanMeter" (
    "id" TEXT NOT NULL,
    "meterId" TEXT NOT NULL,
    "periode" TIMESTAMP(3) NOT NULL,
    "standLalu" INTEGER NOT NULL,
    "standAkhir" INTEGER NOT NULL,
    "pemakaianM3" INTEGER NOT NULL,
    "blokTarif" INTEGER NOT NULL,
    "pemakaianLalu" INTEGER,
    "blokTarifLalu" INTEGER,
    "kondisi" "KondisiCatat" NOT NULL DEFAULT 'NORMAL',
    "kategori" "KategoriPembacaan" NOT NULL DEFAULT 'ONSITE',
    "pencatatId" TEXT,
    "tanggalCatat" TIMESTAMP(3),
    "fotoBukti" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PembacaanMeter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanMandiri" (
    "id" TEXT NOT NULL,
    "pelangganId" TEXT NOT NULL,
    "nomorLangganan" TEXT NOT NULL,
    "periode" INTEGER NOT NULL,
    "standDilaporkan" INTEGER NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "nomorPelapor" TEXT NOT NULL,
    "namaPelapor" TEXT NOT NULL,
    "status" "StatusLaporanMandiri" NOT NULL DEFAULT 'MENUNGGU',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "alasanDitolak" TEXT,
    "pembacaanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaporanMandiri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tagihan" (
    "id" TEXT NOT NULL,
    "nomorTagihan" TEXT NOT NULL,
    "pelangganId" TEXT NOT NULL,
    "pembacaanId" TEXT,
    "periode" TIMESTAMP(3) NOT NULL,
    "pemakaianM3" INTEGER NOT NULL,
    "jmlHargaAir" INTEGER NOT NULL,
    "beaBeban" INTEGER NOT NULL DEFAULT 7000,
    "beaAdmin" INTEGER NOT NULL DEFAULT 10000,
    "airKotor" INTEGER NOT NULL DEFAULT 11100,
    "lainLain" INTEGER NOT NULL DEFAULT 0,
    "denda" INTEGER NOT NULL DEFAULT 0,
    "totalTagihan" INTEGER NOT NULL,
    "jumlahRekTunggak" INTEGER,
    "nominalTunggak" BIGINT,
    "status" "StatusTagihan" NOT NULL DEFAULT 'BELUM_BAYAR',
    "tanggalJatuhTempo" TIMESTAMP(3) NOT NULL,
    "tanggalBayar" TIMESTAMP(3),
    "metodePembayaran" TEXT,
    "referensiPembayaran" TEXT,
    "validatorId" TEXT,
    "validasiAt" TIMESTAMP(3),
    "catatanValidasi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MutasiPelanggan" (
    "id" TEXT NOT NULL,
    "pelangganId" TEXT NOT NULL,
    "jenis" "JenisMutasi" NOT NULL,
    "periode" INTEGER NOT NULL,
    "nomorMeterBaru" TEXT,
    "merkMeterBaru" TEXT,
    "ukuranMeterBaru" "UkuranMeter",
    "tarifBaru" "GolonganTarif",
    "ruteBaru" TEXT,
    "kodeWilayahBaru" TEXT,
    "noUrut" INTEGER,
    "jumlahPenghuni" INTEGER,
    "tanggalAktif" TIMESTAMP(3),
    "statusAktif" INTEGER,
    "prosesOlehId" TEXT,
    "updaterKode" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutasiPelanggan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pemutusan" (
    "id" TEXT NOT NULL,
    "pelangganId" TEXT NOT NULL,
    "jenis" "JenisPemutusan" NOT NULL,
    "periode" INTEGER NOT NULL,
    "nomorSurat" TEXT,
    "tanggalPermohonan" TIMESTAMP(3),
    "nomorSPT" TEXT,
    "tanggalSPT" TIMESTAMP(3),
    "tanggalTutup" TIMESTAMP(3),
    "tanggalCabut" TIMESTAMP(3),
    "prosesOlehId" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pemutusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "aksi" TEXT NOT NULL,
    "entitas" TEXT NOT NULL,
    "entitasId" TEXT,
    "perubahan" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Konfigurasi" (
    "id" TEXT NOT NULL,
    "kunci" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tipe" TEXT NOT NULL DEFAULT 'string',
    "isRahasia" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Konfigurasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pencatat_namaLapangan_key" ON "Pencatat"("namaLapangan");

-- CreateIndex
CREATE UNIQUE INDEX "Pencatat_userId_key" ON "Pencatat"("userId");

-- CreateIndex
CREATE INDEX "Pencatat_namaLapangan_idx" ON "Pencatat"("namaLapangan");

-- CreateIndex
CREATE UNIQUE INDEX "WilayahAdm_kode_key" ON "WilayahAdm"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "WilayahAdm_nama_key" ON "WilayahAdm"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "WilayahDist_kode_key" ON "WilayahDist"("kode");

-- CreateIndex
CREATE INDEX "WilayahDist_wilayahAdmId_idx" ON "WilayahDist"("wilayahAdmId");

-- CreateIndex
CREATE UNIQUE INDEX "SeksiCater_kode_key" ON "SeksiCater"("kode");

-- CreateIndex
CREATE INDEX "SeksiCater_wilayahDistId_idx" ON "SeksiCater"("wilayahDistId");

-- CreateIndex
CREATE UNIQUE INDEX "WilayahSeksi_kode_key" ON "WilayahSeksi"("kode");

-- CreateIndex
CREATE INDEX "WilayahSeksi_wilayahDistId_idx" ON "WilayahSeksi"("wilayahDistId");

-- CreateIndex
CREATE UNIQUE INDEX "Zona_kode_key" ON "Zona"("kode");

-- CreateIndex
CREATE INDEX "Zona_wilayahSeksiId_idx" ON "Zona"("wilayahSeksiId");

-- CreateIndex
CREATE UNIQUE INDEX "Rute_kode_key" ON "Rute"("kode");

-- CreateIndex
CREATE INDEX "Rute_seksiCaterId_idx" ON "Rute"("seksiCaterId");

-- CreateIndex
CREATE UNIQUE INDEX "Kecamatan_kode_key" ON "Kecamatan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Kelurahan_kode_key" ON "Kelurahan"("kode");

-- CreateIndex
CREATE INDEX "Kelurahan_kecamatanId_idx" ON "Kelurahan"("kecamatanId");

-- CreateIndex
CREATE UNIQUE INDEX "Divisi_nama_key" ON "Divisi"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Divisi_kode_key" ON "Divisi"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "TarifGolongan_kode_key" ON "TarifGolongan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "TarifGolongan_kodeAsli_key" ON "TarifGolongan"("kodeAsli");

-- CreateIndex
CREATE INDEX "TarifBlok_tarifGolonganId_idx" ON "TarifBlok"("tarifGolonganId");

-- CreateIndex
CREATE UNIQUE INDEX "TarifBlok_tarifGolonganId_blok_berlakuMulai_key" ON "TarifBlok"("tarifGolonganId", "blok", "berlakuMulai");

-- CreateIndex
CREATE UNIQUE INDEX "Meter_pelangganId_key" ON "Meter"("pelangganId");

-- CreateIndex
CREATE INDEX "Meter_nomorMeter_idx" ON "Meter"("nomorMeter");

-- CreateIndex
CREATE INDEX "Meter_pelangganId_isAktif_idx" ON "Meter"("pelangganId", "isAktif");

-- CreateIndex
CREATE INDEX "Meter_merkKode_idx" ON "Meter"("merkKode");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanHarianPetugas_pembacaanId_key" ON "LaporanHarianPetugas"("pembacaanId");

-- CreateIndex
CREATE INDEX "LaporanHarianPetugas_nomorLangganan_idx" ON "LaporanHarianPetugas"("nomorLangganan");

-- CreateIndex
CREATE INDEX "LaporanHarianPetugas_pencatatId_idx" ON "LaporanHarianPetugas"("pencatatId");

-- CreateIndex
CREATE INDEX "LaporanHarianPetugas_periode_idx" ON "LaporanHarianPetugas"("periode");

-- CreateIndex
CREATE INDEX "LaporanHarianPetugas_isVerified_idx" ON "LaporanHarianPetugas"("isVerified");

-- CreateIndex
CREATE INDEX "LaporanHarianPetugas_tanggalCatat_idx" ON "LaporanHarianPetugas"("tanggalCatat");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanHarianPetugas_nomorLangganan_periode_key" ON "LaporanHarianPetugas"("nomorLangganan", "periode");

-- CreateIndex
CREATE INDEX "PembacaanMeter_meterId_idx" ON "PembacaanMeter"("meterId");

-- CreateIndex
CREATE INDEX "PembacaanMeter_periode_idx" ON "PembacaanMeter"("periode");

-- CreateIndex
CREATE INDEX "PembacaanMeter_kondisi_idx" ON "PembacaanMeter"("kondisi");

-- CreateIndex
CREATE UNIQUE INDEX "PembacaanMeter_meterId_periode_key" ON "PembacaanMeter"("meterId", "periode");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanMandiri_pembacaanId_key" ON "LaporanMandiri"("pembacaanId");

-- CreateIndex
CREATE INDEX "LaporanMandiri_pelangganId_idx" ON "LaporanMandiri"("pelangganId");

-- CreateIndex
CREATE INDEX "LaporanMandiri_nomorLangganan_idx" ON "LaporanMandiri"("nomorLangganan");

-- CreateIndex
CREATE INDEX "LaporanMandiri_periode_idx" ON "LaporanMandiri"("periode");

-- CreateIndex
CREATE INDEX "LaporanMandiri_status_idx" ON "LaporanMandiri"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanMandiri_pelangganId_periode_key" ON "LaporanMandiri"("pelangganId", "periode");

-- CreateIndex
CREATE UNIQUE INDEX "Tagihan_nomorTagihan_key" ON "Tagihan"("nomorTagihan");

-- CreateIndex
CREATE UNIQUE INDEX "Tagihan_pembacaanId_key" ON "Tagihan"("pembacaanId");

-- CreateIndex
CREATE INDEX "Tagihan_pelangganId_periode_idx" ON "Tagihan"("pelangganId", "periode");

-- CreateIndex
CREATE INDEX "Tagihan_status_tanggalJatuhTempo_idx" ON "Tagihan"("status", "tanggalJatuhTempo");

-- CreateIndex
CREATE INDEX "Tagihan_periode_idx" ON "Tagihan"("periode");

-- CreateIndex
CREATE INDEX "Tagihan_nominalTunggak_idx" ON "Tagihan"("nominalTunggak");

-- CreateIndex
CREATE INDEX "MutasiPelanggan_pelangganId_idx" ON "MutasiPelanggan"("pelangganId");

-- CreateIndex
CREATE INDEX "MutasiPelanggan_jenis_periode_idx" ON "MutasiPelanggan"("jenis", "periode");

-- CreateIndex
CREATE INDEX "Pemutusan_pelangganId_idx" ON "Pemutusan"("pelangganId");

-- CreateIndex
CREATE INDEX "Pemutusan_jenis_periode_idx" ON "Pemutusan"("jenis", "periode");

-- CreateIndex
CREATE INDEX "Pemutusan_tanggalCabut_idx" ON "Pemutusan"("tanggalCabut");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entitas_entitasId_idx" ON "AuditLog"("entitas", "entitasId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Konfigurasi_kunci_key" ON "Konfigurasi"("kunci");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pelanggan_nomorLangganan_key" ON "Pelanggan"("nomorLangganan");

-- CreateIndex
CREATE INDEX "Pelanggan_nomorLangganan_idx" ON "Pelanggan"("nomorLangganan");

-- CreateIndex
CREATE INDEX "Pelanggan_nomorPersil_idx" ON "Pelanggan"("nomorPersil");

-- CreateIndex
CREATE INDEX "Pelanggan_nama_idx" ON "Pelanggan"("nama");

-- CreateIndex
CREATE INDEX "Pelanggan_status_idx" ON "Pelanggan"("status");

-- CreateIndex
CREATE INDEX "Pelanggan_seksiCaterId_idx" ON "Pelanggan"("seksiCaterId");

-- CreateIndex
CREATE INDEX "Pelanggan_ruteId_idx" ON "Pelanggan"("ruteId");

-- CreateIndex
CREATE INDEX "Pelanggan_zonaId_idx" ON "Pelanggan"("zonaId");

-- CreateIndex
CREATE INDEX "Pelanggan_tarifGolonganId_idx" ON "Pelanggan"("tarifGolonganId");

-- CreateIndex
CREATE INDEX "Pelanggan_deletedAt_idx" ON "Pelanggan"("deletedAt");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- AddForeignKey
ALTER TABLE "Pencatat" ADD CONSTRAINT "Pencatat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WilayahDist" ADD CONSTRAINT "WilayahDist_wilayahAdmId_fkey" FOREIGN KEY ("wilayahAdmId") REFERENCES "WilayahAdm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeksiCater" ADD CONSTRAINT "SeksiCater_wilayahDistId_fkey" FOREIGN KEY ("wilayahDistId") REFERENCES "WilayahDist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WilayahSeksi" ADD CONSTRAINT "WilayahSeksi_wilayahDistId_fkey" FOREIGN KEY ("wilayahDistId") REFERENCES "WilayahDist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zona" ADD CONSTRAINT "Zona_wilayahSeksiId_fkey" FOREIGN KEY ("wilayahSeksiId") REFERENCES "WilayahSeksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rute" ADD CONSTRAINT "Rute_seksiCaterId_fkey" FOREIGN KEY ("seksiCaterId") REFERENCES "SeksiCater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelurahan" ADD CONSTRAINT "Kelurahan_kecamatanId_fkey" FOREIGN KEY ("kecamatanId") REFERENCES "Kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_divisiId_fkey" FOREIGN KEY ("divisiId") REFERENCES "Divisi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarifBlok" ADD CONSTRAINT "TarifBlok_tarifGolonganId_fkey" FOREIGN KEY ("tarifGolonganId") REFERENCES "TarifGolongan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_tarifGolonganId_fkey" FOREIGN KEY ("tarifGolonganId") REFERENCES "TarifGolongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_seksiCaterId_fkey" FOREIGN KEY ("seksiCaterId") REFERENCES "SeksiCater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_ruteId_fkey" FOREIGN KEY ("ruteId") REFERENCES "Rute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "Zona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_kecamatanId_fkey" FOREIGN KEY ("kecamatanId") REFERENCES "Kecamatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_kelurahanId_fkey" FOREIGN KEY ("kelurahanId") REFERENCES "Kelurahan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_lastEditorId_fkey" FOREIGN KEY ("lastEditorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meter" ADD CONSTRAINT "Meter_pelangganId_fkey" FOREIGN KEY ("pelangganId") REFERENCES "Pelanggan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanHarianPetugas" ADD CONSTRAINT "LaporanHarianPetugas_pencatatId_fkey" FOREIGN KEY ("pencatatId") REFERENCES "Pencatat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanHarianPetugas" ADD CONSTRAINT "LaporanHarianPetugas_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanHarianPetugas" ADD CONSTRAINT "LaporanHarianPetugas_pembacaanId_fkey" FOREIGN KEY ("pembacaanId") REFERENCES "PembacaanMeter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembacaanMeter" ADD CONSTRAINT "PembacaanMeter_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "Meter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembacaanMeter" ADD CONSTRAINT "PembacaanMeter_pencatatId_fkey" FOREIGN KEY ("pencatatId") REFERENCES "Pencatat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMandiri" ADD CONSTRAINT "LaporanMandiri_pelangganId_fkey" FOREIGN KEY ("pelangganId") REFERENCES "Pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMandiri" ADD CONSTRAINT "LaporanMandiri_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMandiri" ADD CONSTRAINT "LaporanMandiri_pembacaanId_fkey" FOREIGN KEY ("pembacaanId") REFERENCES "PembacaanMeter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_pelangganId_fkey" FOREIGN KEY ("pelangganId") REFERENCES "Pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_pembacaanId_fkey" FOREIGN KEY ("pembacaanId") REFERENCES "PembacaanMeter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutasiPelanggan" ADD CONSTRAINT "MutasiPelanggan_pelangganId_fkey" FOREIGN KEY ("pelangganId") REFERENCES "Pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutasiPelanggan" ADD CONSTRAINT "MutasiPelanggan_prosesOlehId_fkey" FOREIGN KEY ("prosesOlehId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemutusan" ADD CONSTRAINT "Pemutusan_pelangganId_fkey" FOREIGN KEY ("pelangganId") REFERENCES "Pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemutusan" ADD CONSTRAINT "Pemutusan_prosesOlehId_fkey" FOREIGN KEY ("prosesOlehId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
