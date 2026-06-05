import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import assignmentRoutes from "./routes/assignment.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import libraryRoutes from "./routes/library.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:3000",
].filter(Boolean);

// --- Core Middleware ---
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static file serving for uploads ---
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- Health Check ---
app.get("/", (_req, res) => {
  res.json({ success: true, message: "VedaAI API is live 🚀" });
});
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "VedaAI Backend is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assignments", authMiddleware, assignmentRoutes);
app.use("/api/library", libraryRoutes);

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
