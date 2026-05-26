import appError_1 from "../../utils/appError.js";
import { prisma } from "../../config/db.js";

export const getDepartmentService = async () => {
  return await prisma.department.findMany({
    where: {
      status: "active"
    }
  });
};

export const createDepartmentService = async (data) => {
  return await prisma.department.create({
    data: {
      ...data,
      status: "active"
    }
  });
};

export const updateDepartmentService = async (departmentId, data) => {
  const exist = await prisma.department.findUnique({
    where: {
      id: departmentId
    }
  });
  if (!exist) throw new appError_1("Department not found", 404, "NOT_FOUND");
  return await prisma.department.update({
    where: {
      id: departmentId
    },
    data
  });
};

export const deleteDepartmentService = async (departmentId) => {
  const exist = await prisma.department.findUnique({
    where: {
      id: departmentId
    }
  });
  if (!exist) throw new appError_1("Department not found", 404, "NOT_FOUND");
  if (exist.status === "deleted") throw new appError_1("Department is already deleted", 409, "CONFLICT");
  return await prisma.department.delete({
    where: {
      id: departmentId
    }
  });
};
