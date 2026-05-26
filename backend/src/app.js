var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
import express_1 from "express";
import cors_1 from "cors";
import * as sanitize_middleware_1 from "./middleware/sanitize.middleware.js";
import * as ratelimit_middleware_1 from "./middleware/ratelimit.middleware.js";
import morgan_1 from "morgan";
import logger_utils_1 from "./utils/logger.utils.js";
import errorHandler_1 from "./middleware/errorHandler.js"; // import authRoutes from "./features/auth/auth.routes";
import gp_routes_1 from "./features/gate_pass/gp.routes.js";
import master_routes_1 from "./features/master/master.routes.js";
import report_routes_1 from "./features/report/report.routes.js";
const app = (0, express_1)();
// 1. GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(sanitize_middleware_1.securityHeaders);
app.use("/api", ratelimit_middleware_1.apiLimiter);
app.use(express_1.json({
  limit: "10kb"
}));
app.use(express_1.urlencoded({
  extended: true,
  limit: "10kb"
}));
app.use(sanitize_middleware_1.sanitizeInput);
// Development logging
const stream = {
  write: message => logger_utils_1.http(message.trim())
};
// 3. Apply Morgan WITH the stream option attached!
app.use((0, morgan_1)("[:method]|| :url ||Status::status ||ResponseTime: { :response-time ms }  ||Device: { :user-agent }", {
  stream: stream
}));
// Implement CORS
app.use((0, cors_1)({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
// Data sanitization against XSS
logger_utils_1.info(`Routing requested`);
// 2. ROUTES
// app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/capture", gp_routes_1);
app.use("/api/v1/master", master_routes_1);
app.use("/api/v1/report", report_routes_1);

// Initialize Cron Job
import { initCronJob } from "./utils/cron.js";
initCronJob();

// 3. ERROR HANDLING MIDDLEWARE
app.use(errorHandler_1);
export default app;