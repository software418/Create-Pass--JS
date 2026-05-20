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
const generateGatePassId = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let isUnique = false;
  let code = "";
  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existing = await prisma.formData.findUnique({
      where: { gatePassId: code }
    });
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
};

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
    const gatePassId = await generateGatePassId();
    const pass = await prisma.formData.create({
      data: {
        gatePassId,
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
        status: data.status || "Requested",
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

const updatePassStatusService = async (idOrCode, status, updateData = {}) => {
  try {
    const pass = await prisma.formData.findFirst({
      where: {
        OR: [
          { id: idOrCode },
          { gatePassId: idOrCode }
        ]
      }
    });

    if (!pass) {
      throw new Error(`Gate pass not found with code/ID: ${idOrCode}`);
    }

    const dataToUpdate = { status };

    if (status === "Pending") {
      dataToUpdate.rejectedBy = null;
      dataToUpdate.rejectedAt = null;
      dataToUpdate.rejectionReason = null;
    } else if (status === "Approved") {
      dataToUpdate.approvedBy = updateData.approvedBy || "Admin";
      dataToUpdate.approvedAt = new Date();
    } else if (status === "Rejected") {
      dataToUpdate.rejectedBy = updateData.rejectedBy || "Admin";
      dataToUpdate.rejectedAt = new Date();
      dataToUpdate.rejectionReason = updateData.rejectionReason || "No reason specified";
    } else if (status === "Checked-In") {
      dataToUpdate.checkedInBy = updateData.checkedInBy || "Security";
      dataToUpdate.checkedInAt = new Date();
    } else if (status === "Checked-Out") {
      dataToUpdate.checkedOutBy = updateData.checkedOutBy || "Security";
      dataToUpdate.checkedOutAt = new Date();
    }

    Object.assign(dataToUpdate, updateData);

    const updatedPass = await prisma.formData.update({
      where: { id: pass.id },
      data: dataToUpdate,
      include: {
        persons: true
      }
    });
    logger_utils_1.info(`Gate pass ${pass.id} status updated to ${status}`);
    return updatedPass;
  } catch (err) {
    logger_utils_1.error(`updatePassStatusService error: ${err.message}`);
    throw new Error(err.message);
  }
};

const getPassByIdService = async (idOrCode) => {
  try {
    const pass = await prisma.formData.findFirst({
      where: {
        OR: [
          { id: idOrCode },
          { gatePassId: idOrCode }
        ]
      },
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

const getDashboardDataService = async () => {
  try {
    const passes = await prisma.formData.findMany({
      include: {
        persons: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const employees = await prisma.employee.findMany();
    const employeeMap = {};
    employees.forEach(emp => {
      employeeMap[emp.id] = emp.name;
    });

    const resolveEmployeeName = (toMeetWith) => {
      if (!toMeetWith) return '-';
      return employeeMap[toMeetWith] || toMeetWith;
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toISOString().split('T')[0];
    };

    const formatDateTime = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleString();
    };

    const mappedPasses = passes.map(p => {
      const passTypeLabel = p.gatePassType === 'single' ? 'Single' : 'Multi Day';
      return {
        ...p,
        pass: passTypeLabel,
        id: p.id,
        gate_pass_id: p.gatePassId || p.id.substring(0, 8),
        pass_date: formatDate(p.passDate),
        date: formatDate(p.passDate),
        timer: p.allowedHours ? `${p.allowedHours} hrs` : '-',
        name: p.name,
        employee: resolveEmployeeName(p.toMeetWith),
        mobile_no: p.mobileNo,
        'email-id': p.emailId,
        exp_date: p.to ? formatDate(p.to) : '-',
        approved_by: p.approvedBy || '-',
        approved_at: formatDateTime(p.approvedAt),
        rejected_by: p.rejectedBy || '-',
        rejected_at: formatDateTime(p.rejectedAt),
        rejection_reason: p.rejectionReason || '-',
        checked_in_by: p.checkedInBy || '-',
        checked_in_at: formatDateTime(p.checkedInAt),
        checked_out_by: p.checkedOutBy || '-',
        checked_out_at: formatDateTime(p.checkedOutAt),
        'checked-in': formatDateTime(p.checkedInAt),
        'checked-out': formatDateTime(p.checkedOutAt),
      };
    });

    // Let's count stats
    const totalCompaniesGuest = mappedPasses.length;
    
    // Count today's guests (passDate is today)
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysGuest = mappedPasses.filter(p => p.pass_date === todayStr).length;

    // Filter by statuses exactly according to 6 categories
    const requestPassData = mappedPasses.filter(p => p.status === 'Requested');
    const pendingApprovalPassData = mappedPasses.filter(p => p.status === 'Pending');
    const approvedPassData = mappedPasses.filter(p => p.status === 'Approved');
    const insidePassData = mappedPasses.filter(p => p.status === 'Checked-In');
    const multiDayPassData = mappedPasses.filter(p => p.gatePassType === 'multi');
    const exitApprovedPassData = mappedPasses.filter(p => p.status === 'Checked-Out');

    return {
      stats: {
        totalCompaniesGuest,
        todaysGuest
      },
      requestPassData,
      pendingApprovalPassData,
      approvedPassData,
      insidePassData,
      multiDayPassData,
      exitApprovedPassData
    };
  } catch (err) {
    logger_utils_1.error(`getDashboardDataService error: ${err.message}`);
    throw new Error(err.message);
  }
};

export { processForm, getPassesService, updatePassStatusService, getPassByIdService, getDashboardDataService };