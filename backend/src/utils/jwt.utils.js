var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
import jsonwebtoken_1 from "jsonwebtoken";
import env_1 from "../config/env.js";
const signToken = id => {
  return jsonwebtoken_1.sign({
    id
  }, env_1.JWT_SECRET, {
    expiresIn: 15
  });
};
export { signToken };
const verifyToken = token => {
  try {
    return jsonwebtoken_1.verify(token, env_1.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
export { verifyToken };