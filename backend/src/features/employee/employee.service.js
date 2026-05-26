import appError_1 from "../../utils/appError.js";
import { prisma } from "../../config/db.js";
import * as bcrypt from "bcryptjs";

export const getEmployeeService = async (user) => {
  return await prisma.employee.findMany({
    where: {
      status: { not: "deleted" }
    }
  });
};

export const createEmployeeService = async (data) => {
  const { password, ...employeeData } = data;

  if (!password) {
    throw new appError_1("Password is required to create an employee user account", 400, "BAD_REQUEST");
  }

  // Fallback for legacy required string field
  if (!employeeData.department) {
    employeeData.department = "Managed via Department ID";
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Use a transaction to ensure both Employee and User are created
  return await prisma.$transaction(async (tx) => {
    const employee = await tx.employee.create({
      data: {
        ...employeeData,
        status: "active"
      }
    });

    // Check if user with same email exists
    if (employee.email) {
      const existingUser = await tx.user.findUnique({ where: { email: employee.email } });
      if (existingUser) {
        throw new appError_1("A user with this email already exists", 400, "CONFLICT");
      }

      await tx.user.create({
        data: {
          name: employee.name,
          email: employee.email,
          password: hashedPassword,
          roleId: employee.roleId,
          departmentId: employee.departmentId,
          assignedLocationId: employee.assignedLocationId,
          active: true,
        }
      });
    }

    return employee;
  });
};

export const updateEmployeeService = async (employeeId, data) => {
  const exist = await prisma.employee.findUnique({
    where: {
      id: employeeId
    }
  });
  if (!exist) throw new appError_1("Employee not found", 404, "NOT_FOUND");

  const { password, ...updateData } = data;

  if (updateData.departmentId && !updateData.department) {
    updateData.department = "Managed via Department ID";
  }

  const employee = await prisma.employee.update({
    where: {
      id: employeeId
    },
    data: updateData
  });

  // Attempt to sync the User model if an email exists
  if (employee.email) {
    const userUpdateData = {
      name: updateData.name,
      roleId: updateData.roleId,
      departmentId: updateData.departmentId,
      assignedLocationId: updateData.assignedLocationId
    };

    if (password) {
      userUpdateData.password = await bcrypt.hash(password, 12);
    }

    await prisma.user.updateMany({
      where: { email: employee.email },
      data: userUpdateData
    });
  }

  return employee;
};

export const deleteEmployeeService = async (employeeId) => {
  const exist = await prisma.employee.findUnique({
    where: {
      id: employeeId
    }
  });
  if (!exist) throw new appError_1("Employee not found", 404, "NOT_FOUND");
  if (exist.status === "deleted") throw new appError_1("Employee is already deleted", 409, "CONFLICT");
  return await prisma.employee.delete({
    where: {
      id: employeeId
    }
  });
};
