import AppError from "../../utils/appError.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.utils.js";
import { prisma } from "../../config/db.js";
import * as bcrypt from "bcryptjs";

const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existingUser) {
    throw new AppError("Email already exists", 400, "CONFLICT_ERROR");
  }
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });
  
  const accessToken = signAccessToken(newUser.id);
  const refreshToken = signRefreshToken(newUser.id);
  
  newUser.password = undefined;
  
  return {
    user: newUser,
    accessToken,
    refreshToken
  };
};

const loginUser = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    include: {
      roleRef: {
        include: {
          permissions: true
        }
      }
    }
  });
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new AppError("Incorrect email or password", 401, "INVALID_CREDENTIAL");
  }
  
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  
  user.password = undefined;
  
  return {
    user,
    accessToken,
    refreshToken
  };
};

export { registerUser, loginUser };