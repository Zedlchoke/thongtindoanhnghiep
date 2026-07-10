import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Test database connection first
  try {
    log("🔌 Testing database connection...");
    const { pool } = await import("./db");
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    log("✅ Database connection successful");

    log("🔄 Initializing database schema...");
    await storage.initializeDatabase();
    log("✅ Database initialization completed");
  } catch (error) {
    log(`❌ Database error: ${error}`);
    log("🔄 Continuing without database initialization...");
    // Continue running to allow UI access even if database fails
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static files from client build
  const buildPath = path.join(process.cwd(), "dist", "public");
  if (!fs.existsSync(buildPath)) {
    console.warn(`⚠️ Client build not found at: ${buildPath}`);
    console.warn(`⚠️ Please run 'npm run build' to build the client`);
    console.warn(`⚠️ Continuing without static file serving...`);
  } else {
    app.use(express.static(buildPath));
    console.log(`✅ Serving static files from: ${buildPath}`);
  }


  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Catch-all handler: send back React's index.html file for client-side routing
    app.get("*", (req, res) => {
      const indexPath = path.join(buildPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(503).json({ 
          error: "Client application not available", 
          message: "Please run 'npm run build' to build the client application",
          apiHealth: "OK - Backend is running"
        });
      }
    });
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const PORT = parseInt(process.env.PORT || '5000', 10);

  server.listen({
    port: PORT,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${PORT}`);
  });
})();