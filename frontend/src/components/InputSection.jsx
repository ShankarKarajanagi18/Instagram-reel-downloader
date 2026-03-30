/**
 * InputSection Component
 * URL input, paste button, validate + fetch
 */

import React, { useState, useRef } from 'react';
import { Link, Clipboard, X, ArrowRight, AlertCircle } from 'lucide-react';

export default function InputSection({ onFetch, loading, error, onClearError }) {
  const [url, setUrl] = useState('');
  const inputRef = useRef(null);

  /* ── Paste from clipboard ─────────────────────────────────── */
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      onClearError?.();
      inputRef.current?.focus();
    } catch {
      // Clipboard permission denied – focus input so user can paste manually
      inputRef.current?.focus();
    }
  };

  /* ── Copy URL back to clipboard ─────────────────────────────*/
  const handleCopy = async () => {
    if (!url) return;
    try { await navigator.clipboard.writeText(url); } catch {}
  };

  /* ── Submit ───────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    onFetch(url);
  };

  /* ── Clear field ──────────────────────────────────────────── */
  const handleClear = () => {
    setUrl('');
    onClearError?.();
    inputRef.current?.focus();
  };

  return (
    <section className="max-w-3xl mx-auto px-6 mb-10">
      <div className="glass-card p-6 sm:p-8 fade-up delay-400">

        {/* ── Input form ───────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-3 text-sm font-medium"
                 style={{ color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
            Instagram Reel URL
          </label>

          {/* Input row */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* URL input with icon + clear */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Link size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <input
                ref={inputRef}
                type="url"
                className="reel-input"
                style={{ paddingLeft: '42px', paddingRight: url ? '42px' : '14px' }}
                placeholder="https://www.instagram.com/reel/..."
                value={url}
                onChange={e => { setUrl(e.target.value); onClearError?.(); }}
                disabled={loading}
                aria-label="Instagram reel URL"
              />
              {url && !loading && (
                <button type="button" onClick={handleClear}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-50 hover:opacity-100 transition-opacity"
                        aria-label="Clear input">
                  <X size={15} style={{ color: 'var(--text-secondary)' }} />
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {/* Paste button */}
              <button
                type="button"
                onClick={handlePaste}
                disabled={loading}
                className="btn-ghost flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap"
                aria-label="Paste from clipboard">
                <Clipboard size={15} />
                <span className="hidden sm:inline">Paste</span>
              </button>

              {/* Copy button */}
              {url && (
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={loading}
                  className="btn-ghost flex items-center gap-2 px-4 py-3 text-sm tooltip"
                  data-tip="Copy URL"
                  aria-label="Copy URL">
                  <Link size={15} />
                </button>
              )}

              {/* Fetch button */}
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="btn-coral flex items-center gap-2 px-6 py-3 whitespace-nowrap">
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18 }} />
                    <span>Fetching…</span>
                  </>
                ) : (
                  <>
                    <span>Get Reel</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ── Progress bar while loading ────────────────────────── */}
        {loading && (
          <div className="mt-4 rounded-full overflow-hidden" style={{ background: 'var(--ink-600)', height: '3px' }}>
            <div className="progress-bar" />
          </div>
        )}

        {/* ── Error message ─────────────────────────────────────── */}
        {error && (
          <div className="error-card mt-4 fade-up">
            <AlertCircle size={18} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Helper text ───────────────────────────────────────── */}
        {!error && !loading && (
          <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            Supports public reels only. Paste a link like{' '}
            <code className="px-1 py-0.5 rounded text-xs"
                  style={{ background: 'var(--ink-600)', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
              instagram.com/reel/ABC123/
            </code>
          </p>
        )}

      </div>
    </section>
  );
}
