import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateData() {
  console.log("Starting migration...");

  try {
    // Delete all existing gate passes
    // This will cascade and delete associated PersonDetail records
    const deleteFormData = await prisma.formData.deleteMany({});
    console.log(`Deleted ${deleteFormData.count} old gate pass records.`);

    // Initialize CompanyRegister with new default startTime and endTime if it exists
    const company = await prisma.companyRegister.findUnique({
      where: { id: "default" },
    });

    if (company) {
      await prisma.companyRegister.update({
        where: { id: "default" },
        data: {
          startTime: company.startTime || "09:00",
          endTime: company.endTime || "19:00",
        },
      });
      console.log("Updated CompanyRegister with default timings.");
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
