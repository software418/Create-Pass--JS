import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
};
import multer_1 from "multer";
import path_1 from "path";
import fs_1 from "fs"; // Ensure the directory exists
const uploadDir = path_1.join(__dirname, "../../uploads");
if (!fs_1.existsSync(uploadDir)) {
  fs_1.mkdirSync(uploadDir, {
    recursive: true
  });
}
const storage = multer_1.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.extname(file.originalname)}`);
  }
});
export const upload = (0, multer_1)({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  } // 5MB limit
});