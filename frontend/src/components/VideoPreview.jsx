/**
 * VideoPreview Component
 * Shows reel thumbnail, metadata, and the video player
 */

import React, { useState } from 'react';
import { User, Clock, Heart, Eye, Play, ExternalLink, CheckCircle } from 'lucide-react';

export default function VideoPreview({ data }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  if (!data) return null;

  const {
    title, username, duration, thumbnail,
    videoUrl, originalUrl, likes, views,
  } = data;

  /* ── Format numbers ────────────────────────────────────────── */
  const fmt = (n) => {
    if (!n) return null;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <section className="max-w-3xl mx-auto px-6 mb-10 fade-up">
      <div className="glass-card overflow-hidden">

        {/* ── Success banner ──────────────────────────────────── */}
        <div className="flex items-center gap-2 px-6 py-3"
             style={{
               background: 'linear-gradient(90deg, rgba(34,197,94,0.1), rgba(34,197,94,0.04))',
               borderBottom: '1px solid rgba(34,197,94,0.15)',
             }}>
          <CheckCircle size={15} style={{ color: '#4ade80' }} />
          <span className="text-sm font-medium" style={{ color: '#4ade80', fontFamily: 'DM Sans, sans-serif' }}>
            Reel fetched successfully!
          </span>
        </div>

        <div className="p-6 sm:p-8">
          {/* ── Metadata row ─────────────────────────────────── */}
          <div className="flex items-start gap-5 mb-6">

            {/* Thumbnail */}
            <div className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden"
                 style={{ background: 'var(--ink-600)', border: '1px solid var(--border)' }}>
              {thumbnail && !thumbError ? (
                <img
                  src={thumbnail}
                  alt="Reel thumbnail"
                  className="w-full h-full object-cover"
                  onError={() => setThumbError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play size={28} style={{ color: 'var(--text-muted)' }} fill="currentColor" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1 truncate"
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                  }}>
                {title || 'Instagram Reel'}
              </h3>

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-sm"
                     style={{ color: 'var(--text-secondary)' }}>
                  <User size={13} style={{ color: 'var(--coral)' }} />
                  <span>@{username}</span>
                </div>
                {duration && duration !== 'Unknown' && (
                  <div className="flex items-center gap-1.5 text-sm"
                       style={{ color: 'var(--text-secondary)' }}>
                    <Clock size={13} style={{ color: 'var(--coral)' }} />
                    <span>{duration}</span>
                  </div>
                )}
                {fmt(likes) && (
                  <div className="flex items-center gap-1.5 text-sm"
                       style={{ color: 'var(--text-secondary)' }}>
                    <Heart size={13} style={{ color: '#f472b6' }} />
                    <span>{fmt(likes)}</span>
                  </div>
                )}
                {fmt(views) && (
                  <div className="flex items-center gap-1.5 text-sm"
                       style={{ color: 'var(--text-secondary)' }}>
                    <Eye size={13} style={{ color: '#60a5fa' }} />
                    <span>{fmt(views)} plays</span>
                  </div>
                )}
              </div>

              {/* External link */}
              <a href={originalUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1.5 mt-3 text-xs transition-opacity hover:opacity-80"
                 style={{ color: 'var(--coral)', fontFamily: 'DM Sans, sans-serif' }}>
                <ExternalLink size={11} />
                View on Instagram
              </a>
            </div>
          </div>

          {/* ── Video Player ──────────────────────────────────── */}
          {videoUrl && (
            <div className="video-preview" style={{ background: '#000' }}>
              <video
                key={videoUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full"
                style={{ maxHeight: '480px', display: 'block' }}
                onLoadedData={() => setVideoLoaded(true)}>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* No video URL fallback */}
          {!videoUrl && (
            <div className="rounded-2xl flex items-center justify-center py-12"
                 style={{ background: 'var(--ink-700)', border: '1px solid var(--border)' }}>
              <div className="text-center">
                <Play size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Video preview unavailable
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
