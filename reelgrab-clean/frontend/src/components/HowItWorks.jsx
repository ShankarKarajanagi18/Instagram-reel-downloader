/**
 * HowItWorks Component
 * 3-step process explainer
 */

import React from 'react';
import { Clipboard, Cpu, Download } from 'lucide-react';

const steps = [
  {
    icon: Clipboard,
    step: '01',
    title: 'Paste the URL',
    desc: 'Copy the link of any public Instagram Reel and paste it into the input box above.',
    color: '#ff6b56',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'We Fetch It',
    desc: 'Our server instantly processes your link, extracts the video, and prepares it for download.',
    color: '#8b5cf6',
  },
  {
    icon: Download,
    step: '03',
    title: 'Download in HD',
    desc: 'Click the download button and save the reel to your device in full MP4 quality.',
    color: '#3b82f6',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="tag-chip inline-flex mb-4">✦ Process</div>
        <h2 style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          How it works
        </h2>
        <p className="mt-3 max-w-md mx-auto text-sm" style={{ color: 'var(--text-secondary)' }}>
          Three simple steps to download any public Instagram Reel in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map(({ icon: Icon, step, title, desc, color }, i) => (
          <div key={step} className="glass-card p-7 relative overflow-hidden fade-up"
               style={{ animationDelay: `${i * 0.1}s` }}>

            {/* Step number watermark */}
            <div className="absolute -top-2 -right-2 font-display font-800 text-6xl select-none pointer-events-none"
                 style={{
                   fontFamily: 'Sora, sans-serif',
                   fontWeight: 800,
                   color: 'rgba(255,255,255,0.03)',
                   lineHeight: 1,
                 }}>
              {step}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                 style={{ background: `${color}1a`, border: `1px solid ${color}33` }}>
              <Icon size={22} style={{ color }} />
            </div>

            {/* Step indicator */}
            <div className="text-xs font-600 mb-2"
                 style={{ color, fontFamily: 'Sora, sans-serif', fontWeight: 600, letterSpacing: '0.06em' }}>
              Step {step}
            </div>

            <h3 className="text-base font-semibold mb-2"
                style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
