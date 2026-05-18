var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
import * as gp_service_1 from "../gate_pass/gp.service.js";
import logger_utils_1 from "../../utils/logger.utils.js";
const handleFormSubmission = async (req, res) => {
  try {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({
        status: "error",
        message: "Expected multipart/form-data. Check your frontend headers."
      });
    }
    // When upload.fields() is used, req.files is a dictionary, not a single file
    const files = req.files;
    const photoFiles = files?.["photo"];
    if (!photoFiles || photoFiles.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No photo uploaded."
      });
    }
    const photo = photoFiles[0];
    // Collect aadhar files in order: aadharFile_0, aadharFile_1, …
    const aadharFiles = [];
    let i = 0;
    while (files?.[`aadharFile_${i}`]) {
      aadharFiles.push(files[`aadharFile_${i}`][0]);
      i++;
    }
    logger_utils_1.debug(`Content-Type: ${contentType}`);
    logger_utils_1.debug(`Photo: ${photo.originalname} (${photo.size} bytes)`);
    logger_utils_1.debug(`Aadhar files received: ${aadharFiles.length}`);
    logger_utils_1.debug(`Body keys: ${Object.keys(req.body).join(", ")}`);
    const result = await (0, gp_service_1.processForm)(req.body, photo, aadharFiles);
    return res.status(201).json(result);
  } catch (error) {
    logger_utils_1.error(`Form submission failed: ${error.message}`);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error"
    });
  }
};
export { handleFormSubmission };