import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const seedSuperAdmin = async () => {
  try {
    console.log("Starting Super Admin seed...");

    // 1. Create or find Super Admin Role
    let role = await prisma.role.findUnique({
      where: { name: "Super Admin" },
    });

    // Modules exactly matching our new categories
    const masterDataModules = ["Employee", "Department", "VisitorType", "VisitingArea", "Purpose", "CarryWith", "IdType", "Location"];
    const systemSettingsModules = ["Role", "CompanyRegister"];
    const dashboardModules = ["Dashboard"];
    const reportModules = ["Report", "Print"];

    const permissionsData = [
      ...masterDataModules.map(module => ({
        module,
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: false, // Explicitly no delete per new spec
        dashboardActions: {},
      })),
      ...systemSettingsModules.map(module => ({
        module,
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: false,
        dashboardActions: {},
      })),
      ...dashboardModules.map(module => ({
        module,
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        dashboardActions: {
          check_in: true,
          check_out: true,
          print: true,
          view_detail: true,
          create_pass: true,
          approve: true,
          reject: true,
          view_requested_list: true,
          view_pending_approval_list: true,
          view_rejected_list: true,
          view_approved_list: true,
          view_inside_list: true,
          view_multi_day_list: true,
          view_exited_list: true,
          view_expired_list: true,
        },
      })),
      ...reportModules.map(module => ({
        module,
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        dashboardActions: module === 'Report' 
          ? { view: true, export: true } 
          : { print_setting: true, print: true },
      }))
    ];

    if (!role) {
      console.log("Creating Super Admin Role...");
      
      role = await prisma.role.create({
        data: {
          name: "Super Admin",
          weight: 100, // Highest weight for super admin
          permissions: {
            create: permissionsData,
          },
        },
      });
      console.log("Super Admin Role created successfully.");
    } else {
      console.log("Super Admin Role already exists. Updating permissions to latest format...");
      
      // Delete old permissions to prevent unique constraint clashes
      await prisma.permission.deleteMany({
        where: { roleId: role.id }
      });
      
      // Upsert role permissions
      role = await prisma.role.update({
        where: { id: role.id },
        data: {
          permissions: {
            create: permissionsData
          }
        }
      });
      console.log("Super Admin Role permissions updated.");
    }

    // 2. Create Super Admin User
    const adminEmail = "admin@createpass.com";
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminUser) {
      console.log("Creating Super Admin User...");
      const hashedPassword = await bcrypt.hash("Admin@123", 12);
      
      adminUser = await prisma.user.create({
        data: {
          name: "Super Administrator",
          email: adminEmail,
          password: hashedPassword,
          role: "admin", // Legacy string
          roleId: role.id,
          active: true,
        },
      });
      console.log("Super Admin User created successfully.");
      console.log("Credentials:");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: Admin@123`);
    } else {
      console.log("Super Admin User already exists. Updating role binding...");
      await prisma.user.update({
        where: { email: adminEmail },
        data: { roleId: role.id }
      });
      console.log("Credentials remain unchanged. Use your existing password.");
    }

  } catch (error) {
    console.error("Error seeding Super Admin:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database.");
  }
};

seedSuperAdmin();
