import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
import env_1 from "./config/env.js";
import app_1 from "./app.js";
import express_1 from "express";
import path_1 from "path";
import * as db_1 from "./config/db.js";
import logger_utils_1 from "./utils/logger.utils.js";
process.on("uncaughtException", err => {
  logger_utils_1.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger_utils_1.error(err.name, err.message);
  process.exit(1);
});
(0, db_1.connectDB)();
const port = env_1.PORT || 5000;
const server = app_1.listen(port, () => {
  logger_utils_1.info(`App running on port ${port}...`);
  console.log(`App running on port ${port}...`);
});
app_1.use("/uploads", express_1.static(path_1.join(__dirname, "../../uploads")));
process.on("unhandledRejection", err => {
  logger_utils_1.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger_utils_1.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});