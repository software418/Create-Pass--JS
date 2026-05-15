"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisitorType =
  exports.deleteCarryWith =
  exports.deleteVisitingArea =
  exports.deletePurpose =
  exports.deleteEmployee =
  exports.updateVisitorType =
  exports.updateCarryWith =
  exports.updateVisitingArea =
  exports.updatePurpose =
  exports.updateEmployee =
  exports.createVisitorType =
  exports.createCarryWith =
  exports.createVisitingArea =
  exports.createPurpose =
  exports.createEmployee =
  exports.getVisitorType =
  exports.getCarryWith =
  exports.getVisitingArea =
  exports.getPurpose =
  exports.getEmployee =
    void 0;
const master_service_1 = require("../master/master.service");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
// ─────────────────────────────────────────────────────────────
// GET Controllers
// ─────────────────────────────────────────────────────────────
const getEmployee = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} getEmployee → request received",
    );
    const employees = await (0, master_service_1.getEmployeeService)();
    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: { employees },
    });
  } catch (err) {
    next(err);
  }
};
exports.getEmployee = getEmployee;
const getPurpose = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} getPurpose → request received",
    );
    const purposes = await (0, master_service_1.getPurposeService)();
    res.status(200).json({
      success: true,
      message: "Purposes fetched successfully",
      data: { purposes },
    });
  } catch (err) {
    next(err);
  }
};
exports.getPurpose = getPurpose;
const getVisitingArea = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} getVisitingArea → request received",
    );
    const visitingAreas = await (0, master_service_1.getVisitingAreaService)();
    res.status(200).json({
      success: true,
      message: "Visiting areas fetched successfully",
      data: { visitingAreas },
    });
  } catch (err) {
    next(err);
  }
};
exports.getVisitingArea = getVisitingArea;
const getCarryWith = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} getCarryWith → request received",
    );
    const carryWithItems = await (0, master_service_1.getCarryWithService)();
    res.status(200).json({
      success: true,
      message: "Carry-with items fetched successfully",
      data: { carryWithItems },
    });
  } catch (err) {
    next(err);
  }
};
exports.getCarryWith = getCarryWith;
const getVisitorType = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} getVisitorType → request received",
    );
    const visitorTypes = await (0, master_service_1.getVisitorTypeService)();
    res.status(200).json({
      success: true,
      message: "Visitor types fetched successfully",
      data: { visitorTypes },
    });
  } catch (err) {
    next(err);
  }
};
exports.getVisitorType = getVisitorType;
// ─────────────────────────────────────────────────────────────
// CREATE Controllers
// ─────────────────────────────────────────────────────────────
const createEmployee = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} createEmployee → request received",
    );
    const employee = await (0, master_service_1.createEmployeeService)(
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: { employee },
    });
  } catch (err) {
    next(err);
  }
};
exports.createEmployee = createEmployee;
const createPurpose = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} createPurpose → request received",
    );
    const purpose = await (0, master_service_1.createPurposeService)(req.body);
    res.status(201).json({
      success: true,
      message: "Purpose created successfully",
      data: { purpose },
    });
  } catch (err) {
    next(err);
  }
};
exports.createPurpose = createPurpose;
const createVisitingArea = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} createVisitingArea → request received",
    );
    const visitingArea = await (0, master_service_1.createVisitingAreaService)(
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Visiting area created successfully",
      data: { visitingArea },
    });
  } catch (err) {
    next(err);
  }
};
exports.createVisitingArea = createVisitingArea;
const createCarryWith = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} createCarryWith → request received",
    );
    const carryWithItem = await (0,
    master_service_1.createCarryWithItemService)(req.body);
    res.status(201).json({
      success: true,
      message: "Carry-with item created successfully",
      data: { carryWithItem },
    });
  } catch (err) {
    next(err);
  }
};
exports.createCarryWith = createCarryWith;
const createVisitorType = async (req, res, next) => {
  try {
    logger_utils_1.default.info(
      "[CONTROLLER]{master/master.controller} createVisitorType → request received",
    );
    const visitorType = await (0, master_service_1.createVisitorTypeService)(
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Visitor type created successfully",
      data: { visitorType },
    });
  } catch (err) {
    next(err);
  }
};
exports.createVisitorType = createVisitorType;
// ─────────────────────────────────────────────────────────────
// UPDATE Controllers
// ─────────────────────────────────────────────────────────────
const updateEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} updateEmployee → request received for ID: ${id}`,
    );
    const employee = await (0, master_service_1.updateEmployeeService)(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: { employee },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateEmployee = updateEmployee;
const updatePurpose = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} updatePurpose → request received for ID: ${id}`,
    );
    const purpose = await (0, master_service_1.updatepurposeService)(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Purpose updated successfully",
      data: { purpose },
    });
  } catch (err) {
    next(err);
  }
};
exports.updatePurpose = updatePurpose;
const updateVisitingArea = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} updateVisitingArea → request received for ID: ${id}`,
    );
    const visitingArea = await (0, master_service_1.updateVisitingAreaService)(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Visiting area updated successfully",
      data: { visitingArea },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateVisitingArea = updateVisitingArea;
const updateCarryWith = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} updateCarryWith → request received for ID: ${id}`,
    );
    const carryWithItem = await (0, master_service_1.updateCarrywithService)(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Carry-with item updated successfully",
      data: { carryWithItem },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateCarryWith = updateCarryWith;
const updateVisitorType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} updateVisitorType → request received for ID: ${id}`,
    );
    const visitorType = await (0, master_service_1.updateVisitortypeService)(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Visitor type updated successfully",
      data: { visitorType },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateVisitorType = updateVisitorType;
// ─────────────────────────────────────────────────────────────
// DELETE Controllers
// ─────────────────────────────────────────────────────────────
const deleteEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} deleteEmployee → request received for ID: ${id}`,
    );
    const employee = await (0, master_service_1.delteEmployeeService)(id);
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: { employee },
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteEmployee = deleteEmployee;
const deletePurpose = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} deletePurpose → request received for ID: ${id}`,
    );
    const purpose = await (0, master_service_1.deletePurposeService)(id);
    res.status(200).json({
      success: true,
      message: "Purpose deleted successfully",
      data: { purpose },
    });
  } catch (err) {
    next(err);
  }
};
exports.deletePurpose = deletePurpose;
const deleteVisitingArea = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} deleteVisitingArea → request received for ID: ${id}`,
    );
    const visitingArea = await (0, master_service_1.deleteVisitorAreaService)(
      id,
    );
    res.status(200).json({
      success: true,
      message: "Visiting area deleted successfully",
      data: { visitingArea },
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteVisitingArea = deleteVisitingArea;
const deleteCarryWith = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} deleteCarryWith → request received for ID: ${id}`,
    );
    const carryWithItem = await (0, master_service_1.deleteCarryWithService)(
      id,
    );
    res.status(200).json({
      success: true,
      message: "Carry-with item deleted successfully",
      data: { carryWithItem },
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteCarryWith = deleteCarryWith;
const deleteVisitorType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger_utils_1.default.info(
      `[CONTROLLER]{master/master.controller} deleteVisitorType → request received for ID: ${id}`,
    );
    const visitorType = await (0, master_service_1.deleteVisitorTypeService)(
      id,
    );
    res.status(200).json({
      success: true,
      message: "Visitor type deleted successfully",
      data: { visitorType },
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteVisitorType = deleteVisitorType;
