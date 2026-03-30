/**
 * Hero Component
 * Headline + subheadline + feature badges
 */

import React from 'react';
import { Shield, Zap, Download } from 'lucide-react';

const features = [
  { icon: Zap, label: 'Instant Download' },
  { icon: Shield, label: 'No Login Required' },
  { icon: Download, label: 'HD Quality' },
];

export default function Hero() {
  return (
    <section className="relative text-center px-6 pt-10 pb-16 overflow-hidden" id="features">

      {/* Tag chip */}
      <div className="flex justify-center mb-6 fade-up">
        <div className="tag-chip">
          <span>✦</span> Free Instagram Reel Downloader
        </div>
      </div>

      {/* Headline */}
      <h1 className="fade-up delay-100"
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 6vw, 3.75rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}>
        Download Any Reel
        <br />
        <span className="gradient-text">Instantly & Free</span>
      </h1>

      {/* Subheadline */}
      <p className="fade-up delay-200 max-w-xl mx-auto"
         style={{
           fontFamily: 'DM Sans, sans-serif',
           fontSize: '1.05rem',
           lineHeight: 1.7,
           color: 'var(--text-secondary)',
           marginBottom: '2.5rem',
         }}>
        Paste any public Instagram Reel link and download it in HD quality —
        no account, no watermarks, no hassle.
      </p>

      {/* Feature pills */}
      <div className="fade-up delay-300 flex flex-wrap justify-center gap-3">
        {features.map(({ icon: Icon, label }) => (
          <div key={label}
               className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
               style={{
                 background: 'rgba(255,255,255,0.04)',
                 border: '1px solid var(--border)',
                 color: 'var(--text-secondary)',
                 fontFamily: 'DM Sans, sans-serif',
                 fontWeight: 500,
               }}>
            <Icon size={14} style={{ color: 'var(--coral)' }} />
            {label}
          </div>
        ))}
      </div>

    </section>
  );
}
