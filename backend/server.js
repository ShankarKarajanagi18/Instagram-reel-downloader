/**
 * Instagram Reels Downloader - Backend Server
 * Node.js + Express API
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const downloadRoutes = require("./routes/download");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

/* Parse allowed frontend origins from env (comma-separated) */
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/* Required for correct client IP detection behind reverse proxies (Render/Railway/etc.) */
app.set("trust proxy", 1);

/* ─── Security Middleware ─────────────────────────────────── */
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests and same-origin requests with no Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10kb" }));

/* ─── Global Rate Limiter ─────────────────────────────────── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(globalLimiter);

/* ─── Strict Rate Limiter for Download Route ──────────────── */
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 downloads per minute
  message: { success: false, message: "Download limit reached. Please wait a moment." },
});

/* ─── Routes ──────────────────────────────────────────────── */
app.use("/api/download", downloadLimiter, downloadRoutes);

/* ─── Health Check ────────────────────────────────────────── */
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running", timestamp: new Date().toISOString() });
});

/* ─── Root Info Route ─────────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Instagram Reels Downloader API is running",
    endpoints: {
      health: "/api/health",
      reel: "POST /api/download/reel",
      proxy: "GET /api/download/proxy?videoUrl=<url>&filename=reel.mp4",
    },
  });
});

/* ─── 404 Handler ─────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ─── Global Error Handler ────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Health check: /api/health`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});
