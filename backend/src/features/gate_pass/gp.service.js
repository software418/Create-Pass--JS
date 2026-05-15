"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.processForm = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
const gp_model_1 = require("./gp.model");
const processForm = async (data, file, aadharFiles) => {
  try {
    const uploadDir = path_1.default.join(__dirname, "../../uploads");
    if (!fs_1.default.existsSync(uploadDir)) {
      fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    // ── Save visitor photo ────────────────────────────────────────────────────
    const photoFileName = `${Date.now()}-${file.originalname}`;
    const photoSavePath = path_1.default.join(uploadDir, photoFileName);
    fs_1.default.writeFileSync(photoSavePath, file.buffer);
    const photoUrl = `/uploads/${photoFileName}`;
    // ── Parse JSON-encoded fields sent from multipart FormData ─────────────
    let carryWith = data.carryWith;
    let visitArea = data.visitArea;
    let persons = data.persons;
    try {
      carryWith =
        typeof carryWith === "string" ? JSON.parse(carryWith) : carryWith;
      if (!Array.isArray(carryWith)) carryWith = [];
    } catch {
      carryWith = [];
    }
    try {
      visitArea =
        typeof visitArea === "string" ? JSON.parse(visitArea) : visitArea;
      if (!Array.isArray(visitArea)) visitArea = [];
    } catch {
      visitArea = [];
    }
    try {
      persons = typeof persons === "string" ? JSON.parse(persons) : persons;
      if (!Array.isArray(persons)) persons = [];
    } catch {
      persons = [];
    }
    // ── Save each person's aadhar file and attach URL to person record ──────
    const personsWithFileUrls = persons.map((person, index) => {
      const aadharFile = aadharFiles[index];
      if (aadharFile) {
        const aadharFileName = `aadhar-${Date.now()}-${index}-${aadharFile.originalname}`;
        const aadharSavePath = path_1.default.join(uploadDir, aadharFileName);
        fs_1.default.writeFileSync(aadharSavePath, aadharFile.buffer);
        return { ...person, aadharFileUrl: `/uploads/${aadharFileName}` };
      }
      return person;
    });
    // ── Create DB record ───────────────────────────────────────────────────────
    const pass = await gp_model_1.FormData.create({
      ...data,
      carryWith,
      visitArea,
      persons: personsWithFileUrls,
      noOfPerson: Number(data.noOfPerson) || 0,
      photoUrl,
    });
    logger_utils_1.default.info(`Gate pass created: ${pass._id}`);
    return {
      success: true,
      photoUrl,
      data: pass,
    };
  } catch (err) {
    logger_utils_1.default.error(`processForm error: ${err.message}`);
    throw new Error(err.message);
  }
};
exports.processForm = processForm;
