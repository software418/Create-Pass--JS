import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
import fs_1 from "fs";
import path_1 from "path";
import logger_utils_1 from "../../utils/logger.utils.js";
import { prisma } from "../../config/db.js";
const processForm = async (data, file, aadharFiles) => {
  try {
    const uploadDir = path_1.join(__dirname, "../../uploads");
    if (!fs_1.existsSync(uploadDir)) {
      fs_1.mkdirSync(uploadDir, {
        recursive: true
      });
    }
    let photoUrl = "";
    if (file) {
      const photoFileName = `${Date.now()}-${file.originalname}`;
      const photoSavePath = path_1.join(uploadDir, photoFileName);
      fs_1.writeFileSync(photoSavePath, file.buffer);
      photoUrl = `/uploads/${photoFileName}`;
    }
    let carryWith = data.carryWith;
    let visitArea = data.visitArea;
    let persons = data.persons;
    try {
      carryWith = typeof carryWith === "string" ? JSON.parse(carryWith) : carryWith;
      if (!Array.isArray(carryWith)) carryWith = [];
    } catch {
      carryWith = [];
    }
    try {
      visitArea = typeof visitArea === "string" ? JSON.parse(visitArea) : visitArea;
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
    const personsWithFileUrls = persons.map((person, index) => {
      const aadharFile = aadharFiles && aadharFiles[index];
      if (aadharFile) {
        const aadharFileName = `aadhar-${Date.now()}-${index}-${aadharFile.originalname}`;
        const aadharSavePath = path_1.join(uploadDir, aadharFileName);
        fs_1.writeFileSync(aadharSavePath, aadharFile.buffer);
        return {
          ...person,
          aadharFileUrl: `/uploads/${aadharFileName}`
        };
      }
      return {
        ...person,
        aadharFileUrl: ""
      };
    });
    const pass = await prisma.formData.create({
      data: {
        gatePassType: data.gatePassType || "single",
        passDate: new Date(data.passDate || Date.now()),
        from: data.from ? new Date(data.from) : null,
        to: data.to ? new Date(data.to) : null,
        mobileNo: data.mobileNo || "",
        name: data.name || "",
        emailId: data.emailId || "",
        companyName: data.companyName,
        address: data.address,
        state: data.state,
        city: data.city,
        representingVisitorType: data.representingVisitorType,
        subLocation: data.subLocation,
        toMeetWith: data.toMeetWith,
        carryWith: carryWith,
        idType: data.idType,
        idNumber: data.idNumber,
        description: data.description,
        maskCovid: data.maskCovid || "",
        noOfPerson: Number(data.noOfPerson) || 0,
        visitArea: visitArea,
        purpose: data.purpose,
        allowedHours: data.allowedHours,
        photoUrl: photoUrl,
        persons: {
          create: personsWithFileUrls.map(p => ({
            name: p.name || "",
            phoneNo: p.phoneNo || "",
            aadharNumber: p.aadharNumber || "",
            aadharFileUrl: p.aadharFileUrl
          }))
        }
      },
      include: {
        persons: true
      }
    });
    logger_utils_1.info(`Gate pass created: ${pass.id}`);
    return {
      success: true,
      photoUrl,
      data: pass
    };
  } catch (err) {
    logger_utils_1.error(`processForm error: ${err.message}`);
    throw new Error(err.message);
  }
};

const getPassesService = async (filters = {}) => {
  try {
    const passes = await prisma.formData.findMany({
      where: filters,
      include: {
        persons: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return passes;
  } catch (err) {
    logger_utils_1.error(`getPassesService error: ${err.message}`);
    throw new Error(err.message);
  }
};

const updatePassStatusService = async (id, status, updateData = {}) => {
  try {
    const pass = await prisma.formData.update({
      where: { id },
      data: {
        status,
        ...updateData
      },
      include: {
        persons: true
      }
    });
    logger_utils_1.info(`Gate pass ${id} status updated to ${status}`);
    return pass;
  } catch (err) {
    logger_utils_1.error(`updatePassStatusService error: ${err.message}`);
    throw new Error(err.message);
  }
};

const getPassByIdService = async (id) => {
  try {
    const pass = await prisma.formData.findUnique({
      where: { id },
      include: {
        persons: true
      }
    });
    return pass;
  } catch (err) {
    logger_utils_1.error(`getPassByIdService error: ${err.message}`);
    throw new Error(err.message);
  }
};

export { processForm, getPassesService, updatePassStatusService, getPassByIdService };