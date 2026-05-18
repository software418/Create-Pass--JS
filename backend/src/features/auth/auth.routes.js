var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function () {
  var ownKeys = function (o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
      var ar = [];
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
}();
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
import express_1 from "express";
import * as authController from "./auth.controller.js";
import * as validation_middleware_1 from "../../middleware/validation.middleware.js";
import * as auth_schema_1 from "./auth.schema.js";
import * as auth_middleware_1 from "../../middleware/auth.middleware.js";
import * as ratelimit_middleware_1 from "../../middleware/ratelimit.middleware.js";
const router = express_1.Router();
router.post("/register", ratelimit_middleware_1.authLimiter, (0, validation_middleware_1.validate)(auth_schema_1.registerSchema), authController.register);
router.post("/login", ratelimit_middleware_1.authLimiter, (0, validation_middleware_1.validate)(auth_schema_1.loginSchema), authController.login);
router.get("/me", auth_middleware_1.protect, authController.getMe);
export default router;