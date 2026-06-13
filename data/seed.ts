/**
 * seed.ts — Tirtacater / mytirta
 *
 * Urutan eksekusi (dependency order):
 *  1. WilayahAdm
 *  2. WilayahDist
 *  3. WilayahSeksi
 *  4. Zona
 *  5. SeksiCater
 *  6. Rute
 *  7. Kecamatan
 *  8. Kelurahan
 *  9. TarifGolongan
 * 10. Pencatat
 * 11. Pelanggan  ← dari ProgresCater-PW5.csv
 * 12. Meter      ← dari ProgresCater-PW5.csv
 * 13. LaporanHarianPetugas ← dari lapdatametertes.csv
 * 14. MutasiPelanggan      ← dari PBPK (inline di bawah)
 * 15. Pemutusan            ← dari r-nomor (inline di bawah)
 *
 * Jalankan:
 *   npx tsx prisma/seed.ts
 * atau tambahkan ke package.json:
 *   "prisma": { "seed": "tsx prisma/seed.ts" }
 * lalu: npx prisma db seed
 */

import { PrismaClient } from "../src/generated/prisma";
import * as fs from "fs";
import * as path from "path";


const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseCsvSemicolon(filepath: string): Record<string, string>[] {
  const raw = fs.readFileSync(filepath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const headers = lines[0].split(";").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const vals = line.split(";").map((v) => v.trim().replace(/^"|"$/g, "").replace(/^\t/, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = vals[i] ?? ""));
    return obj;
  });
}

/** Konversi Excel date serial float ke Date. "46168.26" → 2026-05-01 */
function excelSerialToDate(serial: string | number): Date | null {
  const n = typeof serial === "string" ? parseFloat(serial) : serial;
  if (isNaN(n) || n < 1) return null;
  const excelEpoch = new Date(1899, 11, 30);
  excelEpoch.setDate(excelEpoch.getDate() + Math.floor(n));
  return excelEpoch;
}

/** Parse tanggal fleksibel: "2026-05-01 07:42:26", "4/8/2026", "5/6/2026" */
function parseDate(val: string): Date | null {
  if (!val || val.trim() === "") return null;
  const v = val.trim();
  // Format: M/D/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v)) {
    const [m, d, y] = v.split("/").map(Number);
    return new Date(y, m - 1, d);
  }
  // ISO atau datetime
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/** thbl 202605 → periode Int */
function thblToPeriode(thbl: string): number {
  return parseInt(thbl, 10);
}

/** Map kode golongan tarif legacy → enum GolonganTarif */
function mapTarif(kode: string): string {
  const map: Record<string, string> = {
    "1A": "GOL_1A", "1B": "GOL_1B",
    "2A1": "GOL_2A1", "2A2": "GOL_2A2", "2A3": "GOL_2A3",
    "2A4": "GOL_2A4", "2A5": "GOL_2A5",
    "2B": "GOL_2B",
    "3A": "GOL_3A", "3B": "GOL_3B", "3C": "GOL_3C",
    "4A": "GOL_4A", "4B": "GOL_4B",
  };
  return map[kode.trim()] ?? "GOL_2A2";
}

/** Map ukuran meter → enum UkuranMeter */
function mapUkuran(val: string): string {
  const v = val.trim().toUpperCase();
  if (v === "A" || v === "1/2") return "INCH_HALF";
  if (v === "1") return "INCH_1";
  if (v === "1 1/2" || v === "1.5") return "INCH_1_HALF";
  if (v === "2") return "INCH_2";
  if (v === "3") return "INCH_3";
  if (v === "4") return "INCH_4";
  return "INCH_HALF";
}

/** Map ketcatat/Nm_Kel → enum KondisiCatat */
function mapKondisi(val: string): string {
  const v = val.trim().toUpperCase();
  const map: Record<string, string> = {
    "NORMAL": "NORMAL",
    "TIDAK DIPAKAI": "TIDAK_DIPAKAI",
    "RUMAH KOSONG": "RUMAH_KOSONG",
    "STAND-KONSUMEN": "STAND_KONSUMEN",
    "STAND KONSUMEN": "STAND_KONSUMEN",
    "STAND TEMPEL": "STAND_TEMPEL",
    "METER RUSAK": "METER_RUSAK",
    "METER MATI ADA AIR": "METER_MATI_ADA_AIR",
    "METER MUNDUR": "METER_MUNDUR",
    "METER TERBALIK": "METER_TERBALIK",
    "METER DALAM AIR": "METER_DALAM_AIR",
    "LOS METER": "LOS_METER",
    "BMK BMB": "BMK_BMB",
    "TTB": "TTB",
    "MTA": "MTA",
    "TERHALANG": "TERHALANG",
    "TIDAK ADA AIR": "TIDAK_ADA_AIR",
    "ADA ANJING": "ADA_ANJING",
    "DK": "DK",
    "MB": "MB",
    "MUDA KEMBALI": "MUDA_KEMBALI",
    "REV PENCATAT": "REV_PENCATAT",
    "DICABUT": "DICABUT",
  };
  return map[v] ?? "NORMAL";
}

