/**
 * DownloadHistory Component
 * Shows recent downloads fetched from localStorage
 */

import React, { useState, useEffect } from 'react';
import { Clock, Download, Trash2, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { useDownloadHistory } from '../hooks/useReelDownloader';

export default function DownloadHistory({ onReload, refreshTrigger }) {
  const { getHistory, clearHistory } = useDownloadHistory();
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  /* ── Load history on mount + when refreshTrigger changes ──── */
  useEffect(() => {
    setHistory(getHistory());
  }, [getHistory, refreshTrigger]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  /* ── Format relative time ─────────────────────────────────── */
  const timeAgo = (isoString) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  if (history.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 mb-10 fade-up">
      <div className="glass-card overflow-hidden">

        {/* ── Header ────────────────────────────────────────────── */}
        <button
          onClick={() => setIsOpen(o => !o)}
          className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
          style={{ borderBottom: isOpen ? '1px solid var(--border)' : 'none' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'rgba(255,107,86,0.12)' }}>
              <Clock size={15} style={{ color: 'var(--coral)' }} />
            </div>
            <div>
              <span className="font-semibold text-sm"
                    style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)' }}>
                Recent Downloads
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--ink-600)', color: 'var(--text-muted)' }}>
                {history.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isOpen && (
              <button
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <Trash2 size={12} />
                Clear
              </button>
            )}
            {isOpen ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} />
                    : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
          </div>
        </button>

        {/* ── History list ─────────────────────────────────────── */}
        {isOpen && (
          <div className="p-4 sm:p-5 space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => onReload?.(item.originalUrl)}
                title="Click to reload this reel">

                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                     style={{ background: 'var(--ink-600)' }}>
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover"
                         onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play size={18} style={{ color: 'var(--text-muted)' }} fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate"
                     style={{ color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif' }}>
                    @{item.username || 'unknown'}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {item.title || item.shortcode}
                  </p>
                </div>

                {/* Right */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {timeAgo(item.downloadedAt)}
                  </p>
                  {item.duration && item.duration !== 'Unknown' && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--coral)' }}>
                      {item.duration}
                    </p>
                  )}
                </div>

                {/* Download icon */}
                <Download size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
