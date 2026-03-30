/**
 * DownloadSection Component
 * Download button + quality selector + status indicator
 */

import React, { useState } from 'react';
import { Download, CheckCircle, Loader, Copy, ExternalLink } from 'lucide-react';

export default function DownloadSection({ data, onDownload, downloadProgress }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const { videoUrl, allQualities = [], shortcode } = data;

  /* ── Copy video URL to clipboard ──────────────────────────── */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  /* ── Download state config ────────────────────────────────── */
  const isPreparing = downloadProgress === 'preparing';
  const isComplete  = downloadProgress === 'complete';

  return (
    <section className="max-w-3xl mx-auto px-6 mb-10 fade-up">
      <div className="glass-card p-6 sm:p-8">

        <div className="flex flex-col sm:flex-row items-center gap-4">

          {/* ── Primary Download Button ─────────────────────── */}
          <button
            onClick={onDownload}
            disabled={isPreparing || !videoUrl}
            className="btn-coral w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-base"
            style={{ minWidth: '220px' }}>

            {isComplete ? (
              <>
                <CheckCircle size={20} className="success-pulse" />
                <span>Downloaded!</span>
              </>
            ) : isPreparing ? (
              <>
                <Loader size={20} className="animate-spin" />
                <span>Preparing…</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span>Download MP4</span>
              </>
            )}
          </button>

          {/* ── Secondary actions ────────────────────────────── */}
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              disabled={!videoUrl}
              className="btn-ghost flex items-center gap-2 px-4 py-4 text-sm flex-1 sm:flex-none justify-center">
              {copied
                ? <><CheckCircle size={15} style={{ color: '#4ade80' }} /> Copied!</>
                : <><Copy size={15} /> Copy Link</>}
            </button>

            {/* Open in new tab */}
            {videoUrl && (
              <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                 className="btn-ghost flex items-center gap-2 px-4 py-4 text-sm flex-1 sm:flex-none justify-center">
                <ExternalLink size={15} />
                <span>Open</span>
              </a>
            )}
          </div>
        </div>

        {/* ── Quality options (if multiple) ────────────────────── */}
        {allQualities.length > 1 && (
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              All available links
            </p>
            <div className="flex flex-wrap gap-2">
              {allQualities.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                   className="btn-ghost flex items-center gap-1.5 px-3 py-2 text-xs">
                  <Download size={12} />
                  Version {i + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Info note ────────────────────────────────────────── */}
        <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          ⚠️ For personal use only. Respect Instagram's Terms of Service and creator rights.
        </p>

      </div>
    </section>
  );
}
