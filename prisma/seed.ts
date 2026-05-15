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
  console.log("🧹 Cleaning existing data...");
  await prisma.checkin.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.company.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log("👤 Creating users...");
  const hashedPassword = await hashPassword("Password123!");

  const user1 = await prisma.user.create({
    data: {
      email: "ebesirli@kolin.com.tr",
      name: "Elvin Bashirli",
      emailVerified: true,
      image: "",
      role: Role.ADMIN,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      emailVerified: true,
      image: "https://i.pravatar.cc/150?img=2",
      role: Role.MANAGER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      emailVerified: true,
      image: "https://i.pravatar.cc/150?img=3",
      role: Role.TERMINAL,
    },
  });

  // Create Accounts (credentials provider)
  console.log("🔐 Creating accounts...");
  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: user1.id,
      providerId: "credential",
      userId: user1.id,
      password: hashedPassword,
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: user2.id,
      providerId: "credential",
      userId: user2.id,
      password: hashedPassword,
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: user3.id,
      providerId: "credential",
      userId: user3.id,
      password: hashedPassword,
    },
  });

  // Create Companies
  // console.log("🏢 Creating companies...");
  // const company1 = await prisma.company.create({
  //   data: {
  //     name: "Kolin Construction",
  //   },
  // });

  // const company2 = await prisma.company.create({
  //   data: {
  //     name: "Global Solutions Ltd.",
  //   },
  // });

  // const company3 = await prisma.company.create({
  //   data: {
  //     name: "Creative Dynamics Corp.",
  //   },
  // });

  // Create Employees
  console.log("👷 Creating employees...");
  // const employee1 =
  // await prisma.employee.create({
  //   data: {
  //     name: "Alice Johnson",
  //     companyId: company1.id,
  //   },
  // });

  // // const employee2 =
  // await prisma.employee.create({
  //   data: {
  //     name: "Bob Williams",
  //     companyId: company1.id,
  //   },
  // });

  // // const employee3 =
  // await prisma.employee.create({
  //   data: {
  //     name: "Charlie Brown",
  //     companyId: company2.id,
  //   },
  // });

  // // const employee4 =
  // await prisma.employee.create({
  //   data: {
  //     name: "Diana Martinez",
  //     companyId: company2.id,
  //   },
  // });

  // // const employee5 =
  // await prisma.employee.create({
  //   data: {
  //     name: "Eve Davis",
  //     companyId: company3.id,
  //   },
  // });

  // // const employee6 =
  // await prisma.employee.create({
  //   data: {
  //     name: "Frank Garcia",
  //     companyId: company3.id,
  //   },
  // });

  // Create Check-ins
  // console.log("✅ Creating check-ins...");
  // const now = new Date();

  // Recent check-ins (today)
  // await prisma.checkin.create({
  //   data: {
  //     employeeId: employee1.id,
  //     checkedById: user1.id,
  //     dateTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
  //   },
  // });

  // await prisma.checkin.create({
  //   data: {
  //     employeeId: employee2.id,
  //     checkedById: user1.id,
  //     dateTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
  //   },
  // });

  // await prisma.checkin.create({
  //   data: {
  //     employeeId: employee3.id,
  //     checkedById: user1.id,
  //     dateTime: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
  //   },
  // });

  // // Yesterday's check-ins
  // await prisma.checkin.create({
  //   data: {
  //     employeeId: employee1.id,
  //     checkedById: user1.id,
  //     dateTime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
  //   },
  // });

  // await prisma.checkin.create({
  //   data: {
  //     employeeId: employee4.id,
  //     checkedById: user1.id,
  //     dateTime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
  //   },
  // });

  // // Older check-ins
  // await prisma.checkin.create({
  //   data: {
  //     employeeId: employee5.id,
  //     checkedById: user1.id,
  //     dateTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  //   },
  // });

  // await prisma.checkin.create({
  //   data: {
  //     employeeId: employee6.id,
  //     checkedById: user1.id,
  //     dateTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  //   },
  // });

  // await prisma.checkin.create({
  //   data: {
  //     employeeId: employee2.id,
  //     checkedById: user1.id,
  //     dateTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  //   },
  // });

  console.log("✨ Database seeding completed successfully!");
  console.log("\n📊 Seeded data summary:");
  console.log(`   - Users: 3`);
  console.log(`   - Accounts: 3`);
  // console.log(`   - Companies: 3`);
  // console.log(`   - Employees: 6`);
  // console.log(`   - Check-ins: 8`);
  console.log("\n🔑 Test credentials:");
  console.log(`   Email: ebesirli@kolin.com.tr`);
  console.log(`   Password: Password123!`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
