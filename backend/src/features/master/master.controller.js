var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
import * as master_service_1 from "../master/master.service.js";
import logger_utils_1 from "../../utils/logger.utils.js"; // ─────────────────────────────────────────────────────────────
// GET Controllers
// ─────────────────────────────────────────────────────────────
const getEmployee = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} getEmployee → request received");
    const employees = await (0, master_service_1.getEmployeeService)();
    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: {
        employees
      }
    });
  } catch (err) {
    next(err);
  }
};
export { getEmployee };
const getPurpose = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} getPurpose → request received");
    const purposes = await (0, master_service_1.getPurposeService)();
    res.status(200).json({
      success: true,
      message: "Purposes fetched successfully",
      data: {
        purposes
      }
    });
  } catch (err) {
    next(err);
  }
};
export { getPurpose };
const getVisitingArea = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} getVisitingArea → request received");
    const visitingAreas = await (0, master_service_1.getVisitingAreaService)();
    res.status(200).json({
      success: true,
      message: "Visiting areas fetched successfully",
      data: {
        visitingAreas
      }
    });
  } catch (err) {
    next(err);
  }
};
export { getVisitingArea };
const getCarryWith = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} getCarryWith → request received");
    const carryWithItems = await (0, master_service_1.getCarryWithService)();
    res.status(200).json({
      success: true,
      message: "Carry-with items fetched successfully",
      data: {
        carryWithItems
      }
    });
  } catch (err) {
    next(err);
  }
};
export { getCarryWith };
const getVisitorType = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} getVisitorType → request received");
    const visitorTypes = await (0, master_service_1.getVisitorTypeService)();
    res.status(200).json({
      success: true,
      message: "Visitor types fetched successfully",
      data: {
        visitorTypes
      }
    });
  } catch (err) {
    next(err);
  }
};
export { getVisitorType }; 
const getDepartment = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} getDepartment → request received");
    const department = await (0, master_service_1.getDepartmentService)();
    res.status(200).json({
      success: true,
      message: "Department fetched successfully",
      data: {
        department
      }
    });
  } catch (err) {
    next(err);
  }
};
export { getDepartment }; 
const getLocation = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} getLocation → request received");
    const location  = await (0, master_service_1.getLocationService)();
    res.status(200).json({
      success: true,
      message: "Location fetched successfully",
      data: {
        location
      }
    });
  } catch (err) {
    next(err);
  }
};
export { getLocation }; 

const getIdType = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} getIdType → request received");
    const idType = await (0, master_service_1.getIdTypeService)();
    res.status(200).json({
      success: true,
      message: "ID type fetched successfully",
      data: {
        idType
      }
    });
  } catch (err) {
    next(err);
  }
};
export { getIdType }; 

// ─────────────────────────────────────────────────────────────
// CREATE Controllers
// ─────────────────────────────────────────────────────────────
const createEmployee = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} createEmployee → request received");
    const employee = await (0, master_service_1.createEmployeeService)(req.body);
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        employee
      }
    });
  } catch (err) {
    next(err);
  }
};
export { createEmployee };
const createPurpose = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} createPurpose → request received");
    const purpose = await (0, master_service_1.createPurposeService)(req.body);
    res.status(201).json({
      success: true,
      message: "Purpose created successfully",
      data: {
        purpose
      }
    });
  } catch (err) {
    next(err);
  }
};
export { createPurpose };
const createVisitingArea = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} createVisitingArea → request received");
    const visitingArea = await (0, master_service_1.createVisitingAreaService)(req.body);
    res.status(201).json({
      success: true,
      message: "Visiting area created successfully",
      data: {
        visitingArea
      }
    });
  } catch (err) {
    next(err);
  }
};
export { createVisitingArea };
const createCarryWith = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} createCarryWith → request received");
    const carryWithItem = await (0, master_service_1.createCarryWithItemService)(req.body);
    res.status(201).json({
      success: true,
      message: "Carry-with item created successfully",
      data: {
        carryWithItem
      }
    });
  } catch (err) {
    next(err);
  }
};
export { createCarryWith };
const createVisitorType = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} createVisitorType → request received");
    const visitorType = await (0, master_service_1.createVisitorTypeService)(req.body);
    res.status(201).json({
      success: true,
      message: "Visitor type created successfully",
      data: {
        visitorType
      }
    });
  } catch (err) {
    next(err);
  }
};
export { createVisitorType }; 
const createDepartment = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} createDepartment → request received");
    const department = await (0, master_service_1.createDepartmentService)(req.body);
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: {
        department
      }
    });
  } catch (err) {
    next(err);
  }
};
export { createDepartment };
const createLocation = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} createLocation → request received");
    const location  = await (0, master_service_1.createLocationService)(req.body);
    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: {
        location
      }
    });
  } catch (err) {
    next(err);
  }
};
export { createLocation };
const createIdType = async (req, res, next) => {
  try {
    logger_utils_1.info("[CONTROLLER]{master/master.controller} createIdType → request received");
    const idType = await (0, master_service_1.createIdTypeService)(req.body);
    res.status(201).json({
      success: true,
      message: "ID type created successfully",
      data: {
        idType
      }
    });
  } catch (err) {
    next(err);
  }
};
export { createIdType }; 

// ─────────────────────────────────────────────────────────────
// UPDATE Controllers
// ─────────────────────────────────────────────────────────────
const updateEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} updateEmployee → request received for ID: ${id}`);
    const employee = await (0, master_service_1.updateEmployeeService)(id, req.body);
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: {
        employee
      }
    });
  } catch (err) {
    next(err);
  }
};
export { updateEmployee };
const updatePurpose = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} updatePurpose → request received for ID: ${id}`);
    const purpose = await (0, master_service_1.updatepurposeService)(id, req.body);
    res.status(200).json({
      success: true,
      message: "Purpose updated successfully",
      data: {
        purpose
      }
    });
  } catch (err) {
    next(err);
  }
};
export { updatePurpose };
const updateVisitingArea = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} updateVisitingArea → request received for ID: ${id}`);
    const visitingArea = await (0, master_service_1.updateVisitingAreaService)(id, req.body);
    res.status(200).json({
      success: true,
      message: "Visiting area updated successfully",
      data: {
        visitingArea
      }
    });
  } catch (err) {
    next(err);
  }
};
export { updateVisitingArea };
const updateCarryWith = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} updateCarryWith → request received for ID: ${id}`);
    const carryWithItem = await (0, master_service_1.updateCarrywithService)(id, req.body);
    res.status(200).json({
      success: true,
      message: "Carry-with item updated successfully",
      data: {
        carryWithItem
      }
    });
  } catch (err) {
    next(err);
  }
};
export { updateCarryWith };
const updateVisitorType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} updateVisitorType → request received for ID: ${id}`);
    const visitorType = await (0, master_service_1.updateVisitortypeService)(id, req.body);
    res.status(200).json({
      success: true,
      message: "Visitor type updated successfully",
      data: {
        visitorType
      }
    });
  } catch (err) {
    next(err);
  }
};
export { updateVisitorType }; 
const updateDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} updateDepartment → request received for ID: ${id}`);
    const department = await (0, master_service_1.updateDepartmentService)(id, req.body);
    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: {
        department
      }
    });
  } catch (err) {
    next(err);
  }
};
export { updateDepartment }; 
const updateLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} updateDepartment → request received for ID: ${id}`);
    const location = await (0, master_service_1.updateLocationService)(id, req.body);
    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: {
        location
      }
    });
  } catch (err) {
    next(err);
  }
};
export { updateLocation }; 
const updateIdType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} updateIdType → request received for ID: ${id}`);
    const idType = await (0, master_service_1.updateIdTypeService)(id, req.body);
    res.status(200).json({
      success: true,
      message: "ID type updated successfully",
      data: {
        idType
      }
    });
  } catch (err) {
    next(err);
  }
};
export { updateIdType };

// ─────────────────────────────────────────────────────────────
// DELETE Controllers
// ─────────────────────────────────────────────────────────────
const deleteEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} deleteEmployee → request received for ID: ${id}`);
    const employee = await (0, master_service_1.delteEmployeeService)(id);
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: {
        employee
      }
    });
  } catch (err) {
    next(err);
  }
};
export { deleteEmployee };
const deletePurpose = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} deletePurpose → request received for ID: ${id}`);
    const purpose = await (0, master_service_1.deletePurposeService)(id);
    res.status(200).json({
      success: true,
      message: "Purpose deleted successfully",
      data: {
        purpose
      }
    });
  } catch (err) {
    next(err);
  }
};
export { deletePurpose };
const deleteVisitingArea = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} deleteVisitingArea → request received for ID: ${id}`);
    const visitingArea = await (0, master_service_1.deleteVisitorAreaService)(id);
    res.status(200).json({
      success: true,
      message: "Visiting area deleted successfully",
      data: {
        visitingArea
      }
    });
  } catch (err) {
    next(err);
  }
};
export { deleteVisitingArea };
const deleteCarryWith = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} deleteCarryWith → request received for ID: ${id}`);
    const carryWithItem = await (0, master_service_1.deleteCarryWithService)(id);
    res.status(200).json({
      success: true,
      message: "Carry-with item deleted successfully",
      data: {
        carryWithItem
      }
    });
  } catch (err) {
    next(err);
  }
};
export { deleteCarryWith };
const deleteVisitorType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} deleteVisitorType → request received for ID: ${id}`);
    const visitorType = await (0, master_service_1.deleteVisitorTypeService)(id);
    res.status(200).json({
      success: true,
      message: "Visitor type deleted successfully",
      data: {
        visitorType
      }
    });
  } catch (err) {
    next(err);
  }
};
export { deleteVisitorType };
const deleteDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} deleteDepartment → request received for ID: ${id}`);
    const department = await (0, master_service_1.deleteDepartmentService)(id);
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      data: {
        department
      }
    });
  } catch (err) {
    next(err);
  }
};
export { deleteDepartment };
const deleteLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} deleteLocation → request received for ID: ${id}`);
    const location  = await (0, master_service_1.deleteLocationService)(id);
    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
      data: {
        location
      }
    });
  } catch (err) {
    next(err);
  }
};
export { deleteLocation };
const deleteIdType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.info(`[CONTROLLER]{master/master.controller} deleteIdType → request received for ID: ${id}`);
    const idType = await (0, master_service_1.deleteIdTypeService)(id);
    res.status(200).json({
      success: true,
      message: "ID type deleted successfully",
      data: {
        idType
      }
    });
  } catch (err) {
    next(err);
  }
};
export { deleteIdType }; 


const getCompanyRegister = async (req, res, next) => {
  try {
    logger_utils_1.info(
      "[CONTROLLER]{master/master.controller} getCompanyRegister → request received",
    );
    const companyRegister = await (0, master_service_1.getCompanyRegisterService)();
    res.status(200).json({
      success: true,
      message: companyRegister
        ? "Company registration fetched successfully"
        : "No company registration on file",
      data: {
        companyRegister: companyRegister ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
};
export { getCompanyRegister };

const updateCompanyRegister = async (req, res, next) => {
  try {
    logger_utils_1.info(
      "[CONTROLLER]{master/master.controller} updateCompanyRegister → request received",
    );
    const companyRegister = await (0, master_service_1.upsertCompanyRegisterService)(
      req.body,
      req.file,
    );
    res.status(200).json({
      success: true,
      message: "Company registration updated successfully",
      data: {
        companyRegister,
      },
    });
  } catch (err) {
    next(err);
  }
};
export { updateCompanyRegister };