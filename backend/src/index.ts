import http from "http";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { logRedisConfig } from "./config/redis";
import { initWebSocket } from "./websocket/handler";
import { initGenerationWorker } from "./workers/generation.worker";
import { logger } from "./utils/logger";
import fs from "fs";
import path from "path";

const startServer = async (): Promise<void> => {
  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      logger.info("Created uploads directory");
    }

    // Connect to MongoDB
    await connectDB();

    // Log Redis config
    logRedisConfig();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize WebSocket
    initWebSocket(server);

    // Initialize BullMQ Worker
    initGenerationWorker();

    // Start listening
    const PORT = parseInt(env.PORT, 10);
    server.listen(PORT, () => {
      logger.success(`
╔══════════════════════════════════════════╗
║        VedaAI Backend Server             ║
║                                          ║
║  🚀 HTTP:      http://localhost:${PORT}     ║
║  🔌 WebSocket: ws://localhost:${PORT}/ws    ║
║  📦 Environment: ${env.NODE_ENV.padEnd(19)}║
╚══════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.warn("Shutting down gracefully...");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
