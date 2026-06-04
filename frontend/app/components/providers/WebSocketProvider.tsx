"use client";

import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { WSMessage } from "@/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000/ws";

export default function WebSocketProvider() {
  const wsRef = useRef<WebSocket | null>(null);
  const { updateAssignment } = useAssignmentStore();

  useEffect(() => {
    // Initialize WebSocket connection
    const connect = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("Connected to WebSocket Server");
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting in 3s...");
        setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent auto-reconnect on unmount
        wsRef.current.close();
      }
    };
  }, []);

  const handleMessage = (message: WSMessage) => {
    const { event, data } = message;
    const { assignmentId, progress, message: statusMsg, error, paperId } = data;
    if (!assignmentId) return;

    switch (event) {
      case "generation:started":
        updateAssignment(assignmentId, { status: "processing" });
        toast.loading("Started generating your assignment...", {
          id: `gen-${assignmentId}`,
          duration: 4000,
        });
        break;

      case "generation:progress":
        if (progress === 100) {
          toast.success("Generation structuring complete!", {
            id: `gen-${assignmentId}`,
          });
        } else {
          toast.loading(`Progress ${progress}%: ${statusMsg}`, {
            id: `gen-${assignmentId}`,
          });
        }
        break;

      case "generation:completed":
        updateAssignment(assignmentId, {
          status: "completed",
          generatedPaper: paperId,
        });
        toast.success("Assignment generation completed successfully!", {
          id: `gen-${assignmentId}`,
          duration: 5000,
        });
        break;

      case "generation:failed":
        updateAssignment(assignmentId, { status: "failed" });
        toast.error(`Generation failed: ${error}`, {
          id: `gen-${assignmentId}`,
          duration: 6000,
        });
        break;
    }
  };

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "text-sm font-medium",
        success: {
          iconTheme: {
            primary: "#10b981", // accent-green
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // accent-red
            secondary: "white",
          },
        },
      }}
    />
  );
}
