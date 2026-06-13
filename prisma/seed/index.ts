// seed/index.ts
// Entry point seed script Tirtacater
// Jalankan: npx tsx prisma/seed/index.ts
// Jalankan fase tertentu: SEED_PHASE=02 npx tsx prisma/seed/index.ts

import { prisma } from "./client";
import { seedReferensi }    from "./01-referensi";
import { seedProgresCater } from "./02-progrescater";
import { seedLapdatameter } from "./03-lapdatameter";
import { seedPBPK }         from "./04-pbpk";
import { seedRNomor }       from "./05-rnomor";

const CSV = {
  progresCater: process.env.PROGRESCATER_CSV ?? "./data/ProgresCater-PW5.csv",
  lapdatameter: process.env.LAPDATAMETER_CSV ?? "./data/lapdatametertes.csv",
  pbpk:         process.env.PBPK_CSV         ?? "./data/PBPK202605-PW5.csv",
  rNomor:       process.env.RNOMOR_CSV        ?? "./data/r-nomor.csv",
};

async function main() {
  const onlyPhase = process.env.SEED_PHASE;

  console.log("============================================================");
  console.log(" TIRTACATER — SEED SCRIPT");
  console.log(` Database URL: ${process.env.DATABASE_URL ? "TERDETEKSI" : "TIDAK DITEMUKAN!"}`);
  console.log(` Started: ${new Date().toISOString()}`);
  console.log("============================================================\n");

  const phases = [
    { id: "01", label: "Referensi",    fn: () => seedReferensi() },
    { id: "02", label: "ProgresCater", fn: () => seedProgresCater(CSV.progresCater) },
    { id: "03", label: "Lapdatameter", fn: () => seedLapdatameter(CSV.lapdatameter) },
    { id: "04", label: "PBPK",         fn: () => seedPBPK(CSV.pbpk) },
    { id: "05", label: "R-Nomor",      fn: () => seedRNomor(CSV.rNomor) },
  ];

  for (const phase of phases) {
    if (onlyPhase && phase.id !== onlyPhase) continue;

    const start = Date.now();
    console.log(`\n▶ [${phase.id}] ${phase.label}`);

    try {
      await phase.fn();
      console.log(`✓ [${phase.id}] Selesai dalam ${((Date.now() - start) / 1000).toFixed(1)}s`);
    } catch (err) {
      console.error(`✗ [${phase.id}] ERROR:`, err);
      process.exit(1);
    }
  }

  console.log("\n============================================================");
  console.log(` Finished: ${new Date().toISOString()}`);
  console.log("============================================================");
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });