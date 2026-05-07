import fs from "fs";
import { parse } from "csv-parse";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Nationality } from "./lib/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type Row = {
  fullName: string;
  nationality: string;
  company: string;
  work: string;
  department: string;
  position: string;
};

async function main() {
  const rows: Row[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream("prisma/data.csv")
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (data) => rows.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  for (const row of rows) {
    // 1. Upsert Work
    const work = await prisma.work.upsert({
      where: { name: row.work },
      update: {},
      create: { name: row.work },
    });
    //   // 2. Upsert Company and connect Work
    const company = await prisma.company.upsert({
      where: { name: row.company },
      update: {
        works: {
          connect: { id: work.id },
        },
      },
      create: {
        name: row.company,
        works: {
          connect: { id: work.id },
        },
      },
    });
    // 3. Upsert Department
    const department = await prisma.department.upsert({
      where: { name: row.department },
      update: {},
      create: { name: row.department },
    });
    // 4. Upsert Position
    const position = await prisma.position.upsert({
      where: { name: row.position },
      update: {},
      create: { name: row.position },
    });
    // 5. Create Employee
    await prisma.employee.create({
      data: {
        fullName: row.fullName,
        nationality: Nationality[row.nationality as keyof typeof Nationality],
        companyId: company.id,
        departmentId: department.id,
        positionId: position.id,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
