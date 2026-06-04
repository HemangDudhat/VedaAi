import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import assignmentRoutes from "./routes/assignment.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

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
app.use("/api/assignments", assignmentRoutes);

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
