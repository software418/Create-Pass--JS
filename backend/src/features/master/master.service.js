"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisitorTypeService = exports.deleteVisitorAreaService = exports.deleteCarryWithService = exports.deletePurposeService = exports.delteEmployeeService = exports.updateVisitortypeService = exports.updateVisitingAreaService = exports.updateCarrywithService = exports.updatepurposeService = exports.updateEmployeeService = exports.createVisitorTypeService = exports.createVisitingAreaService = exports.createCarryWithItemService = exports.createPurposeService = exports.createEmployeeService = exports.getVisitorTypeService = exports.getCarryWithService = exports.getVisitingAreaService = exports.getEmployeeService = exports.getPurposeService = void 0;

const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
const appError_1 = __importDefault(require("../../utils/appError"));
const { prisma } = require('../../config/db');

// GET Services
const getPurposeService = async () => {
    return await prisma.purpose.findMany({ where: { status: "active" } });
};
exports.getPurposeService = getPurposeService;

const getEmployeeService = async () => {
    return await prisma.employee.findMany({ where: { status: "active" } });
};
exports.getEmployeeService = getEmployeeService;

const getVisitingAreaService = async () => {
    return await prisma.visitingArea.findMany({ where: { status: "active" } });
};
exports.getVisitingAreaService = getVisitingAreaService;

const getCarryWithService = async () => {
    return await prisma.carryWith.findMany({ where: { status: "active" } });
};
exports.getCarryWithService = getCarryWithService;

const getVisitorTypeService = async () => {
    return await prisma.visitorType.findMany({ where: { status: "active" } });
};
exports.getVisitorTypeService = getVisitorTypeService;

// CREATE Services
const createEmployeeService = async (data) => {
    return await prisma.employee.create({ data: { ...data, status: "active" } });
};
exports.createEmployeeService = createEmployeeService;

const createPurposeService = async (data) => {
    return await prisma.purpose.create({ data: { ...data, status: "active" } });
};
exports.createPurposeService = createPurposeService;

const createCarryWithItemService = async (data) => {
    return await prisma.carryWith.create({ data: { ...data, status: "active" } });
};
exports.createCarryWithItemService = createCarryWithItemService;

const createVisitingAreaService = async (data) => {
    return await prisma.visitingArea.create({ data: { ...data, status: "active" } });
};
exports.createVisitingAreaService = createVisitingAreaService;

const createVisitorTypeService = async (data) => {
    return await prisma.visitorType.create({ data: { ...data, status: "active" } });
};
exports.createVisitorTypeService = createVisitorTypeService;

// UPDATE Services
const updateEmployeeService = async (employeeId, data) => {
    const exist = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!exist) throw new appError_1.default("Employee not found", 404, "NOT_FOUND");
    return await prisma.employee.update({ where: { id: employeeId }, data });
};
exports.updateEmployeeService = updateEmployeeService;

const updatepurposeService = async (purposeId, data) => {
    const exist = await prisma.purpose.findUnique({ where: { id: purposeId } });
    if (!exist) throw new appError_1.default("Purpose not found", 404, "NOT_FOUND");
    return await prisma.purpose.update({ where: { id: purposeId }, data });
};
exports.updatepurposeService = updatepurposeService;

const updateCarrywithService = async (itemId, data) => {
    const exist = await prisma.carryWith.findUnique({ where: { id: itemId } });
    if (!exist) throw new appError_1.default("Carry With item not found", 404, "NOT_FOUND");
    return await prisma.carryWith.update({ where: { id: itemId }, data });
};
exports.updateCarrywithService = updateCarrywithService;

const updateVisitingAreaService = async (areaId, data) => {
    const exist = await prisma.visitingArea.findUnique({ where: { id: areaId } });
    if (!exist) throw new appError_1.default("Visiting area not found", 404, "NOT_FOUND");
    return await prisma.visitingArea.update({ where: { id: areaId }, data });
};
exports.updateVisitingAreaService = updateVisitingAreaService;

const updateVisitortypeService = async (visitorId, data) => {
    const exist = await prisma.visitorType.findUnique({ where: { id: visitorId } });
    if (!exist) throw new appError_1.default("Visitor type not found", 404, "NOT_FOUND");
    return await prisma.visitorType.update({ where: { id: visitorId }, data });
};
exports.updateVisitortypeService = updateVisitortypeService;

// DELETE Services
const delteEmployeeService = async (employeeId) => {
    const exist = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!exist) throw new appError_1.default("Employee not found", 404, "NOT_FOUND");
    if (exist.status === "deleted") throw new appError_1.default("Employee is already deleted", 409, "CONFLICT");
    return await prisma.employee.delete({ where: { id: employeeId } });
};
exports.delteEmployeeService = delteEmployeeService;

const deletePurposeService = async (purposeId) => {
    const exist = await prisma.purpose.findUnique({ where: { id: purposeId } });
    if (!exist) throw new appError_1.default("Purpose not found", 404, "NOT_FOUND");
    if (exist.status === "deleted") throw new appError_1.default("Purpose is already deleted", 409, "CONFLICT");
    return await prisma.purpose.delete({ where: { id: purposeId } });
};
exports.deletePurposeService = deletePurposeService;

const deleteCarryWithService = async (itemId) => {
    const exist = await prisma.carryWith.findUnique({ where: { id: itemId } });
    if (!exist) throw new appError_1.default("Carry-with item not found", 404, "NOT_FOUND");
    if (exist.status === "deleted") throw new appError_1.default("Carry-with item is already deleted", 409, "CONFLICT");
    return await prisma.carryWith.delete({ where: { id: itemId } });
};
exports.deleteCarryWithService = deleteCarryWithService;

const deleteVisitorAreaService = async (areaId) => {
    const exist = await prisma.visitingArea.findUnique({ where: { id: areaId } });
    if (!exist) throw new appError_1.default("Visiting area not found", 404, "NOT_FOUND");
    if (exist.status === "deleted") throw new appError_1.default("Visiting area is already deleted", 409, "CONFLICT");
    return await prisma.visitingArea.delete({ where: { id: areaId } });
};
exports.deleteVisitorAreaService = deleteVisitorAreaService;

const deleteVisitorTypeService = async (visitorId) => {
    const exist = await prisma.visitorType.findUnique({ where: { id: visitorId } });
    if (!exist) throw new appError_1.default("Visitor type not found", 404, "NOT_FOUND");
    if (exist.status === "deleted") throw new appError_1.default("Visitor type is already deleted", 409, "CONFLICT");
    return await prisma.visitorType.delete({ where: { id: visitorId } });
};
exports.deleteVisitorTypeService = deleteVisitorTypeService;
