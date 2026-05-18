var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
import * as catchAsync_1 from "../utils/catchAsync.js";
import appError_1 from "../utils/appError.js";
import * as jwt_utils_1 from "../utils/jwt.utils.js";
import { prisma } from "../config/db.js";
export const protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new appError_1("You are not logged in! Please log in to get access.", 401, "TOKEN_NOT_PROVIDED"));
  }
  const decoded = (0, jwt_utils_1.verifyToken)(token);
  if (!decoded) {
    return next(new appError_1("Invalid or expired token.", 401, "TOKEN_EXPIRED"));
  }
  const currentUser = await prisma.user.findUnique({
    where: {
      id: decoded.id
    }
  });
  if (!currentUser) {
    return next(new appError_1("The user belonging to this token does no longer exist.", 401, "USER_NOT_EXIST"));
  }
  req.user = currentUser;
  next();
});
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError_1("You do not have permission to perform this action", 403, "FORBIDEN_USER"));
    }
    next();
  };
};
export { restrictTo };