"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
// custom format
const customFormat = winston_1.default.format.printf(
  ({ timestamp, level, message }) => {
    return `${level}: ${message} - { ${timestamp} }`;
  },
);
const logger = winston_1.default.createLogger({
  // In development, log everything ('debug' and up). In prod, log 'info' and up.
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston_1.default.format.combine(
    winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }),
  ),
  transports: [
    // 1. Console (With Colors & Custom Format)
    new winston_1.default.transports.Console({
      format: winston_1.default.format.combine(
        winston_1.default.format.colorize({ all: true }), // Colorize the whole line
        customFormat, // Use your custom layout
      ),
    }),
    // 2. Files (No Colors, otherwise text files get weird symbols like \x1b[32m)
    new winston_1.default.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: customFormat,
    }),
    new winston_1.default.transports.File({
      filename: "logs/combined.log",
      format: customFormat,
    }),
  ],
});
exports.default = logger;
