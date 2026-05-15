"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employee_model_1 = require("../features/master/employee.model");
const purpose_model_1 = require("../features/master/purpose.model");
const carry_with_model_1 = require("../features/master/carry_with.model");
const visiting_area_model_1 = require("../features/master/visiting_area.model");
const visitor_type_model_1 = require("../features/master/visitor_type.model");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ─── Update this with your actual MongoDB connection string ───
if (!process.env.MONGO_URI) {
  logger_utils_1.default.info(`env variable is not readed`);
}
const MONGO_URI = process.env.MONGO_URI;
// ─────────────────────────────────────────────────────────────
// VISITOR TYPE  (5 entries — naturally limited, like an enum)
// ─────────────────────────────────────────────────────────────
const visitorTypes = [
  {
    name: "Guest",
    description: "Personal or informal visitor",
    status: "active",
  },
  {
    name: "Vendor",
    description: "Supplier or service provider",
    status: "active",
  },
  {
    name: "Client",
    description: "Business client or customer",
    status: "active",
  },
  {
    name: "Contractor",
    description: "External contractor or freelancer",
    status: "active",
  },
  {
    name: "Government",
    description: "Government official or inspector",
    status: "active",
  },
];
// ─────────────────────────────────────────────────────────────
// PURPOSE  (7 entries — real visit reasons, not too many)
// ─────────────────────────────────────────────────────────────
const purposes = [
  {
    name: "Meeting",
    description: "Scheduled business meeting",
    status: "active",
  },
  {
    name: "Delivery",
    description: "Package or goods delivery",
    status: "active",
  },
  {
    name: "Interview",
    description: "Job interview or HR discussion",
    status: "active",
  },
  {
    name: "Site Inspection",
    description: "Inspection of premises or equipment",
    status: "active",
  },
  {
    name: "Maintenance",
    description: "Repair or maintenance work",
    status: "active",
  },
  {
    name: "Training",
    description: "Attending or conducting a training session",
    status: "active",
  },
  {
    name: "Personal Visit",
    description: "Visiting an employee personally",
    status: "active",
  },
];
// ─────────────────────────────────────────────────────────────
// VISITING AREA  (10 entries — physical zones in a facility)
// ─────────────────────────────────────────────────────────────
const visitingAreas = [
  {
    name: "Reception",
    floor: "Ground",
    description: "Main entrance and reception desk",
    status: "active",
  },
  {
    name: "Conference Room A",
    floor: "1st",
    description: "Large meeting room for up to 20 people",
    status: "active",
  },
  {
    name: "Conference Room B",
    floor: "1st",
    description: "Small meeting room for up to 8 people",
    status: "active",
  },
  {
    name: "HR Department",
    floor: "2nd",
    description: "Human resources office",
    status: "active",
  },
  {
    name: "Finance Department",
    floor: "2nd",
    description: "Accounts and finance office",
    status: "active",
  },
  {
    name: "IT Department",
    floor: "3rd",
    description: "Information technology office",
    status: "active",
  },
  {
    name: "Server Room",
    floor: "3rd",
    description: "Restricted — authorised personnel only",
    status: "active",
  },
  {
    name: "Warehouse",
    floor: "Ground",
    description: "Storage and logistics area",
    status: "active",
  },
  {
    name: "Cafeteria",
    floor: "Ground",
    description: "Common dining and break area",
    status: "active",
  },
  {
    name: "Director's Office",
    floor: "4th",
    description: "Executive and management suite",
    status: "active",
  },
];
// ─────────────────────────────────────────────────────────────
// CARRY WITH  (12 entries — items a visitor might bring)
// ─────────────────────────────────────────────────────────────
const carryWithItems = [
  { name: "Laptop", description: "Personal or work laptop", status: "active" },
  {
    name: "Mobile Phone",
    description: "Personal mobile device",
    status: "active",
  },
  {
    name: "Camera",
    description: "Photography or video camera",
    status: "active",
  },
  {
    name: "USB Drive",
    description: "External storage device",
    status: "active",
  },
  { name: "Tablet", description: "iPad or Android tablet", status: "active" },
  {
    name: "Toolbox",
    description: "Hand tools for maintenance work",
    status: "active",
  },
  {
    name: "Delivery Package",
    description: "Parcel or boxed goods for delivery",
    status: "active",
  },
  {
    name: "Documents",
    description: "Printed files, contracts or reports",
    status: "active",
  },
  {
    name: "Bag / Backpack",
    description: "Personal carry bag",
    status: "active",
  },
  {
    name: "ID Card",
    description: "Government or company issued ID",
    status: "active",
  },
  {
    name: "Firearm",
    description: "Licensed firearm — security personnel",
    status: "active",
  },
  {
    name: "Medical Equipment",
    description: "Medical devices or supplies",
    status: "active",
  },
];
// ─────────────────────────────────────────────────────────────
// EMPLOYEE  (15 entries — staff who can receive visitors)
// ─────────────────────────────────────────────────────────────
const employees = [
  {
    name: "Arjun Mehta",
    employeeId: "EMP001",
    department: "Management",
    designation: "CEO",
    email: "arjun.mehta@company.com",
    phone: "9876543201",
    status: "active",
  },
  {
    name: "Priya Sharma",
    employeeId: "EMP002",
    department: "HR",
    designation: "HR Manager",
    email: "priya.sharma@company.com",
    phone: "9876543202",
    status: "active",
  },
  {
    name: "Rahul Desai",
    employeeId: "EMP003",
    department: "IT",
    designation: "IT Head",
    email: "rahul.desai@company.com",
    phone: "9876543203",
    status: "active",
  },
  {
    name: "Sneha Patel",
    employeeId: "EMP004",
    department: "Finance",
    designation: "Finance Manager",
    email: "sneha.patel@company.com",
    phone: "9876543204",
    status: "active",
  },
  {
    name: "Vikram Joshi",
    employeeId: "EMP005",
    department: "Operations",
    designation: "Operations Lead",
    email: "vikram.joshi@company.com",
    phone: "9876543205",
    status: "active",
  },
  {
    name: "Ananya Iyer",
    employeeId: "EMP006",
    department: "HR",
    designation: "HR Executive",
    email: "ananya.iyer@company.com",
    phone: "9876543206",
    status: "active",
  },
  {
    name: "Karan Malhotra",
    employeeId: "EMP007",
    department: "IT",
    designation: "Software Engineer",
    email: "karan.malhotra@company.com",
    phone: "9876543207",
    status: "active",
  },
  {
    name: "Divya Nair",
    employeeId: "EMP008",
    department: "Finance",
    designation: "Accountant",
    email: "divya.nair@company.com",
    phone: "9876543208",
    status: "active",
  },
  {
    name: "Rohan Gupta",
    employeeId: "EMP009",
    department: "Sales",
    designation: "Sales Manager",
    email: "rohan.gupta@company.com",
    phone: "9876543209",
    status: "active",
  },
  {
    name: "Meera Kulkarni",
    employeeId: "EMP010",
    department: "Admin",
    designation: "Admin Executive",
    email: "meera.kulkarni@company.com",
    phone: "9876543210",
    status: "active",
  },
  {
    name: "Aditya Bansal",
    employeeId: "EMP011",
    department: "IT",
    designation: "Network Engineer",
    email: "aditya.bansal@company.com",
    phone: "9876543211",
    status: "active",
  },
  {
    name: "Pooja Verma",
    employeeId: "EMP012",
    department: "Legal",
    designation: "Legal Advisor",
    email: "pooja.verma@company.com",
    phone: "9876543212",
    status: "active",
  },
  {
    name: "Sanjay Rao",
    employeeId: "EMP013",
    department: "Operations",
    designation: "Warehouse Supervisor",
    email: "sanjay.rao@company.com",
    phone: "9876543213",
    status: "active",
  },
  {
    name: "Kavita Singh",
    employeeId: "EMP014",
    department: "Management",
    designation: "Director",
    email: "kavita.singh@company.com",
    phone: "9876543214",
    status: "active",
  },
  {
    name: "Nikhil Choudhary",
    employeeId: "EMP015",
    department: "Sales",
    designation: "Business Dev Executive",
    email: "nikhil.choudhary@company.com",
    phone: "9876543215",
    status: "active",
  },
];
// ─────────────────────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose_1.default.connect(MONGO_URI);
    console.log("✅  Connected to MongoDB");
    // Clear existing data
    await Promise.all([
      visitor_type_model_1.VisitorType.deleteMany({}),
      purpose_model_1.Purpose.deleteMany({}),
      visiting_area_model_1.VisitingArea.deleteMany({}),
      carry_with_model_1.CarryWith.deleteMany({}),
      employee_model_1.Employee.deleteMany({}),
    ]);
    console.log("🗑️   Cleared existing master data");
    // Insert fresh data
    const [vt, pu, va, cw, em] = await Promise.all([
      visitor_type_model_1.VisitorType.insertMany(visitorTypes),
      purpose_model_1.Purpose.insertMany(purposes),
      visiting_area_model_1.VisitingArea.insertMany(visitingAreas),
      carry_with_model_1.CarryWith.insertMany(carryWithItems),
      employee_model_1.Employee.insertMany(employees),
    ]);
    console.log(`\n📊  Seeded successfully:`);
    console.log(`    VisitorType   → ${vt.length} records`);
    console.log(`    Purpose       → ${pu.length} records`);
    console.log(`    VisitingArea  → ${va.length} records`);
    console.log(`    CarryWith     → ${cw.length} records`);
    console.log(`    Employee      → ${em.length} records`);
    console.log(
      `\n✅  Total: ${vt.length + pu.length + va.length + cw.length + em.length} records inserted`,
    );
  } catch (err) {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose_1.default.disconnect();
    console.log("🔌  Disconnected from MongoDB");
  }
};
seed();
