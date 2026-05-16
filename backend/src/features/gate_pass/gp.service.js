"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processForm = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
const { prisma } = require('../../config/db');

const processForm = async (data, file, aadharFiles) => {
    try {
        const uploadDir = path_1.default.join(__dirname, "../../uploads");
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        
        let photoUrl = "";
        if (file) {
            const photoFileName = `${Date.now()}-${file.originalname}`;
            const photoSavePath = path_1.default.join(uploadDir, photoFileName);
            fs_1.default.writeFileSync(photoSavePath, file.buffer);
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
                const aadharSavePath = path_1.default.join(uploadDir, aadharFileName);
                fs_1.default.writeFileSync(aadharSavePath, aadharFile.buffer);
                return { ...person, aadharFileUrl: `/uploads/${aadharFileName}` };
            }
            return { ...person, aadharFileUrl: "" };
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
            include: { persons: true }
        });
        
        logger_utils_1.default.info(`Gate pass created: ${pass.id}`);
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
