"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisitorTypeService =
  exports.deleteVisitorAreaService =
  exports.deleteCarryWithService =
  exports.deletePurposeService =
  exports.delteEmployeeService =
  exports.updateVisitortypeService =
  exports.updateVisitingAreaService =
  exports.updateCarrywithService =
  exports.updatepurposeService =
  exports.updateEmployeeService =
  exports.createVisitorTypeService =
  exports.createVisitingAreaService =
  exports.createCarryWithItemService =
  exports.createPurposeService =
  exports.createEmployeeService =
  exports.getVisitorTypeService =
  exports.getCarryWithService =
  exports.getVisitingAreaService =
  exports.getEmployeeService =
  exports.getPurposeService =
    void 0;
const carry_with_model_1 = require("./carry_with.model");
const employee_model_1 = require("./employee.model");
const purpose_model_1 = require("./purpose.model");
const visiting_area_model_1 = require("./visiting_area.model");
const visitor_type_model_1 = require("./visitor_type.model");
const carry_with_model_2 = require("./carry_with.model");
const employee_model_2 = require("./employee.model");
const purpose_model_2 = require("./purpose.model");
const visiting_area_model_2 = require("./visiting_area.model");
const visitor_type_model_2 = require("./visitor_type.model");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
const appError_1 = __importDefault(require("../../utils/appError"));
// ─────────────────────────────────────────────────────────────
// GET Services
// ─────────────────────────────────────────────────────────────
const getPurposeService = async () => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--getPurpose} getPurpose requested`,
  );
  const purpose = await purpose_model_1.Purpose.find({ status: "active" });
  return purpose;
};
exports.getPurposeService = getPurposeService;
const getEmployeeService = async () => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--getEmployee} getEmployee requested`,
  );
  const employee = await employee_model_1.Employee.find({ status: "active" });
  return employee;
};
exports.getEmployeeService = getEmployeeService;
// BUG FIX: was querying CarryWith instead of VisitingArea
const getVisitingAreaService = async () => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--getVisitingArea} getVisitingArea requested`,
  );
  const visitingArea = await visiting_area_model_1.VisitingArea.find({
    status: "active",
  });
  return visitingArea;
};
exports.getVisitingAreaService = getVisitingAreaService;
// BUG FIX: was querying VisitingArea instead of CarryWith
const getCarryWithService = async () => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--getCarryWith} getCarryWith requested`,
  );
  const carryWith = await carry_with_model_1.CarryWith.find({
    status: "active",
  });
  return carryWith;
};
exports.getCarryWithService = getCarryWithService;
const getVisitorTypeService = async () => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--getVisitorType} getVisitorType requested`,
  );
  const visitorType = await visitor_type_model_1.VisitorType.find({
    status: "active",
  });
  return visitorType;
};
exports.getVisitorTypeService = getVisitorTypeService;
// ─────────────────────────────────────────────────────────────
// CREATE Services
// ─────────────────────────────────────────────────────────────
const createEmployeeService = async (data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--createEmployee} createEmployee requested`,
  );
  const newEmployee = await employee_model_1.Employee.create({
    ...data,
    status: employee_model_2.STATUS.ACTIVE,
  });
  return newEmployee;
};
exports.createEmployeeService = createEmployeeService;
const createPurposeService = async (data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--createPurpose} createPurpose requested`,
  );
  const newPurpose = await purpose_model_1.Purpose.create({
    ...data,
    status: purpose_model_2.STATUS.ACTIVE,
  });
  return newPurpose;
};
exports.createPurposeService = createPurposeService;
const createCarryWithItemService = async (data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--createCarryWithItem} createCarryWithItem requested`,
  );
  const newCarryItem = await carry_with_model_1.CarryWith.create({
    ...data,
    status: carry_with_model_2.STATUS.ACTIVE,
  });
  return newCarryItem;
};
exports.createCarryWithItemService = createCarryWithItemService;
const createVisitingAreaService = async (data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--createVisitingArea} createVisitingArea requested`,
  );
  const newVisitingArea = await visiting_area_model_1.VisitingArea.create({
    ...data,
    status: visiting_area_model_2.STATUS.ACTIVE,
  });
  return newVisitingArea;
};
exports.createVisitingAreaService = createVisitingAreaService;
const createVisitorTypeService = async (data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--createVisitorType} createVisitorType requested`,
  );
  const newVisitorType = await visitor_type_model_1.VisitorType.create({
    ...data,
    status: visitor_type_model_2.STATUS.ACTIVE,
  });
  return newVisitorType;
};
exports.createVisitorTypeService = createVisitorTypeService;
// ─────────────────────────────────────────────────────────────
// UPDATE Services
// ─────────────────────────────────────────────────────────────
const updateEmployeeService = async (employeeId, data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--updateEmployee} updateEmployee requested for ID: ${employeeId}`,
  );
  // BUG FIX: was missing await, so the existence check never actually executed
  const exist = await employee_model_1.Employee.findById(employeeId);
  if (!exist) {
    throw new appError_1.default("Employee not found", 404, "NOT_FOUND");
  }
  const employee = await employee_model_1.Employee.findByIdAndUpdate(
    employeeId,
    { $set: data },
    { new: true },
  );
  return employee;
};
exports.updateEmployeeService = updateEmployeeService;
const updatepurposeService = async (purposeId, data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--updatePurpose} updatePurpose requested for ID: ${purposeId}`,
  );
  // BUG FIX: was missing await, so the existence check never actually executed
  const exist = await purpose_model_1.Purpose.findById(purposeId);
  if (!exist) {
    throw new appError_1.default("Purpose not found", 404, "NOT_FOUND");
  }
  const purpose = await purpose_model_1.Purpose.findByIdAndUpdate(
    purposeId,
    { $set: data },
    { new: true },
  );
  return purpose;
};
exports.updatepurposeService = updatepurposeService;
const updateCarrywithService = async (itemId, data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--updateCarryWith} updateCarryWith requested for ID: ${itemId}`,
  );
  // BUG FIX: was missing await, so the existence check never actually executed
  const exist = await carry_with_model_1.CarryWith.findById(itemId);
  if (!exist) {
    throw new appError_1.default("Carry With item not found", 404, "NOT_FOUND");
  }
  const item = await carry_with_model_1.CarryWith.findByIdAndUpdate(
    itemId,
    { $set: data },
    { new: true },
  );
  return item;
};
exports.updateCarrywithService = updateCarrywithService;
const updateVisitingAreaService = async (areaId, data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--updateVisitingArea} updateVisitingArea requested for ID: ${areaId}`,
  );
  // BUG FIX: was missing await, so the existence check never actually executed
  const exist = await visiting_area_model_1.VisitingArea.findById(areaId);
  if (!exist) {
    throw new appError_1.default("Visiting area not found", 404, "NOT_FOUND");
  }
  const area = await visiting_area_model_1.VisitingArea.findByIdAndUpdate(
    areaId,
    { $set: data },
    { new: true },
  );
  return area;
};
exports.updateVisitingAreaService = updateVisitingAreaService;
const updateVisitortypeService = async (visitorId, data) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--updateVisitorType} updateVisitorType requested for ID: ${visitorId}`,
  );
  const exist = await visitor_type_model_1.VisitorType.findById(visitorId);
  if (!exist) {
    throw new appError_1.default("Visitor type not found", 404, "NOT_FOUND");
  }
  // BUG FIX: was missing await, so the updated document was never returned
  const visitorType = await visitor_type_model_1.VisitorType.findByIdAndUpdate(
    visitorId,
    { $set: data },
    { new: true },
  );
  return visitorType;
};
exports.updateVisitortypeService = updateVisitortypeService;
// ─────────────────────────────────────────────────────────────
// DELETE Services
// ─────────────────────────────────────────────────────────────
const delteEmployeeService = async (employeeId) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--deleteEmployee} deleteEmployee requested for ID: ${employeeId}`,
  );
  const exist = await employee_model_1.Employee.findById(employeeId);
  if (!exist) {
    throw new appError_1.default("Employee not found", 404, "NOT_FOUND");
  }
  if (exist.status === "deleted") {
    throw new appError_1.default(
      "Employee is already deleted",
      409,
      "CONFLICT",
    );
  }
  const employee = await employee_model_1.Employee.findOneAndDelete({
    _id: employeeId,
  });
  return employee;
};
exports.delteEmployeeService = delteEmployeeService;
const deletePurposeService = async (purposeId) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--deletePurpose} deletePurpose requested for ID: ${purposeId}`,
  );
  const exist = await purpose_model_1.Purpose.findById(purposeId);
  if (!exist) {
    throw new appError_1.default("Purpose not found", 404, "NOT_FOUND");
  }
  if (exist.status === "deleted") {
    throw new appError_1.default("Purpose is already deleted", 409, "CONFLICT");
  }
  const purpose = await purpose_model_1.Purpose.findOneAndDelete({
    _id: purposeId,
  });
  return purpose;
};
exports.deletePurposeService = deletePurposeService;
const deleteCarryWithService = async (itemId) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--deleteCarryWith} deleteCarryWith requested for ID: ${itemId}`,
  );
  const exist = await carry_with_model_1.CarryWith.findById(itemId);
  if (!exist) {
    throw new appError_1.default("Carry-with item not found", 404, "NOT_FOUND");
  }
  if (exist.status === "deleted") {
    throw new appError_1.default(
      "Carry-with item is already deleted",
      409,
      "CONFLICT",
    );
  }
  const carryWith = await carry_with_model_1.CarryWith.findOneAndDelete({
    _id: itemId,
  });
  return carryWith;
};
exports.deleteCarryWithService = deleteCarryWithService;
const deleteVisitorAreaService = async (areaId) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--deleteVisitingArea} deleteVisitingArea requested for ID: ${areaId}`,
  );
  // BUG FIX: error message said "Employee not found" instead of "Visiting area not found"
  const exist = await visiting_area_model_1.VisitingArea.findById(areaId);
  if (!exist) {
    throw new appError_1.default("Visiting area not found", 404, "NOT_FOUND");
  }
  // BUG FIX: error message said "Account is already deleted" instead of entity-specific message
  if (exist.status === "deleted") {
    throw new appError_1.default(
      "Visiting area is already deleted",
      409,
      "CONFLICT",
    );
  }
  const area = await visiting_area_model_1.VisitingArea.findOneAndDelete({
    _id: areaId,
  });
  return area;
};
exports.deleteVisitorAreaService = deleteVisitorAreaService;
const deleteVisitorTypeService = async (visitorId) => {
  logger_utils_1.default.info(
    `[SERVICE]{master/master.service--deleteVisitorType} deleteVisitorType requested for ID: ${visitorId}`,
  );
  // BUG FIX: error message said "Employee not found" instead of "Visitor type not found"
  const exist = await visitor_type_model_1.VisitorType.findById(visitorId);
  if (!exist) {
    throw new appError_1.default("Visitor type not found", 404, "NOT_FOUND");
  }
  // BUG FIX: error message said "Account is already deleted" instead of entity-specific message
  if (exist.status === "deleted") {
    throw new appError_1.default(
      "Visitor type is already deleted",
      409,
      "CONFLICT",
    );
  }
  const visitor = await visitor_type_model_1.VisitorType.findOneAndDelete({
    _id: visitorId,
  });
  return visitor;
};
exports.deleteVisitorTypeService = deleteVisitorTypeService;
