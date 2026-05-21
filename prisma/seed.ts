import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient, Role } from "./lib/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data (in reverse order of dependencies)
  // console.log("🧹 Cleaning existing data...");
  // await prisma.verification.deleteMany();
  // await prisma.session.deleteMany();
  // await prisma.account.deleteMany();
  // await prisma.user.deleteMany();

  // Create Users
  console.log("👤 Creating users...");
  const hashedPassword = await hashPassword("Password123!");

  // const user1 = await prisma.user.create({
  //   data: {
  //     email: "ebesirli@kolin.com.tr",
  //     name: "Elvin Bashirli",
  //     emailVerified: true,
  //     image: "",
  //     role: Role.ADMIN,
  //   },
  // });

  const terminal1 = await prisma.user.create({
    data: {
      email: "spp2-terminal-1@kolin.com.tr",
      name: "SPP2 Terminal 1",
      emailVerified: true,
      // image: "https://i.pravatar.cc/150?img=2",
      role: Role.TERMINAL,
    },
  });

  const terminal2 = await prisma.user.create({
    data: {
      email: "spp2-terminal-2@kolin.com.tr",
      name: "SPP2 Terminal 2",
      emailVerified: true,
      // image: "https://i.pravatar.cc/150?img=3",
      role: Role.TERMINAL,
    },
  });

  const terminal3 = await prisma.user.create({
    data: {
      email: "spp2-terminal-3@kolin.com.tr",
      name: "SPP2 Terminal 3",
      emailVerified: true,
      // image: "https://i.pravatar.cc/150?img=3",
      role: Role.TERMINAL,
    },
  });

  // Create Accounts (credentials provider)
  console.log("🔐 Creating accounts...");
  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: terminal1.id,
      providerId: "credential",
      userId: terminal1.id,
      password: hashedPassword,
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: terminal2.id,
      providerId: "credential",
      userId: terminal2.id,
      password: hashedPassword,
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: terminal3.id,
      providerId: "credential",
      userId: terminal3.id,
      password: hashedPassword,
    },
  });

  console.log("✨ Database seeding completed successfully!");
  console.log("\n📊 Seeded data summary:");
  console.log(`   - Users: 3`);
  console.log(`   - Accounts: 3`);
  // console.log(`   - Companies: 3`);
  // console.log(`   - Employees: 6`);
  // console.log(`   - Check-ins: 8`);
  console.log("\n🔑 Test credentials:");
  // console.log(`   Email: ebesirli@kolin.com.tr`);
  // console.log(`   Password: Password123!`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
