var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
import appError_1 from "../../utils/appError.js";
import * as jwt_utils_1 from "../../utils/jwt.utils.js";
import { prisma } from "../../config/db.js";
import * as bcrypt from "bcryptjs";
const registerUser = async data => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });
  if (existingUser) {
    throw new appError_1("Email already exists", 400, "CONFLICT_ERROR");
  }
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword
    }
  });
  const token = (0, jwt_utils_1.signToken)(newUser.id);
  newUser.password = undefined;
  return {
    user: newUser,
    token
  };
};
export { registerUser };
const loginUser = async data => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new appError_1("Incorrect email or password", 401, "INVALID_CREDENTIAL");
  }
  const token = (0, jwt_utils_1.signToken)(user.id);
  user.password = undefined;
  return {
    user,
    token
  };
};
export { loginUser };