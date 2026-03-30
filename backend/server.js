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

/* ─── Security Middleware ─────────────────────────────────── */
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
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

/* ─── 404 Handler ─────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ─── Global Error Handler ────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
});