/** Map mutasinama → StatusPelanggan */
function mapStatus(mutasinama: string): string {
  const v = mutasinama.trim().toLowerCase();
  if (v === "tupsm") return "TUTUP_SEMENTARA";
  if (v === "tupsp") return "TUTUP_SPT";
  if (v === "pelanggan aktif") return "AKTIF";
  return "AKTIF";
}

// ─── 1. WilayahAdm ──────────────────────────────────────────────────────────

const WILAYAH_ADM = [
  { kode: "K", nama: "KAREES" },
  { kode: "C", nama: "CIBEUNYING" },
  { kode: "T", nama: "TEGALLEGA" },
  { kode: "B", nama: "BOJONEGARA" },
];

// ─── 2. WilayahDist (kode→wiladmKode dari CSV) ──────────────────────────────

const WILAYAH_DIST: { kode: string; nama: string; admKode: string }[] = [
  { kode: "S", nama: "BARAT 2", admKode: "K" }, // K;S, C;S, T;S → assign ke K (dominan)
  { kode: "B", nama: "BARAT 1", admKode: "B" },
  { kode: "T", nama: "TIMUR",   admKode: "K" },
  { kode: "U", nama: "UTARA",   admKode: "C" },
];

// ─── 3. WilayahSeksi (dari CSV) ─────────────────────────────────────────────

const WILAYAH_SEKSI: { kode: string; nama: string; distKode: string }[] = [
  { kode: "B02", nama: "WIL BARAT 2", distKode: "B" },
  { kode: "B03", nama: "WIL BARAT 3", distKode: "S" },
  { kode: "B04", nama: "WIL BARAT 4", distKode: "B" },
  { kode: "B05", nama: "WIL BARAT 5", distKode: "B" },
  { kode: "T01", nama: "WIL TIMUR 1", distKode: "S" },
  { kode: "T02", nama: "WIL TIMUR 2", distKode: "S" },
  { kode: "T03", nama: "WIL TIMUR 3", distKode: "S" },
  { kode: "U01", nama: "WIL UTARA 1", distKode: "U" },
  { kode: "U03", nama: "WIL UTARA 3", distKode: "U" },
];

// ─── 4. Zona (dari CSV) ─────────────────────────────────────────────────────

// Mapping zona → wilseksi (first occurrence dari CSV)
const ZONA_TO_WILSEKSI: Record<string, string> = {
  B02:"B02", B05:"B02", B23:"B02", B24:"B02", B26:"B02",
  B27:"B02", B28:"B02", B29:"B02", B30:"B02", B32:"B02",
  T01:"T01", T04:"T01",
  B04:"B03", B06:"B03", B22:"B03",
  T03:"T03",
  B25:"B05", B31:"B05", B33:"B05", B34:"B05",
  U09:"U01",
};

const ZONA_NAMA: Record<string, string> = {
  B02:"BSP02", B04:"BSP05 BARAT 2 BAWAH", B05:"BSP06 BARAT 2",
  B06:"BSP06 BARAT 2", B22:"SPAM TEGALEGA", B23:"ST CIJAGRA",
  B24:"ST CIKAWAO", B25:"ST DJUANDA", B26:"ST GURAME",
  B27:"ST KANCRA", B28:"ST TAMBLONG", B29:"BSP06 BARAT 2",
  B30:"ST MUTUMANIKAM", B31:"ST NILEM", B32:"ST SITUSARI",
  B33:"ST SULANJANA", B34:"ST SURYALAYA", T01:"ST TAMBLONG",
  T03:"BSP05 BARAT 2", T04:"BSP06 BARAT 2", U09:"R12",
};

// ─── 5. SeksiCater ──────────────────────────────────────────────────────────

const SEKSI_CATER: { kode: string; nama: string; distKode: string }[] = [
  { kode: "C1", nama: "WIL CATER 1", distKode: "S" },
  { kode: "C4", nama: "WIL CATER 4", distKode: "S" },
  { kode: "C5", nama: "WIL CATER 5", distKode: "S" },
];

// ─── 6. Kecamatan & Kelurahan (dari CSV) ────────────────────────────────────

const KECAMATAN: { kode: string; nama: string }[] = [
  { kode: "KD", nama: "REGOL" },
  { kode: "KC", nama: "LENGKONG" },
  { kode: "BD", nama: "ANDIR" },
  { kode: "CD", nama: "SUMUR BANDUNG" },
  { kode: "CC", nama: "BANDUNG WETAN" },
  { kode: "TA", nama: "ASTANA ANYAR" },
  { kode: "TC", nama: "BOJONGLOA KIDUL" },
];

