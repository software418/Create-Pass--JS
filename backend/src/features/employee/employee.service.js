import appError_1 from "../../utils/appError.js";
import { prisma } from "../../config/db.js";

export const getEmployeeService = async () => {
  return await prisma.employee.findMany({
    where: {
      status: "active"
    }
  });
};

export const createEmployeeService = async (data) => {
  return await prisma.employee.create({
    data: {
      ...data,
      status: "active"
    }
  });
};

export const updateEmployeeService = async (employeeId, data) => {
  const exist = await prisma.employee.findUnique({
    where: {
      id: employeeId
    }
  });
  if (!exist) throw new appError_1("Employee not found", 404, "NOT_FOUND");
  return await prisma.employee.update({
    where: {
      id: employeeId
    },
    data
  });
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
