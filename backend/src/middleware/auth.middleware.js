"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = __importDefault(require("../utils/appError"));
const jwt_utils_1 = require("../utils/jwt.utils");
const user_model_1 = require("../features/users/user.model");
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new appError_1.default(
        "You are not logged in! Please log in to get access.",
        401,
        "TOKEN_NOT_PROVIDED",
      ),
    );
  }
  // 2) Verification token
  const decoded = (0, jwt_utils_1.verifyToken)(token);
  if (!decoded) {
    return next(
      new appError_1.default("Invalid or expired token.", 401, "TOKEN_EXPIRED"),
    );
  }
  // 3) Check if user still exists
  const currentUser = await user_model_1.User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError_1.default(
        "The user belonging to this token does no longer exist.",
        401,
        "USER_NOT_EXIST",
      ),
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError_1.default(
          "You do not have permission to perform this action",
          403,
          "FORBIDEN_USER",
        ),
      );
    }
    next();
  };
};
exports.restrictTo = restrictTo;
