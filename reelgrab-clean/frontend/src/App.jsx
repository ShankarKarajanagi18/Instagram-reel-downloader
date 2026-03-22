/**
 * App.jsx – Root component for ReelGrab
 * Orchestrates all sections, dark mode, and state management
 */

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InputSection from './components/InputSection';
import VideoPreview from './components/VideoPreview';
import DownloadSection from './components/DownloadSection';
import DownloadHistory from './components/DownloadHistory';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import { useReelDownloader, useDownloadHistory, useDarkMode } from './hooks/useReelDownloader';

export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { addToHistory } = useDownloadHistory();
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const {
    loading, error, reelData,
    downloadProgress, fetchReel,
    downloadReel, reset,
  } = useReelDownloader();

  /* ── Apply dark/light class to <html> ────────────────────── */
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
    }
  }, [isDark]);

  /* ── When reel data arrives, save to history ─────────────── */
  useEffect(() => {
    if (reelData) {
      addToHistory(reelData);
      setHistoryRefresh(n => n + 1);
    }
  }, [reelData, addToHistory]);

  /* ── Reload from history item ────────────────────────────── */
  const handleHistoryReload = useCallback((url) => {
    reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => fetchReel(url), 300);
  }, [reset, fetchReel]);

  /* ── Download + save ─────────────────────────────────────── */
  const handleDownload = useCallback(() => {
    downloadReel();
    if (reelData) {
      addToHistory(reelData);
      setHistoryRefresh(n => n + 1);
    }
  }, [downloadReel, reelData, addToHistory]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-900)', transition: 'background 0.4s ease' }}>

      {/* ── Background ambient orbs ───────────────────────── */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="orb orb-coral" style={{ width: 600, height: 600, top: '-200px', left: '-200px' }} />
        <div className="orb orb-purple" style={{ width: 500, height: 500, top: '30%', right: '-150px' }} />
        <div className="orb orb-blue" style={{ width: 400, height: 400, bottom: '10%', left: '20%' }} />
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar isDark={isDark} onToggleDark={toggleDark} />
        <Hero />
        <InputSection
          onFetch={fetchReel}
          loading={loading}
          error={error}
          onClearError={reset}
        />
        {reelData && <VideoPreview data={reelData} />}
        {reelData && (
          <DownloadSection
            data={reelData}
            onDownload={handleDownload}
            downloadProgress={downloadProgress}
          />
        )}
        <DownloadHistory
          onReload={handleHistoryReload}
          refreshTrigger={historyRefresh}
        />
        <HowItWorks />
        <Footer />
      </div>
    </div>
  );
}
