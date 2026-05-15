"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./config/env"));
const app_1 = __importDefault(require("./app"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const logger_utils_1 = __importDefault(require("./utils/logger.utils"));
process.on("uncaughtException", (err) => {
  logger_utils_1.default.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger_utils_1.default.error(err.name, err.message);
  process.exit(1);
});
(0, db_1.connectDB)();
const port = env_1.default.PORT || 5000;
const server = app_1.default.listen(port, () => {
  logger_utils_1.default.info(`App running on port ${port}...`);
  console.log(`App running on port ${port}...`);
});
app_1.default.use(
  "/uploads",
  express_1.default.static(path_1.default.join(__dirname, "../../uploads")),
);
process.on("unhandledRejection", (err) => {
  logger_utils_1.default.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger_utils_1.default.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
