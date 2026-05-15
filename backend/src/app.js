"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sanitize_middleware_1 = require("./middleware/sanitize.middleware");
const ratelimit_middleware_1 = require("./middleware/ratelimit.middleware");
const morgan_1 = __importDefault(require("morgan"));
const logger_utils_1 = __importDefault(require("./utils/logger.utils"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
// import authRoutes from "./features/auth/auth.routes";
const gp_routes_1 = __importDefault(require("./features/gate_pass/gp.routes"));
const master_routes_1 = __importDefault(
  require("./features/master/master.routes"),
);
const app = (0, express_1.default)();
// 1. GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(sanitize_middleware_1.securityHeaders);
app.use("/api", ratelimit_middleware_1.apiLimiter);
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use(sanitize_middleware_1.sanitizeInput);
// Development logging
const stream = {
  write: (message) => logger_utils_1.default.http(message.trim()),
};
// 3. Apply Morgan WITH the stream option attached!
app.use(
  (0, morgan_1.default)(
    "[:method]|| :url ||Status::status ||ResponseTime: { :response-time ms }  ||Device: { :user-agent }",
    { stream: stream },
  ),
);
// Implement CORS
app.use(
  (0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
// Data sanitization against XSS
logger_utils_1.default.info(`Routing requested`);
// 2. ROUTES
// app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/capture", gp_routes_1.default);
app.use("/api/v1/master", master_routes_1.default);
// 3. ERROR HANDLING MIDDLEWARE
app.use(errorHandler_1.default);
exports.default = app;
