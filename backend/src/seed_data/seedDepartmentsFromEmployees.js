/**
 * Inserts every distinct `department` string from employee seed data into `Department`.
 * Skips rows that already exist (matched by `name`). Safe to run multiple times.
 */
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { getDepartmentNamesFromEmployeeSeed } from "./employeeMasterRecords.js";

const prisma = new PrismaClient();

async function main() {
  const names = getDepartmentNamesFromEmployeeSeed();
  console.log(
    `Seeding ${names.length} departments from employee seed: ${names.join(", ")}`,
  );

  let created = 0;
  let skipped = 0;

  for (const name of names) {
    const existing = await prisma.department.findFirst({ where: { name } });
    if (existing) {
      skipped += 1;
      console.log(`  = skip (exists): ${name}`);
      continue;
    }
    await prisma.department.create({
      data: { name, status: "active" },
    });
    created += 1;
    console.log(`  + created: ${name}`);
  }

  console.log(`\nDone. Created: ${created}, already present: ${skipped}`);
}

main()
  .catch((err) => {
    console.error("seedDepartmentsFromEmployees failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
