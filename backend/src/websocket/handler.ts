import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { logger } from "../utils/logger";
import type { WSMessage } from "../types";

let wss: WebSocketServer | null = null;

// Track connected clients
const clients = new Set<WebSocket>();

/**
 * Initialize WebSocket server attached to the HTTP server
 */
export const initWebSocket = (server: Server): WebSocketServer => {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);
    logger.info(`WebSocket client connected. Total clients: ${clients.size}`);

    // Send connection acknowledgment
    ws.send(
      JSON.stringify({
        event: "connection:established",
        data: { message: "Connected to VedaAI WebSocket server" },
      })
    );

    ws.on("close", () => {
      clients.delete(ws);
      logger.info(
        `WebSocket client disconnected. Total clients: ${clients.size}`
      );
    });

    ws.on("error", (error) => {
      logger.error("WebSocket client error:", error.message);
      clients.delete(ws);
    });
  });

  logger.success("WebSocket server initialized on /ws");
  return wss;
};

/**
 * Broadcast a message to all connected clients
 */
export const broadcast = (message: WSMessage): void => {
  const data = JSON.stringify(message);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });

  logger.info(
    `Broadcasted ${message.event} to ${clients.size} clients | Assignment: ${message.data.assignmentId}`
  );
};

/**
 * Get the WebSocket server instance
 */
export const getWSS = (): WebSocketServer | null => wss;
