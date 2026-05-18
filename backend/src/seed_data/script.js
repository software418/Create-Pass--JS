var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
import logger_utils_1 from "../utils/logger.utils.js";
import dotenv_1 from "dotenv";
dotenv_1.config();
// ─── Update this with your actual MongoDB connection string ───
if (!process.env.MONGO_URI) {
  logger_utils_1.info(`env variable is not readed`);
}
const MONGO_URI = process.env.MONGO_URI;
// ─────────────────────────────────────────────────────────────
// VISITOR TYPE  (5 entries — naturally limited, like an enum)
// ─────────────────────────────────────────────────────────────
const visitorTypes = [{
  name: "Guest",
  description: "Personal or informal visitor",
  status: "active"
}, {
  name: "Vendor",
  description: "Supplier or service provider",
  status: "active"
}, {
  name: "Client",
  description: "Business client or customer",
  status: "active"
}, {
  name: "Contractor",
  description: "External contractor or freelancer",
  status: "active"
}, {
  name: "Government",
  description: "Government official or inspector",
  status: "active"
}];
// ─────────────────────────────────────────────────────────────
// PURPOSE  (7 entries — real visit reasons, not too many)
// ─────────────────────────────────────────────────────────────
const purposes = [{
  name: "Meeting",
  description: "Scheduled business meeting",
  status: "active"
}, {
  name: "Delivery",
  description: "Package or goods delivery",
  status: "active"
}, {
  name: "Interview",
  description: "Job interview or HR discussion",
  status: "active"
}, {
  name: "Site Inspection",
  description: "Inspection of premises or equipment",
  status: "active"
}, {
  name: "Maintenance",
  description: "Repair or maintenance work",
  status: "active"
}, {
  name: "Training",
  description: "Attending or conducting a training session",
  status: "active"
}, {
  name: "Personal Visit",
  description: "Visiting an employee personally",
  status: "active"
}];
// ─────────────────────────────────────────────────────────────
// VISITING AREA  (10 entries — physical zones in a facility)
// ─────────────────────────────────────────────────────────────
const visitingAreas = [{
  name: "Reception",
  floor: "Ground",
  description: "Main entrance and reception desk",
  status: "active"
}, {
  name: "Conference Room A",
  floor: "1st",
  description: "Large meeting room for up to 20 people",
  status: "active"
}, {
  name: "Conference Room B",
  floor: "1st",
  description: "Small meeting room for up to 8 people",
  status: "active"
}, {
  name: "HR Department",
  floor: "2nd",
  description: "Human resources office",
  status: "active"
}, {
  name: "Finance Department",
  floor: "2nd",
  description: "Accounts and finance office",
  status: "active"
}, {
  name: "IT Department",
  floor: "3rd",
  description: "Information technology office",
  status: "active"
}, {
  name: "Server Room",
  floor: "3rd",
  description: "Restricted — authorised personnel only",
  status: "active"
}, {
  name: "Warehouse",
  floor: "Ground",
  description: "Storage and logistics area",
  status: "active"
}, {
  name: "Cafeteria",
  floor: "Ground",
  description: "Common dining and break area",
  status: "active"
}, {
  name: "Director's Office",
  floor: "4th",
  description: "Executive and management suite",
  status: "active"
}];
// ─────────────────────────────────────────────────────────────
// CARRY WITH  (12 entries — items a visitor might bring)
// ─────────────────────────────────────────────────────────────
const carryWithItems = [{
  name: "Laptop",
  description: "Personal or work laptop",
  status: "active"
}, {
  name: "Mobile Phone",
  description: "Personal mobile device",
  status: "active"
}, {
  name: "Camera",
  description: "Photography or video camera",
  status: "active"
}, {
  name: "USB Drive",
  description: "External storage device",
  status: "active"
}, {
  name: "Tablet",
  description: "iPad or Android tablet",
  status: "active"
}, {
  name: "Toolbox",
  description: "Hand tools for maintenance work",
  status: "active"
}, {
  name: "Delivery Package",
  description: "Parcel or boxed goods for delivery",
  status: "active"
}, {
  name: "Documents",
  description: "Printed files, contracts or reports",
  status: "active"
}, {
  name: "Bag / Backpack",
  description: "Personal carry bag",
  status: "active"
}, {
  name: "ID Card",
  description: "Government or company issued ID",
  status: "active"
}, {
  name: "Firearm",
  description: "Licensed firearm — security personnel",
  status: "active"
}, {
  name: "Medical Equipment",
  description: "Medical devices or supplies",
  status: "active"
}];
// ─────────────────────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────────────────────
import { PrismaClient } from "@prisma/client";
import {
  employeeSeedRecords,
  getDepartmentNamesFromEmployeeSeed,
} from "./employeeMasterRecords.js";
const prisma = new PrismaClient();
const seed = async () => {
  try {
    console.log("✅  Connected to Database via Prisma");

    // Clear existing data
    await prisma.visitorType.deleteMany({});
    await prisma.purpose.deleteMany({});
    await prisma.visitingArea.deleteMany({});
    await prisma.carryWith.deleteMany({});
    await prisma.employee.deleteMany({});
    await prisma.department.deleteMany({});
    console.log("🗑️   Cleared existing master data");

    // Insert fresh data
    const vt = await prisma.visitorType.createMany({
      data: visitorTypes
    });
    const pu = await prisma.purpose.createMany({
      data: purposes
    });
    const va = await prisma.visitingArea.createMany({
      data: visitingAreas
    });
    const cw = await prisma.carryWith.createMany({
      data: carryWithItems
    });
    const departmentNames = getDepartmentNamesFromEmployeeSeed();
    const dp = await prisma.department.createMany({
      data: departmentNames.map((name) => ({ name, status: "active" })),
    });
    const em = await prisma.employee.createMany({
      data: employeeSeedRecords
    });
    console.log(`\n📊  Seeded successfully:`);
    console.log(`    VisitorType   → ${vt.count} records`);
    console.log(`    Purpose       → ${pu.count} records`);
    console.log(`    VisitingArea  → ${va.count} records`);
    console.log(`    CarryWith     → ${cw.count} records`);
    console.log(`    Department    → ${dp.count} records (from employee seed)`);
    console.log(`    Employee      → ${em.count} records`);
    console.log(`\n✅  Total: ${vt.count + pu.count + va.count + cw.count + dp.count + em.count} records inserted`);
  } catch (err) {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌  Disconnected from Database");
  }
};
seed();