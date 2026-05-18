var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
import logger_utils_1 from "../../utils/logger.utils.js";
import appError_1 from "../../utils/appError.js";
import { prisma } from "../../config/db.js"; // GET Services
const getPurposeService = async () => {
  return await prisma.purpose.findMany({
    where: {
      status: "active"
    }
  });
};
export { getPurposeService };
const getEmployeeService = async () => {
  return await prisma.employee.findMany({
    where: {
      status: "active"
    }
  });
};
export { getEmployeeService };
const getVisitingAreaService = async () => {
  return await prisma.visitingArea.findMany({
    where: {
      status: "active"
    }
  });
};
export { getVisitingAreaService };
const getCarryWithService = async () => {
  return await prisma.carryWith.findMany({
    where: {
      status: "active"
    }
  });
};
export { getCarryWithService };
const getVisitorTypeService = async () => {
  return await prisma.visitorType.findMany({
    where: {
      status: "active"
    }
  });
};
export { getVisitorTypeService }; // CREATE Services
const createEmployeeService = async data => {
  return await prisma.employee.create({
    data: {
      ...data,
      status: "active"
    }
  });
};
export { createEmployeeService };
const createPurposeService = async data => {
  return await prisma.purpose.create({
    data: {
      ...data,
      status: "active"
    }
  });
};
export { createPurposeService };
const createCarryWithItemService = async data => {
  return await prisma.carryWith.create({
    data: {
      ...data,
      status: "active"
    }
  });
};
export { createCarryWithItemService };
const createVisitingAreaService = async data => {
  return await prisma.visitingArea.create({
    data: {
      ...data,
      status: "active"
    }
  });
};
export { createVisitingAreaService };
const createVisitorTypeService = async data => {
  return await prisma.visitorType.create({
    data: {
      ...data,
      status: "active"
    }
  });
};
export { createVisitorTypeService }; // UPDATE Services
const updateEmployeeService = async (employeeId, data) => {
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
export { updateEmployeeService };
const updatepurposeService = async (purposeId, data) => {
  const exist = await prisma.purpose.findUnique({
    where: {
      id: purposeId
    }
  });
  if (!exist) throw new appError_1("Purpose not found", 404, "NOT_FOUND");
  return await prisma.purpose.update({
    where: {
      id: purposeId
    },
    data
  });
};
export { updatepurposeService };
const updateCarrywithService = async (itemId, data) => {
  const exist = await prisma.carryWith.findUnique({
    where: {
      id: itemId
    }
  });
  if (!exist) throw new appError_1("Carry With item not found", 404, "NOT_FOUND");
  return await prisma.carryWith.update({
    where: {
      id: itemId
    },
    data
  });
};
export { updateCarrywithService };
const updateVisitingAreaService = async (areaId, data) => {
  const exist = await prisma.visitingArea.findUnique({
    where: {
      id: areaId
    }
  });
  if (!exist) throw new appError_1("Visiting area not found", 404, "NOT_FOUND");
  return await prisma.visitingArea.update({
    where: {
      id: areaId
    },
    data
  });
};
export { updateVisitingAreaService };
const updateVisitortypeService = async (visitorId, data) => {
  const exist = await prisma.visitorType.findUnique({
    where: {
      id: visitorId
    }
  });
  if (!exist) throw new appError_1("Visitor type not found", 404, "NOT_FOUND");
  return await prisma.visitorType.update({
    where: {
      id: visitorId
    },
    data
  });
};
export { updateVisitortypeService }; // DELETE Services
const delteEmployeeService = async employeeId => {
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
export { delteEmployeeService };
const deletePurposeService = async purposeId => {
  const exist = await prisma.purpose.findUnique({
    where: {
      id: purposeId
    }
  });
  if (!exist) throw new appError_1("Purpose not found", 404, "NOT_FOUND");
  if (exist.status === "deleted") throw new appError_1("Purpose is already deleted", 409, "CONFLICT");
  return await prisma.purpose.delete({
    where: {
      id: purposeId
    }
  });
};
export { deletePurposeService };
const deleteCarryWithService = async itemId => {
  const exist = await prisma.carryWith.findUnique({
    where: {
      id: itemId
    }
  });
  if (!exist) throw new appError_1("Carry-with item not found", 404, "NOT_FOUND");
  if (exist.status === "deleted") throw new appError_1("Carry-with item is already deleted", 409, "CONFLICT");
  return await prisma.carryWith.delete({
    where: {
      id: itemId
    }
  });
};
export { deleteCarryWithService };
const deleteVisitorAreaService = async areaId => {
  const exist = await prisma.visitingArea.findUnique({
    where: {
      id: areaId
    }
  });
  if (!exist) throw new appError_1("Visiting area not found", 404, "NOT_FOUND");
  if (exist.status === "deleted") throw new appError_1("Visiting area is already deleted", 409, "CONFLICT");
  return await prisma.visitingArea.delete({
    where: {
      id: areaId
    }
  });
};
export { deleteVisitorAreaService };
const deleteVisitorTypeService = async visitorId => {
  const exist = await prisma.visitorType.findUnique({
    where: {
      id: visitorId
    }
  });
  if (!exist) throw new appError_1("Visitor type not found", 404, "NOT_FOUND");
  if (exist.status === "deleted") throw new appError_1("Visitor type is already deleted", 409, "CONFLICT");
  return await prisma.visitorType.delete({
    where: {
      id: visitorId
    }
  });
};
export { deleteVisitorTypeService };