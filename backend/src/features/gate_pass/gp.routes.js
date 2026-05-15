"use strict";
// import { Router } from 'express';
// import multer from 'multer';
// import { handleFormSubmission } from '../capture/formcontroller';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// // Configure Multer for Memory Storage (provides file.buffer)
// const upload = multer({
//   storage: multer.memoryStorage(),
//   // limits: { fileSize: 10 * 1024 * 1024 } // Optional: 5MB limit
// });
// // Use 'photo' as the field name to match your frontend
// router.post('/upload', upload.single('photo'), handleFormSubmission);
// export default router;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const gp_controller_1 = require("../gate_pass/gp.controller");
const router = (0, express_1.Router)();
// Memory storage — file.buffer is available in the controller/service
const upload = (0, multer_1.default)({
  storage: multer_1.default.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});
/**
 * Accept:
 *   - "photo"         — the single webcam capture (required)
 *   - "aadharFile_N"  — one file per person (optional, up to 20 persons)
 *
 * Using upload.fields() so multer collects all files into req.files (an object),
 * while req.body still carries every text/JSON field.
 */
router.post(
  "/upload",
  upload.fields([
    { name: "photo", maxCount: 1 },
    ...Array.from({ length: 20 }, (_, i) => ({
      name: `aadharFile_${i}`,
      maxCount: 1,
    })),
  ]),
  gp_controller_1.handleFormSubmission,
);
exports.default = router;
