import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import assignmentRoutes from "./routes/assignment.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

// --- Core Middleware ---
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static file serving for uploads ---
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- Health Check ---
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

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
