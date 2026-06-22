import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleVasDeactivate, handleVasDetail, handleVasStatus } from "./routes/vas";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/vas/status", handleVasStatus);
  app.get("/api/vas/detail", handleVasDetail);
  app.get("/api/vas/deactivate", handleVasDeactivate);

  return app;
}