const KELURAHAN: { kode: string; nama: string; kecKode: string }[] = [
  { kode:"KD1", nama:"PASIRLUYU",    kecKode:"KD" },
  { kode:"KD2", nama:"CIATEUL",      kecKode:"KD" },
  { kode:"KD3", nama:"CIGERELENG",   kecKode:"KD" },
  { kode:"KD4", nama:"ANCOL",        kecKode:"KD" },
  { kode:"KD5", nama:"PUNGKUR",      kecKode:"KD" },
  { kode:"KD6", nama:"BALONGGEDE",   kecKode:"KD" },
  { kode:"KD7", nama:"CISEUREUH",    kecKode:"KD" },
  { kode:"KC2", nama:"CIKAWAO",      kecKode:"KC" },
  { kode:"KC3", nama:"CIJAGRA",      kecKode:"KC" },
  { kode:"KC5", nama:"BURANGRANG",   kecKode:"KC" },
  { kode:"BD5", nama:"KEBON JERUK",  kecKode:"BD" },
  { kode:"CD1", nama:"BRAGA",        kecKode:"CD" },
  { kode:"CD3", nama:"BABAKAN CIAMIS",kecKode:"CD" },
  { kode:"CC2", nama:"TAMANSARI",    kecKode:"CC" },
  { kode:"TA1", nama:"PELINDUNG HEWAN", kecKode:"TA" },
  { kode:"TA2", nama:"PANJUNAN",     kecKode:"TA" },
  { kode:"TA4", nama:"KARASAK",      kecKode:"TA" },
  { kode:"TA5", nama:"NYENGSERET",   kecKode:"TA" },
  { kode:"TA6", nama:"KARANGANYAR",  kecKode:"TA" },
  { kode:"TC1", nama:"SITUSAEUR",    kecKode:"TC" },
  { kode:"TC2", nama:"KEBON LEGA",   kecKode:"TC" },
];

// ─── 7. TarifGolongan ───────────────────────────────────────────────────────

const TARIF_GOLONGAN = [
  { kode:"GOL_1A",  kodeAsli:"1A",  nama:"SOS.UMUM/CORSEN/R.IBADAH",    kategori:"Sosial" },
  { kode:"GOL_1B",  kodeAsli:"1B",  nama:"SOSIAL KHUSUS",                kategori:"Sosial" },
  { kode:"GOL_2A1", kodeAsli:"2A1", nama:"RMH.TANGGA GOL.A1",            kategori:"Rumah Tangga" },
  { kode:"GOL_2A2", kodeAsli:"2A2", nama:"RMH.TANGGA GOL.A2",            kategori:"Rumah Tangga" },
  { kode:"GOL_2A3", kodeAsli:"2A3", nama:"RMH.TANGGA GOL.A3",            kategori:"Rumah Tangga" },
  { kode:"GOL_2A4", kodeAsli:"2A4", nama:"RMH.TANGGA GOL.A4",            kategori:"Rumah Tangga" },
  { kode:"GOL_2A5", kodeAsli:"2A5", nama:"RMH.TANGGA GOL.A5",            kategori:"Rumah Tangga" },
  { kode:"GOL_2B",  kodeAsli:"2B",  nama:"INSTANSI PEMERINTAH",          kategori:"Pemerintah" },
  { kode:"GOL_3A",  kodeAsli:"3A",  nama:"NIAGA KECIL",                  kategori:"Niaga" },
  { kode:"GOL_3B",  kodeAsli:"3B",  nama:"NIAGA MENENGAH/BESAR",         kategori:"Niaga" },
  { kode:"GOL_3C",  kodeAsli:"3C",  nama:"NIAGA",                        kategori:"Niaga" },
  { kode:"GOL_4A",  kodeAsli:"4A",  nama:"INDUSTRI KECIL",               kategori:"Industri" },
  { kode:"GOL_4B",  kodeAsli:"4B",  nama:"IND.MNGH/BESAR/PERKANTORAN",   kategori:"Industri" },
];

// ─── r-nomor (inline) ───────────────────────────────────────────────────────

const R_NOMOR_RAW = `202605;TSM;902500750;ARIES DJOEHANI;017/TSM/04/2026;4/8/2026;;;;5/6/2026
202605;TSM;406150314;H.DEDEN FUAD NURRACHADIAN;010/TSM/04/2026;4/6/2026;;;;5/6/2026
202605;TSM;401300870;IE TJIONG KIE;004/TSM/04/2026;4/2/2026;;;;5/6/2026
202605;TSM;904911890;IR.SURYA S;025/TSM/04/2026;4/10/2026;;;;5/6/2026
202605;TSM;900900719;K O M A R;037/TSM/03/2026;3/31/2026;;;;5/6/2026
202605;TSM;804500350;LIM KWIE HIN;036/TSM/04/2026;4/14/2026;;;;5/6/2026
202605;TSM;904690085;THENG BIE FA;026/TSM/04/2026;4/10/2026;;;;5/6/2026
202605;TSM;704200550;TOKO ENG SIN;022/TSM/03/2026;3/13/2026;;;;5/6/2026
202605;TSM;901330102;TURIJAH;009/TSM/04/2026;4/6/2026;;;;5/6/2026
202605;TSM;401200330;WILLIAM JUNG;038/TSM/04/2026;4/15/2026;;;;5/6/2026
202605;SPT;403520485;SACADINATA;;;5/20/2026;19616/SPT/02/2025;2/12/2025;4/13/2026
202605;SPT;903330170;H.M.YUNUS;;;5/20/2026;52594/SPT/06/2025;6/23/2025;4/13/2026
202605;SPT;904800764;TARKIPRIYATNA;;;5/20/2026;21259/SPT/02/2024;2/5/2024;4/13/2026
202605;SPT;907000990;SARIPUDIN;;;5/20/2026;27355/SPT/02/2024;2/13/2024;4/13/2026
202605;SPT;908220265;TITI SUMIATI;;;5/20/2026;07448/SPT/04/2026;4/10/2026;4/13/2026
202605;SPT;908220270;R O C H A Y A N I;;;5/20/2026;07442/SPT/04/2026;4/10/2026;4/13/2026
202605;SPT;908220280;CUCU HERMAWAN;;;5/20/2026;07441/SPT/04/2026;4/10/2026;4/13/2026
202605;SPT;908220300;NY.REDI SUKARNA;;;5/20/2026;07449/SPT/04/2026;4/10/2026;4/13/2026
202605;SPT;908220395;YANA MULYANA;;;5/20/2026;07440/SPT/04/2026;4/10/2026;4/13/2026`;

