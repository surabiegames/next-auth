// seed/03-lapdatameter.ts
// Fase 3: Import laporan harian petugas
//
// Catatan penting:
// - nomorLangganan disimpan sebagai string (bukan FK langsung) karena
//   30 baris merujuk pelanggan yang belum ada di ProgresCater (PBPK baru / dicabut)
// - @@unique([nomorLangganan, periode]) mencegah duplikat saat re-run
// - kd_petugas "-" → pencatatId = null

import { prisma } from "./client";
import {
  readCsv, inBatches, log,
  normalizeNolg, normalizePencatat,
  mapKondisi, mapKategori, parseDate,
} from "./utils";

export async function seedLapdatameter(csvPath: string) {
  log("03-LAPDATAMETER", `Baca file: ${csvPath}`);
  const rows = readCsv(csvPath);
  log("03-LAPDATAMETER", `Total baris: ${rows.length}`);

  const allPencatat   = await prisma.pencatat.findMany();
  const cachePencatat = new Map<string, string>();
  allPencatat.forEach((p: (typeof allPencatat)[0]) => cachePencatat.set(p.namaLapangan, p.id));

  let stats = { inserted: 0, updated: 0, skip: 0 };

  await inBatches(rows, 500, async (batch: Record<string, string>[]) => {
    for (const row of batch) {
      const nolg = normalizeNolg(row["No Pel"]);
      if (!nolg || nolg === "00000000000") { stats.skip++; continue; }

      const periode = parseInt(row["Periode"]);
      if (!periode || isNaN(periode)) { stats.skip++; continue; }

      const pencatatNama = normalizePencatat(row["kd_petugas"]);
      const pencatatId   = pencatatNama ? (cachePencatat.get(pencatatNama) ?? null) : null;

      const persentase = row["persentase"] && row["persentase"] !== ""
        ? parseInt(row["persentase"])
        : null;

      const existing = await prisma.laporanHarianPetugas.findUnique({
        where: { nomorLangganan_periode: { nomorLangganan: nolg, periode } },
      });

      if (existing) {
        await prisma.laporanHarianPetugas.update({
          where: { id: existing.id },
          data: {
            standAwal:     parseInt(row["St AWAL"]) || 0,
            standAkhir:    parseInt(row["St Akhir"]) || 0,
            pemakaian:     parseInt(row["Pakai"]) || 0,
            pemakaianLalu: row["Pakai Lau"] ? parseInt(row["Pakai Lau"]) : null,
            persentase,
            kondisi:       mapKondisi(row["Nm_Kel"]),
            kategori:      mapKategori(row["Zona Wil"]),
            nomorMeter:    row["kd_wm"]?.trim() || null,
            pencatatId,
            tanggalCatat:  parseDate(row["tgl_catat"]),
            tanggalUpload: parseDate(row["tgl_upload"]),
          },
        });
        stats.updated++;
      } else {
        await prisma.laporanHarianPetugas.create({
          data: {
            nomorLangganan: nolg,
            periode,
            standAwal:     parseInt(row["St AWAL"]) || 0,
            standAkhir:    parseInt(row["St Akhir"]) || 0,
            pemakaian:     parseInt(row["Pakai"]) || 0,
            pemakaianLalu: row["Pakai Lau"] ? parseInt(row["Pakai Lau"]) : null,
            persentase,
            kondisi:       mapKondisi(row["Nm_Kel"]),
            kategori:      mapKategori(row["Zona Wil"]),
            nomorMeter:    row["kd_wm"]?.trim() || null,
            pencatatId,
            tanggalCatat:  parseDate(row["tgl_catat"]),
            tanggalUpload: parseDate(row["tgl_upload"]),
          },
        });
        stats.inserted++;
      }
    }
  });

  log("03-LAPDATAMETER", `✓ Insert: ${stats.inserted}, Update: ${stats.updated}, Skip: ${stats.skip}`);
}