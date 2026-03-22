/**
 * Download Routes
 * Handles Instagram reel URL processing and metadata extraction
 */

const express = require("express");
const router = express.Router();
const { instagramGetUrl } = require("instagram-url-direct");
const axios = require("axios");

/* ─── Helpers ─────────────────────────────────────────────── */

/**
 * Validates an Instagram Reel URL
 * Supports: /reel/, /reels/, /p/ post URLs
 */
function isValidInstagramUrl(url) {
  try {
    const parsed = new URL(url);
    const isInstagram = parsed.hostname === "www.instagram.com" || parsed.hostname === "instagram.com";
    const isValidPath = /\/(reel|reels|p)\/[A-Za-z0-9_-]+/.test(parsed.pathname);
    return isInstagram && isValidPath;
  } catch {
    return false;
  }
}

/**
 * Extracts the shortcode from an Instagram URL
 */
function extractShortcode(url) {
  const match = url.match(/\/(reel|reels|p)\/([A-Za-z0-9_-]+)/);
  return match ? match[2] : null;
}

/**
 * Formats seconds to human-readable duration (MM:SS)
 */
function formatDuration(seconds) {
  if (!seconds) return "Unknown";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── POST /api/download/reel ─────────────────────────────── */
router.post("/reel", async (req, res) => {
  const { url } = req.body;

  // ── 1. Validate input ──────────────────────────────────────
  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, message: "URL is required." });
  }

  const trimmedUrl = url.trim();

  if (!isValidInstagramUrl(trimmedUrl)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Instagram URL. Please paste a valid Reel or post link.",
    });
  }

  try {
    // ── 2. Extract reel data via instagram-url-direct ────────
    const result = await instagramGetUrl(trimmedUrl);

    if (!result || !result.results_number || result.results_number === 0) {
      return res.status(404).json({
        success: false,
        message: "Could not fetch reel. The post may be private, deleted, or region-locked.",
      });
    }

    const shortcode = extractShortcode(trimmedUrl);

    // ── 3. Build response payload ────────────────────────────
    const videos = result.url_list || [];
    const primaryVideo = videos[0] || null;

    const responseData = {
      success: true,
      data: {
        shortcode,
        originalUrl: trimmedUrl,
        videoUrl: primaryVideo,
        allQualities: videos,
        // Metadata from instagram-url-direct (when available)
        thumbnail: result.thumbnail || null,
        title: result.title || `Instagram Reel – ${shortcode}`,
        username: result.username || "instagram_user",
        duration: result.duration ? formatDuration(result.duration) : "Unknown",
        durationSeconds: result.duration || null,
        likes: result.like_count || null,
        views: result.play_count || null,
        timestamp: new Date().toISOString(),
      },
    };

    return res.json(responseData);

  } catch (error) {
    console.error("[Download Error]:", error.message);

    // Handle specific known errors
    if (error.message?.includes("private")) {
      return res.status(403).json({ success: false, message: "This account is private." });
    }
    if (error.message?.includes("not found") || error.message?.includes("404")) {
      return res.status(404).json({ success: false, message: "Reel not found. It may have been deleted." });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to process this reel. Please try again or use a different link.",
    });
  }
});

/* ─── GET /api/download/proxy ─────────────────────────────── */
/**
 * Proxy endpoint to stream video so browser can trigger download
 * Avoids CORS issues when downloading directly from Instagram CDN
 */
router.get("/proxy", async (req, res) => {
  const { videoUrl, filename = "reel.mp4" } = req.query;

  if (!videoUrl) {
    return res.status(400).json({ success: false, message: "videoUrl is required" });
  }

  // Only allow Instagram CDN domains
  const allowedDomains = ["cdninstagram.com", "instagram.com", "fbcdn.net", "scontent"];
  const isAllowed = allowedDomains.some((d) => videoUrl.includes(d));

  if (!isAllowed) {
    return res.status(403).json({ success: false, message: "Unauthorized video source." });
  }

  try {
    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.instagram.com/",
      },
      timeout: 30000,
    });

    // Set download headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "video/mp4");

    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }

    // Stream the video to client
    response.data.pipe(res);

  } catch (error) {
    console.error("[Proxy Error]:", error.message);
    res.status(500).json({ success: false, message: "Failed to stream video." });
  }
});

module.exports = router;
