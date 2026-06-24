import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./lib/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const GATE_NAMES = ["Ümumi giriş (Post 3)", "Sahə girişi (Post 5)"];

async function main() {
  console.log("🚪 Creating gates...");

  for (const name of GATE_NAMES) {
    const existing = await prisma.gate.findFirst({ where: { name } });
    if (existing) {
      console.log(`   - "${name}" already exists, skipping`);
      continue;
    }

    const gate = await prisma.gate.create({ data: { name } });
    console.log(`   - Created "${gate.name}" (${gate.id})`);
  }

  console.log("✨ Done.");
}

main()
  .catch((e) => {
    console.error("❌ Error creating gates:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
