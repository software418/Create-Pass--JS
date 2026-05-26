import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";
import { prisma } from "../config/db.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401, "TOKEN_NOT_PROVIDED"));
  }
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return next(new AppError("Invalid or expired token.", 401, "TOKEN_EXPIRED"));
  }
  const currentUser = await prisma.user.findUnique({
    where: {
      id: decoded.id
    },
    include: {
      roleRef: {
        include: {
          permissions: true
        }
      }
    }
  });
  if (!currentUser) {
    return next(new AppError("The user belonging to this token does no longer exist.", 401, "USER_NOT_EXIST"));
  }
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403, "FORBIDDEN_USER"));
    }
    next();
  };
};