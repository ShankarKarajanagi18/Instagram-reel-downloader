/**
 * useReelDownloader – custom hook for all reel fetching/download logic
 */

import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE =
  process.env.REACT_APP_API_URL?.trim() ||
  'https://instagram-reel-downloader-igcn.onrender.com/api';

export function useReelDownloader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reelData, setReelData] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);

  /**
   * Validates URL client-side before hitting the API
   */
  const validateUrl = useCallback((url) => {
    try {
      const parsed = new URL(url.trim());
      const isIg = parsed.hostname === 'www.instagram.com' || parsed.hostname === 'instagram.com';
      const isReel = /\/(reel|reels|p)\/[A-Za-z0-9_-]+/.test(parsed.pathname);
      return isIg && isReel;
    } catch {
      return false;
    }
  }, []);

  /**
   * Fetches reel metadata from the backend
   */
  const fetchReel = useCallback(async (url) => {
    setError(null);
    setReelData(null);

    if (!url.trim()) {
      setError('Please paste an Instagram Reel URL first.');
      return;
    }

    if (!validateUrl(url)) {
      setError('That doesn\'t look like a valid Instagram Reel URL. Make sure it contains /reel/, /reels/, or /p/');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/download/reel`, { url: url.trim() });

      if (data.success) {
        setReelData(data.data);
      } else {
        setError(data.message || 'Failed to fetch reel data.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Network error. Please check your connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [validateUrl]);

  /**
   * Triggers the download via the proxy endpoint
   */
  const downloadReel = useCallback(async () => {
    if (!reelData?.videoUrl) return;
    
    setDownloadProgress('preparing');
    try {
      const proxyUrl = `${API_BASE}/download/proxy?videoUrl=${encodeURIComponent(reelData.videoUrl)}&filename=reel_${reelData.shortcode}.mp4`;

      // Create an anchor and trigger download
      const a = document.createElement('a');
      a.href = proxyUrl;
      a.download = `reel_${reelData.shortcode || 'download'}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadProgress('complete');
      setTimeout(() => setDownloadProgress(null), 3000);
    } catch (err) {
      setDownloadProgress(null);
      setError('Download failed. Please try again.');
    }
  }, [reelData]);

  const reset = useCallback(() => {
    setReelData(null);
    setError(null);
    setDownloadProgress(null);
  }, []);

  return { loading, error, reelData, downloadProgress, fetchReel, downloadReel, validateUrl, reset };
}


/**
 * useDownloadHistory – persists recent downloads in localStorage
 */
export function useDownloadHistory() {
  const STORAGE_KEY = 'reelgrab_history';
  const MAX_ITEMS = 10;

  const getHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }, []);

  const addToHistory = useCallback((reelData) => {
    try {
      const history = getHistory();
      const newEntry = {
        id: Date.now(),
        shortcode: reelData.shortcode,
        title: reelData.title,
        username: reelData.username,
        thumbnail: reelData.thumbnail,
        duration: reelData.duration,
        originalUrl: reelData.originalUrl,
        downloadedAt: new Date().toISOString(),
      };

      // Remove duplicate if exists
      const filtered = history.filter(h => h.shortcode !== reelData.shortcode);
      const updated = [newEntry, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Fail silently if localStorage unavailable
    }
  }, [getHistory]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { getHistory, addToHistory, clearHistory };
}


/**
 * useDarkMode – manages dark/light theme toggle
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('reelgrab_theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('reelgrab_theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { isDark, toggle };
}
