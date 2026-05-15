"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const appError_1 = __importDefault(require("../utils/appError"));
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof zod_1.ZodError) {
        const errorMessages = error.errors.map(
          (issue) => `${issue.path.join(".")} is ${issue.message}`,
        );
        return next(
          new appError_1.default(
            `Validation Error: ${errorMessages.join(", ")}`,
            400,
            "VALIDAION_ERROR",
          ),
        );
      }
      return next(
        new appError_1.default("Internal Server Error", 500, "SERVER_ERROR"),
      );
    }
  };
};
exports.validate = validate;