function parseRNomor() {
  return R_NOMOR_RAW.trim().split("\n").map((line) => {
    const [periode, jenis, nolg, , noSurat, tglPermohonan, tglTutup, noSPT, tglSPT, tglCabut] =
      line.split(";");
    return {
      periode: parseInt(periode),
      jenis: jenis as "TSM" | "SPT",
      nomorLangganan: nolg.padStart(11, "0"),
      nomorSurat: noSurat || null,
      tanggalPermohonan: parseDate(tglPermohonan),
      tanggalTutup: parseDate(tglTutup),
      nomorSPT: noSPT || null,
      tanggalSPT: parseDate(tglSPT),
      tanggalCabut: parseDate(tglCabut),
    };
  });
}

// ─── PBPK (inline) ──────────────────────────────────────────────────────────

const PBPK_RAW = `00406100935;00406100935;ANANTA BUDHI DANURDARA;KC;KC3;1;4;SURYALAYA I NO 3 RT.01/04;08122393919;3;A26S-025053;ITR;A;46168.26528;1;S;KC304;170717;;;KC30401;2A4;0;PB
00904900667;00904900667;DANY TAUFIK KURNIAWAN;TA;TA4;4;1;GG.H.KURDI II NO 15 RT.04/01;00000;4;A26S-025112;ITR;A;46168.26389;1;S;TA401;170717;;;TA40104;2A2;0;PB
00801800171;00801800171;DEVIA RISKA ANGGRIANI;KC;KC2;5;9;PANGARANG DALAM II NO S/5 RT.05/09;000;2;A26S-025105;ITR;A;46168.2625;1;S;KC208;170717;;;KC20905;2A2;0;PB
00904700458;00904700458;DWIVANE RAYGHIFFARY RAMADHAN;KD;KD3;2;7;MADURASA TENGAH 24A RT.02/07;0000;4;A26S-025060;ITR;A;46168.26458;1;S;KD307;170717;;;KD30702;2A2;0;PB
00802100540;00802100540;HILDA KUSMIATI;KD;KD6;2;4;GG.WAKAF 82/18A RT.02/04;-;3;025111;ITR;A;29230;1;S;KD610;170717;;;KD60402;2A1;3426;PK
00401600683;00401600683;HWIE NIO;KD;KD5;5;5;GG PARTADISASTRA RT 05/05 RT.05/05;089635546600;3;A26S-025054;ITR;A;46168.26597;1;S;KD505;170717;;;KD50505;2A3;0;PB
00404101010;00404101010;IBU IROS;KD;KD2;7;8;KOTA BARU VI NO.15 RT.07/08;;0;024944;ITR;A;31386;1;S;KD214;170717;;;KD20807;2A3;38;PK
00800801211;00800801211;KOPERASI UMKM RW 08;CD;CD1;6;8;JL CIKAPUNDUNG NO 05 RT.06/08;082261284937;1;A26S-024946;ITR;A;46168.2625;1;S;CD107;170717;;;CD10806;1B;0;PB
00800800787;00800800787;LILY FARIANISETIAWAN;CD;CD1;5;7;GG. BANCEUY NO 28A/13C RT.05/07;0000;3;A26S-025114;ITR;A;46168.26181;1;S;CD107;170717;;;CD10705;2A2;0;PB
00209301938;00209301938;PERI GUNAWAN;TC;TC1;9;4;LEUWI ANYAR VIII RT 9/4 RT.09/04;085220169281;2;A26S-025113;ITR;A;46168.26528;1;S;TC104;170717;;;TC10409;2A3;0;PB
00906550788;00906550788;REYNALD STEFLYANDO;TC;TC2;8;1;LEUWISARI VIII 5A RT.08/01;0000;2;A26S-025104;ITR;A;46168.26319;1;S;TC201;170717;;;TC20108;2A2;0;PB`;

