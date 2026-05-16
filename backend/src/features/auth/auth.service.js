"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const jwt_utils_1 = require("../../utils/jwt.utils");
const { prisma } = require('../../config/db');
const bcrypt = require('bcryptjs');

const registerUser = async (data) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new appError_1.default("Email already exists", 400, "CONFLICT_ERROR");
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        }
    });
    const token = (0, jwt_utils_1.signToken)(newUser.id);
    newUser.password = undefined;
    return { user: newUser, token };
};
exports.registerUser = registerUser;

const loginUser = async (data) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
        throw new appError_1.default("Incorrect email or password", 401, "INVALID_CREDENTIAL");
    }
    const token = (0, jwt_utils_1.signToken)(user.id);
    user.password = undefined;
    return { user, token };
};
exports.loginUser = loginUser;
