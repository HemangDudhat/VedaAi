import multer from "multer";
import path from "path";
import { AppError } from "./errorHandler";

// Allowed MIME types
const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "image/jpeg",
  "image/png",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type: ${file.mimetype}. Allowed types: PDF, TXT, JPEG, PNG`,
        400
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
