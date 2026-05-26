import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedMasterData = async () => {
  try {
    console.log("Starting Master Data seed...");

    // 1. Locations
    const locations = [
      { name: "Headquarters", description: "Main HQ Building", status: "active" },
      { name: "Branch Office 1", description: "City Center Branch", status: "active" }
    ];
    for (const loc of locations) {
      await prisma.location.upsert({
        where: { id: loc.name }, // Assuming no unique constraint on name, we will just use createMany if not worried about duplicates, but better to check
        update: {},
        create: loc
      }).catch(async () => {
        // Fallback if upsert fails
        const exist = await prisma.location.findFirst({ where: { name: loc.name } });
        if (!exist) await prisma.location.create({ data: loc });
      });
    }
    console.log("Locations seeded.");

    // 2. Departments
    const departments = [
      { name: "HR", status: "active" },
      { name: "IT", status: "active" },
      { name: "Security", status: "active" },
      { name: "Management", status: "active" }
    ];
    for (const dept of departments) {
      const exist = await prisma.department.findFirst({ where: { name: dept.name } });
      if (!exist) await prisma.department.create({ data: dept });
    }
    console.log("Departments seeded.");

    // 3. Visitor Types
    const visitorTypes = [
      { name: "Guest", description: "General Guest", status: "active" },
      { name: "Vendor", description: "Supplier or Vendor", status: "active" },
      { name: "Interviewee", description: "Candidate for job", status: "active" },
      { name: "Contractor", description: "Contract worker", status: "active" }
    ];
    for (const vt of visitorTypes) {
      const exist = await prisma.visitorType.findFirst({ where: { name: vt.name } });
      if (!exist) await prisma.visitorType.create({ data: vt });
    }
    console.log("Visitor Types seeded.");

    // 4. Purposes
    const purposes = [
      { name: "Meeting", description: "General Meeting", status: "active" },
      { name: "Interview", description: "Job Interview", status: "active" },
      { name: "Delivery", description: "Package or Good Delivery", status: "active" },
      { name: "Maintenance", description: "Repair and Maintenance", status: "active" }
    ];
    for (const p of purposes) {
      const exist = await prisma.purpose.findFirst({ where: { name: p.name } });
      if (!exist) await prisma.purpose.create({ data: p });
    }
    console.log("Purposes seeded.");

    // 5. Carry With Items
    const carryWithItems = [
      { name: "Laptop", description: "Personal or Company Laptop", status: "active" },
      { name: "Toolbox", description: "Maintenance Toolbox", status: "active" },
      { name: "Mobile", description: "Mobile Phone", status: "active" }
    ];
    for (const cw of carryWithItems) {
      const exist = await prisma.carryWith.findFirst({ where: { name: cw.name } });
      if (!exist) await prisma.carryWith.create({ data: cw });
    }
    console.log("CarryWith items seeded.");

    // 6. ID Types
    const idTypes = [
      { name: "Aadhar", description: "Aadhar Card", status: "active" },
      { name: "PAN", description: "PAN Card", status: "active" },
      { name: "Driving License", description: "Driving License", status: "active" },
      { name: "Passport", description: "Passport", status: "active" }
    ];
    for (const idT of idTypes) {
      const exist = await prisma.idType.findFirst({ where: { name: idT.name } });
      if (!exist) await prisma.idType.create({ data: idT });
    }
    console.log("ID Types seeded.");

    // 7. Visiting Areas
    const areas = [
      { name: "Lobby", floor: "Ground", description: "Main Lobby", status: "active" },
      { name: "Conference Room A", floor: "1st", description: "Meeting Room A", status: "active" },
      { name: "Server Room", floor: "2nd", description: "Main Server Room", status: "active" }
    ];
    for (const area of areas) {
      const exist = await prisma.visitingArea.findFirst({ where: { name: area.name } });
      if (!exist) await prisma.visitingArea.create({ data: area });
    }
    console.log("Visiting Areas seeded.");

  } catch (error) {
    console.error("Error seeding Master Data:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database.");
  }
};

seedMasterData();
