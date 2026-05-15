"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./env"));
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.default.MONGO_URI);
        logger_utils_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger_utils_1.default.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