function parsePBPK() {
  const headers = "nolg;nolangganan;nama;kd_kecamatan;kd_kelurahan;rt;rw;alamat;notelp;jmlpenghuni;nometer;kd_merkmeter;kd_ukmeter;tglaktif;sta_aktif;wilayah;kd_rute;updater;geo_long;geo_lat;kode_wilayah;kd_goltarif;no_urutrute;mutasian".split(";");
  return PBPK_RAW.trim().split("\n").map((line) => {
    const vals = line.split(";");
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (vals[i] ?? "").trim()));
    return obj;
  });
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Mulai seeding Tirtacater...\n");

  // ── 1. WilayahAdm ──────────────────────────────────────────────────────────
  console.log("  [1/14] WilayahAdm...");
  const admMap = new Map<string, string>(); // kode → id
  for (const a of WILAYAH_ADM) {
    const rec = await prisma.wilayahAdm.upsert({
      where: { kode: a.kode },
      update: { nama: a.nama },
      create: { kode: a.kode, nama: a.nama },
    });
    admMap.set(a.kode, rec.id);
  }

  // ── 2. WilayahDist ─────────────────────────────────────────────────────────
  console.log("  [2/14] WilayahDist...");
  const distMap = new Map<string, string>(); // kode → id
  for (const d of WILAYAH_DIST) {
    const admId = admMap.get(d.admKode)!;
    const rec = await prisma.wilayahDist.upsert({
      where: { kode: d.kode },
      update: { nama: d.nama, wilayahAdmId: admId },
      create: { kode: d.kode, nama: d.nama, wilayahAdmId: admId },
    });
    distMap.set(d.kode, rec.id);
  }

  // ── 3. WilayahSeksi ────────────────────────────────────────────────────────
  console.log("  [3/14] WilayahSeksi...");
  const wilseksiMap = new Map<string, string>(); // kode → id
  for (const ws of WILAYAH_SEKSI) {
    const distId = distMap.get(ws.distKode)!;
    const rec = await prisma.wilayahSeksi.upsert({
      where: { kode: ws.kode },
      update: { nama: ws.nama, wilayahDistId: distId },
      create: { kode: ws.kode, nama: ws.nama, wilayahDistId: distId },
    });
    wilseksiMap.set(ws.kode, rec.id);
  }

  // ── 4. Zona ────────────────────────────────────────────────────────────────
  console.log("  [4/14] Zona...");
  const zonaMap = new Map<string, string>(); // kode → id
  for (const [kode, wsKode] of Object.entries(ZONA_TO_WILSEKSI)) {
    const wsId = wilseksiMap.get(wsKode);
    if (!wsId) continue;
    const nama = ZONA_NAMA[kode] ?? kode;
    const rec = await prisma.zona.upsert({
      where: { kode },
      update: { nama, wilayahSeksiId: wsId },
      create: { kode, nama, wilayahSeksiId: wsId },
    });
    zonaMap.set(kode, rec.id);
  }

  // ── 5. SeksiCater ──────────────────────────────────────────────────────────
  console.log("  [5/14] SeksiCater...");
  const seksiMap = new Map<string, string>(); // kode → id
  for (const sc of SEKSI_CATER) {
    const distId = distMap.get(sc.distKode)!;
    const rec = await prisma.seksiCater.upsert({
      where: { kode: sc.kode },
      update: { nama: sc.nama, wilayahDistId: distId },
      create: { kode: sc.kode, nama: sc.nama, wilayahDistId: distId },
    });
    seksiMap.set(sc.kode, rec.id);
  }

  // ── 6. Rute (dari ProgresCater) ────────────────────────────────────────────
  console.log("  [6/14] Rute (125 rute)...");
  const progres = parseCsvSemicolon(
    path.resolve(__dirname, "../data/ProgresCater-PW5.csv")
  );

  // Bangun mapping rute → seksiCater dari CSV
  const ruteSeksiRaw = new Map<string, string>();
  for (const row of progres) {
    if (row.rute_kode && row.caterseksikode) {
      ruteSeksiRaw.set(row.rute_kode.trim(), row.caterseksikode.trim());
    }
  }

  const ruteMap = new Map<string, string>(); // kode → id
  for (const [ruteKode, seksiKode] of ruteSeksiRaw) {
    const seksiId = seksiMap.get(seksiKode);
    if (!seksiId) continue;
    const rec = await prisma.rute.upsert({
      where: { kode: ruteKode },
      update: { seksiCaterId: seksiId },
      create: { kode: ruteKode, seksiCaterId: seksiId },
    });
    ruteMap.set(ruteKode, rec.id);
  }

  // ── 7. Kecamatan ───────────────────────────────────────────────────────────
  console.log("  [7/14] Kecamatan...");
  const kecMap = new Map<string, string>(); // kode → id
  for (const kec of KECAMATAN) {
    const rec = await prisma.kecamatan.upsert({
      where: { kode: kec.kode },
      update: { nama: kec.nama },
      create: { kode: kec.kode, nama: kec.nama },
    });
    kecMap.set(kec.kode, rec.id);
  }

  // ── 8. Kelurahan ───────────────────────────────────────────────────────────
  console.log("  [8/14] Kelurahan...");
  const kelMap = new Map<string, string>(); // kode → id
  for (const kel of KELURAHAN) {
    const kecId = kecMap.get(kel.kecKode)!;
    const rec = await prisma.kelurahan.upsert({
      where: { kode: kel.kode },
      update: { nama: kel.nama, kecamatanId: kecId },
      create: { kode: kel.kode, nama: kel.nama, kecamatanId: kecId },
    });
    kelMap.set(kel.kode, rec.id);
  }

  // ── 9. TarifGolongan ───────────────────────────────────────────────────────
  console.log("  [9/14] TarifGolongan...");
  const tarifMap = new Map<string, string>(); // kodeAsli → id
  for (const t of TARIF_GOLONGAN) {
    const rec = await prisma.tarifGolongan.upsert({
      where: { kode: t.kode as any },
      update: { nama: t.nama, kategori: t.kategori },
      create: {
        kode: t.kode as any,
        kodeAsli: t.kodeAsli,
        nama: t.nama,
        kategori: t.kategori,
      },
    });
    tarifMap.set(t.kodeAsli, rec.id);
  }

  // ── 10. Pencatat ───────────────────────────────────────────────────────────
  console.log("  [10/14] Pencatat...");
  const PETUGAS = ["OMAY","AGUS","DIDIN","PERIYADI","DANI","IWAN","DADANG","RUDY","EDI"];
  const pencatatMap = new Map<string, string>(); // namaLapangan → id
  for (const nama of PETUGAS) {
    const rec = await prisma.pencatat.upsert({
      where: { namaLapangan: nama },
      update: {},
      create: { namaLapangan: nama },
    });
    pencatatMap.set(nama, rec.id);
  }

  // ── 11. Pelanggan (dari ProgresCater) ──────────────────────────────────────
  console.log(`  [11/14] Pelanggan (${progres.length} baris)...`);
  const pelangganMap = new Map<string, string>(); // nomorLangganan → id

  // Proses per batch untuk menghindari timeout
  const BATCH = 500;
  for (let i = 0; i < progres.length; i += BATCH) {
    const batch = progres.slice(i, i + BATCH);
    for (const row of batch) {
      const nolg = row.nolg?.trim().padStart(11, "0");
      if (!nolg) continue;

      const tarifKode = row.trp?.trim();
      const tarifId = tarifKode ? tarifMap.get(tarifKode) : undefined;
      const ruteKode = row.rute_kode?.trim();
      const ruteId = ruteKode ? ruteMap.get(ruteKode) : undefined;
      const seksiKode = row.caterseksikode?.trim();
      const seksiId = seksiKode ? seksiMap.get(seksiKode) : undefined;
      const zonaKode = row.zonakode?.trim();
      const zonaId = zonaKode ? zonaMap.get(zonaKode) : undefined;
      const kecKode = row.kdkec?.trim();
      const kecId = kecKode ? kecMap.get(kecKode) : undefined;
      const kelKode = row.kdkel?.trim();
      const kelId = kelKode ? kelMap.get(kelKode) : undefined;

      const status = mapStatus(row.mutasinama ?? "");
      const ismbr = row.ismbr?.trim().toLowerCase() === "t";

      const rec = await prisma.pelanggan.upsert({
        where: { nomorLangganan: nolg },
        update: {
          nama: row.nama?.trim() ?? "",
          alamat: row.almt?.trim() ?? "",
          rt: row.rt?.trim() || null,
          rw: row.rw?.trim() || null,
          notelp: row.notelp?.trim() || null,
          status: status as any,
          isMBR: ismbr,
          kodeMBR: ismbr ? (row.mbr?.trim() || null) : null,
          tarifGolonganId: tarifId ?? null,
          ruteId: ruteId ?? null,
          seksiCaterId: seksiId ?? null,
          zonaId: zonaId ?? null,
          kecamatanId: kecId ?? null,
          kelurahanId: kelId ?? null,
          nomorPersil: row.nprs?.trim() ?? "",
        },
        create: {
          nomorLangganan: nolg,
          nomorPersil: row.nprs?.trim() ?? "",
          nama: row.nama?.trim() ?? "",
          alamat: row.almt?.trim() ?? "",
          rt: row.rt?.trim() || null,
          rw: row.rw?.trim() || null,
          notelp: row.notelp?.trim() || null,
          status: status as any,
          isMBR: ismbr,
          kodeMBR: ismbr ? (row.mbr?.trim() || null) : null,
          tarifGolonganId: tarifId ?? null,
          ruteId: ruteId ?? null,
          seksiCaterId: seksiId ?? null,
          zonaId: zonaId ?? null,
          kecamatanId: kecId ?? null,
          kelurahanId: kelId ?? null,
        },
      });
      pelangganMap.set(nolg, rec.id);
    }
    console.log(`    → ${Math.min(i + BATCH, progres.length)} / ${progres.length}`);
  }

  // ── 12. Meter (dari ProgresCater) ──────────────────────────────────────────
  console.log("  [12/14] Meter...");
  // nomorMeter bisa duplikat — kita upsert berdasarkan pelangganId (1-to-1)
  // Untuk duplikat nomorMeter, isAktif = false untuk yang sudah diganti
  const seenMeter = new Set<string>(); // nomorMeter unik yg sudah aktif
  let meterCount = 0;

  for (const row of progres) {
    const nolg = row.nolg?.trim().padStart(11, "0");
    const pelangganId = pelangganMap.get(nolg);
    if (!pelangganId) continue;

    const nomorMeter = row.nometer?.trim();
    if (!nomorMeter) continue;

    const isAktif = !seenMeter.has(nomorMeter);
    if (isAktif) seenMeter.add(nomorMeter);

    const tglPasang = row.tglpasangmeter ? parseDate(row.tglpasangmeter) : null;
    const ukuran = mapUkuran(row.ukmeter ?? "A");
    const merkKode = row.kd_merkmeter?.trim().toUpperCase() || null;

    await prisma.meter.upsert({
      where: { pelangganId },
      update: {
        nomorMeter,
        merkKode,
        ukuran: ukuran as any,
        tanggalPasang: tglPasang,
        umurTahun: row.umurmeterthn ? parseInt(row.umurmeterthn) || null : null,
        umurBulan: row.umurmeterbln ? parseInt(row.umurmeterbln) || null : null,
        nomorSegel: row.nosegelmeter?.trim() || null,
        isAktif,
      },
      create: {
        pelangganId,
        nomorMeter,
        merkKode,
        ukuran: ukuran as any,
        tanggalPasang: tglPasang,
        umurTahun: row.umurmeterthn ? parseInt(row.umurmeterthn) || null : null,
        umurBulan: row.umurmeterbln ? parseInt(row.umurmeterbln) || null : null,
        nomorSegel: row.nosegelmeter?.trim() || null,
        isAktif,
      },
    });
    meterCount++;
  }
  console.log(`    → ${meterCount} meter diproses`);

  // ── 13. LaporanHarianPetugas (dari lapdatametertes.csv) ────────────────────
  console.log("  [13/14] LaporanHarianPetugas...");
  const laporan = parseCsvSemicolon(
    path.resolve(__dirname, "../data/lapdatametertes.csv")
  );

  let lapCount = 0;
  for (let i = 0; i < laporan.length; i += BATCH) {
    const batch = laporan.slice(i, i + BATCH);
    for (const row of batch) {
      const nolg = row["No Pel"]?.trim().replace(/^\t/, "").padStart(11, "0");
      if (!nolg) continue;

      const periode = thblToPeriode(row["Periode"]?.trim() ?? "0");
      if (!periode) continue;

      const pencatatNama = row["kd_petugas"]?.trim().toUpperCase();
      const pencatatId =
        pencatatNama && pencatatNama !== "-"
          ? pencatatMap.get(pencatatNama) ?? null
          : null;

      const kondisi = mapKondisi(row["Nm_Kel"] ?? "NORMAL");
      const kategori =
        row["Wil"]?.trim() === "S" ? "ONSITE" : "OFFSITE";

      const tglCatat = parseDate(row["tgl_catat"] ?? "");
      const tglUpload = parseDate(row["tgl_upload"] ?? "");

      await prisma.laporanHarianPetugas.upsert({
        where: {
          nomorLangganan_periode: { nomorLangganan: nolg, periode },
        },
        update: {
          standAwal: parseInt(row["St AWAL"] ?? "0") || 0,
          standAkhir: parseInt(row["St Akhir"] ?? "0") || 0,
          pemakaian: parseInt(row["Pakai"] ?? "0") || 0,
          pemakaianLalu: parseInt(row["Pakai Lau"] ?? "0") || null,
          persentase: parseInt(row["persentase"] ?? "0") || null,
          kondisi: kondisi as any,
          kategori: kategori as any,
          nomorMeter: row["kd_wm"]?.trim() || null,
          pencatatId,
          tanggalCatat: tglCatat,
          tanggalUpload: tglUpload,
        },
        create: {
          nomorLangganan: nolg,
          periode,
          standAwal: parseInt(row["St AWAL"] ?? "0") || 0,
          standAkhir: parseInt(row["St Akhir"] ?? "0") || 0,
          pemakaian: parseInt(row["Pakai"] ?? "0") || 0,
          pemakaianLalu: parseInt(row["Pakai Lau"] ?? "0") || null,
          persentase: parseInt(row["persentase"] ?? "0") || null,
          kondisi: kondisi as any,
          kategori: kategori as any,
          nomorMeter: row["kd_wm"]?.trim() || null,
          pencatatId,
          tanggalCatat: tglCatat,
          tanggalUpload: tglUpload,
        },
      });
      lapCount++;
    }
    console.log(`    → ${Math.min(i + BATCH, laporan.length)} / ${laporan.length}`);
  }

  // ── 14a. MutasiPelanggan (dari PBPK) ───────────────────────────────────────
  console.log("  [14a/14] MutasiPelanggan (PBPK)...");
  const pbpkRows = parsePBPK();
  const PERIODE_FIXED = 202605;

  for (const row of pbpkRows) {
    const nolg = row.nolg.padStart(11, "0");
    let pelangganId = pelangganMap.get(nolg);

    if (!pelangganId) {
      const kecId = kecMap.get(row.kd_kecamatan) ?? null;
      const kelId = kelMap.get(row.kd_kelurahan) ?? null;
      const ruteId = ruteMap.get(row.kd_rute) ?? null;
      const tarifId = tarifMap.get(row.kd_goltarif) ?? null;

      const pel = await prisma.pelanggan.upsert({
        where: { nomorLangganan: nolg },
        update: {},
        create: {
          nomorLangganan: nolg,
          nomorPersil: nolg,
          nama: row.nama,
          alamat: row.alamat,
          rt: row.rt || null,
          rw: row.rw || null,
          notelp: row.notelp || null,
          jumlahPenghuni: parseInt(row.jmlpenghuni) || null,
          kecamatanId: kecId,
          kelurahanId: kelId,
          ruteId,
          tarifGolonganId: tarifId,
        },
      });
      pelangganId = pel.id;
      pelangganMap.set(nolg, pelangganId);
    }

    // Menggunakan UPSERT agar data tidak duplikat tetapi arsip tetap aman
    await prisma.mutasiPelanggan.upsert({
      where: {
        pelangganId_periode_jenis: {
          pelangganId,
          periode: PERIODE_FIXED,
          jenis: (row.mutasian === "PK" ? "PK" : "PB") as any,
        },
      },
      update: {
        nomorMeterBaru: row.nometer?.trim() || null,
        merkMeterBaru: row.kd_merkmeter?.trim().toUpperCase() || null,
        ukuranMeterBaru: mapUkuran(row.kd_ukmeter) as any,
        tarifBaru: mapTarif(row.kd_goltarif) as any,
        tanggalAktif: excelSerialToDate(row.tglaktif),
        statusAktif: parseInt(row.sta_aktif) || null,
        updaterKode: row.updater || null,
      },
      create: {
        pelangganId,
        jenis: (row.mutasian === "PK" ? "PK" : "PB") as any,
        periode: PERIODE_FIXED,
        nomorMeterBaru: row.nometer?.trim() || null,
        merkMeterBaru: row.kd_merkmeter?.trim().toUpperCase() || null,
        ukuranMeterBaru: mapUkuran(row.kd_ukmeter) as any,
        tarifBaru: mapTarif(row.kd_goltarif) as any,
        tanggalAktif: excelSerialToDate(row.tglaktif),
        statusAktif: parseInt(row.sta_aktif) || null,
        updaterKode: row.updater || null,
      },
    });
  }
  console.log(`    → ${pbpkRows.length} mutasi diproses.`);

  // ── 14b. Pemutusan (dari r-nomor) ──────────────────────────────────────────
  console.log("  [14b/14] Pemutusan (r-nomor)...");
  const rNomor = parseRNomor();

  let pemutusanCount = 0;
  for (const row of rNomor) {
    const nolg = row.nomorLangganan.padStart(11, "0");
    const pelangganId = pelangganMap.get(nolg);
    
    if (!pelangganId) {
      console.warn(`    ⚠ Pelanggan ${nolg} tidak ditemukan — lewati pemutusan`);
      continue;
    }

    // Menggunakan UPSERT untuk menjaga arsip tetap utuh
    await prisma.pemutusan.upsert({
      where: {
        pelangganId_periode_nomorSurat: {
          pelangganId,
          periode: row.periode,
          nomorSurat: row.nomorSurat ?? "TIDAK_ADA_SURAT",
        },
      },
      update: {
        tanggalTutup: row.tanggalTutup,
        tanggalCabut: row.tanggalCabut,
        nomorSPT: row.nomorSPT,
        tanggalSPT: row.tanggalSPT,
      },
      create: {
        pelangganId,
        jenis: row.jenis as any,
        periode: row.periode,
        nomorSurat: row.nomorSurat ?? "TIDAK_ADA_SURAT",
        tanggalPermohonan: row.tanggalPermohonan,
        tanggalTutup: row.tanggalTutup,
        nomorSPT: row.nomorSPT,
        tanggalSPT: row.tanggalSPT,
        tanggalCabut: row.tanggalCabut,
      },
    });
    pemutusanCount++;
  }
  console.log(`    → ${pemutusanCount} pemutusan diproses.`);

  // ── Footer ────────────────────────────────────────────────────────────────
  console.log("\n✅ Seeding selesai!");
  console.log(`   Pelanggan : ${pelangganMap.size}`);
  console.log(`   Mutasi    : ${pbpkRows.length}`);
  console.log(`   Pemutusan : ${pemutusanCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });