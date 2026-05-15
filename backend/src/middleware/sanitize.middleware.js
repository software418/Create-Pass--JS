"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.securityHeaders = void 0;
const helmet_1 = __importDefault(require("helmet"));
// Custom sanitization if needed can be placed here, though express-mongo-sanitize
// is usually applied globally in app.js.
exports.securityHeaders = (0, helmet_1.default)();
const cleanObject = (obj) => {
  if (typeof obj !== "object" || obj === null) return;
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].replace(/<[^>]*>?/gm, ""); // simple strip tags
    } else if (typeof obj[key] === "object") {
      cleanObject(obj[key]);
    }
  }
};
const sanitizeInput = (req, res, next) => {
  cleanObject(req.body);
  cleanObject(req.query);
  cleanObject(req.params);
  next();
};
exports.sanitizeInput = sanitizeInput;
